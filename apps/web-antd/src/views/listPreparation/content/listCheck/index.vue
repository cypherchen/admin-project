<!--
 * @Author: cwx
 * @Date: 2026-01-15 09:00:26
 * @LastEditTime: 2026-01-23 16:43:57
 * @LastEditors: cwx
 * @Description: 清单编制-清单核查
-->
<script setup lang="tsx">
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { WhereType } from '#/api/basicType';

import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import {
  Button,
  Divider,
  message,
  Progress,
  Select,
  Typography,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { ConditionalType } from '#/api/basicType';
import { getListPreparationVersion } from '#/api/listPreparationApi/listPreparationApi';
import {
  exportListPreparationInspect,
  getListPreparationInspect,
  getListPreparationInspectQuota,
  getListPreparationInspectSummary,
  postListPreparationInspectQuestion,
  postListPreparationInspectQuota,
} from '#/api/listPreparationApi/listPreparationInspectApi';
import { Authority } from '#/components/authority';
import { createLoading } from '#/components/loading';
import { NumberRange } from '#/components/numberRange';
import { listPreparationPermission } from '#/permission';
import { downloadByData } from '#/utils/download';

import { columns } from './data';
import HistoryProject from './historyProject/historyProject.vue';
import InspectReport from './inspectReport/inspectReport.vue';

const props = defineProps<{
  currentNode: null | Record<string, any>;
}>();

const permission = listPreparationPermission!.清单核查;

const route = useRoute();
const vId = (route.params.vId as string) || '';
const pId = (route.params.pId as string) || '';
const auditStatus = (route.query.auditStatus as string) || '';

const disabledByAudit = computed(() => [1, 2].includes(Number(auditStatus)));

const userStore = useUserStore();
const orgId = userStore.userInfo?.Orz_ID || '';

const contrastId = ref<string>();
const questions = ref<string[]>([]);
const questionOptions = ref([
  { label: '全部问题', value: '全部问题' },
  { label: '增项', value: '增项' },
  { label: '缺项', value: '缺项' },
  { label: '名称修改', value: '名称修改' },
  { label: '特征修改', value: '特征修改' },
  { label: '单位修改', value: '单位修改' },
  { label: '工程量修改', value: '工程量修改' },
]);

const gridOptions: VxeGridProps = {
  columns,
  height: 'auto',
  pagerConfig: {
    enabled: false,
  },
  treeConfig: {
    expandAll: true,
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: async () => {
        if (!vId || !contrastId.value) return { List: [] };

        const Where: WhereType[] = [];

        // 全部问题不需要 Result 的Where条件
        if (
          questions.value &&
          questions.value.length > 0 &&
          !questions.value.includes('全部问题')
        ) {
          Where.push({
            ConditionalList: questions.value.map((n, i) => {
              return {
                Key: i === 0 ? 0 : 1,
                Value: {
                  FieldName: 'Result',
                  ConditionalType: ConditionalType.Like,
                  FieldValue: n,
                },
              };
            }),
          });
        }
        const min = deviation.value[0];
        const max = deviation.value[1];
        const hasMin = typeof min === 'number';
        const hasMax = typeof max === 'number';

        if (hasMin && hasMax) {
          Where.push({
            ConditionalList: [
              {
                Key: 0,
                Value: {
                  FieldName: 'DifferenceRate',
                  ConditionalType: ConditionalType.LessThan,
                  FieldValue: min,
                },
              },
              {
                Key: 1,
                Value: {
                  FieldName: 'DifferenceRate',
                  ConditionalType: ConditionalType.GreaterThan,
                  FieldValue: max,
                },
              },
            ],
          });
        } else {
          if (hasMin) {
            Where.push({
              FieldName: 'DifferenceRate',
              ConditionalType: ConditionalType.LessThan,
              FieldValue: min,
            });
          }
          if (hasMax) {
            Where.push({
              FieldName: 'DifferenceRate',
              ConditionalType: ConditionalType.GreaterThan,
              FieldValue: max,
            });
          }
        }

        const params = { Where };
        return getListPreparationInspect(vId, contrastId.value!, params);
      },
    },
  },
  headerCellClassName: ({ column }) => {
    const deepBgColTitle = ['对比文件', '对比文件名'];
    const deepBgColField = [
      'ContrastFile',
      'ContrastFile_Name',
      'CCode',
      'CName',
      'CFeature',
      'CUnit',
      'CQuantity',
      'CPrice',
    ];
    return deepBgColTitle.includes(column.title as string) ||
      (column.field && deepBgColField.includes(column.field))
      ? 'bg-[#276cc7] text-white dark:bg-[#1f1f1f] dark:text-[#a0a3a7]'
      : '';
  },
  cellClassName: ({ row, column }) => {
    const cColumns = [
      'CCode',
      'CName',
      'CFeature',
      'CUnit',
      'CQuantity',
      'CPrice',
    ];
    const classes: string[] = [];
    if (cColumns.includes(column.field)) {
      if (row.Result) {
        const changeFlags: Record<string, boolean> = {
          CName: row.IsNameChange,
          CFeature: row.IsFeatureChange,
          CUnit: row.IsUnitChange,
          CQuantity: row.IsQuantityChange,
          CPrice: row.IsPriceChange,
        };
        if (row.IsMissingItem) {
          classes.push('!bg-[#ff00001a]');
        } else if (row.IsAddition) {
          classes.push('!bg-[#00ff661a]');
        }
        if (changeFlags[column.field]) {
          classes.push('text-red-500');
        }
      }
    }
    if (row.IsTreePath && ['BCode', 'CCode'].includes(column.field)) {
      classes.push('font-semibold');
    }
    return classes.join(' ');
  },
  spanMethod: ({ row, column }) => {
    if (row.IsTreePath) {
      if (column.field === 'BCode') {
        return { rowspan: 1, colspan: 5 };
      } else if (column.field === 'CCode') {
        return { rowspan: 1, colspan: 6 };
      } else if (
        ['Result', 'DifferenceRate'].includes(column.field) ||
        column.type === 'seq'
      ) {
        return { rowspan: 1, colspan: 1 };
      }
      return { rowspan: 1, colspan: 0 };
    }
  },
};

const [VbenVxeGrid, gridApi] = useVbenVxeGrid({
  gridOptions: gridOptions as VxeGridProps,
} as any);

const [ReportModal, reportModalApi] = useVbenModal({
  connectedComponent: InspectReport,
});

const [HistoryModal, historyModalApi] = useVbenModal({
  connectedComponent: HistoryProject,
});

function openReport() {
  reportModalApi.setData({ vId, pId });
  reportModalApi.open();
}

function openHistory() {
  historyModalApi.setData({ list: historyProjects.value }).open();
}

const historyProjects = ref<Record<string, any>[]>([]);
async function getHistory() {
  const res = await getListPreparationInspectSummary(pId, vId);
  // IsDelete为true是历史项目
  historyProjects.value = res.List.filter((n) => n.IsDelete).map((n) => {
    return {
      ID: n.ComparedID,
      Name: n.ComparedName,
    };
  });
}

const benchMarkName = ref<string>('');
const versions = ref<Record<string, any>[]>([]);
async function getVersions() {
  const res = await getListPreparationVersion({ orgId, pId });
  benchMarkName.value = res.List.find((n) => n.ID === vId)!.Name as string;
  versions.value = res.List.filter((n) => n.ID !== vId);
}

const contrastFileOptions = computed(() => [
  ...versions.value,
  ...historyProjects.value,
]);

const deviation = ref<[number | undefined, number | undefined]>([
  undefined,
  undefined,
]);
const isFilter = ref<boolean>(false);
function filterAnomaly() {
  isFilter.value = !isFilter.value;
  if (!isFilter.value) {
    deviation.value = [undefined, undefined];
  }
  gridApi.reload();
}

async function exportExcel() {
  const compared = contrastFileOptions.value.map((n) => {
    return {
      ID: n.ID,
      Name: n.Name,
    };
  });
  const projectName =
    props.currentNode?.treeState.pathNames[0] ?? props.currentNode?.Name;
  const res = await exportListPreparationInspect(vId, {
    compared,
    projectName,
  });
  downloadByData(res, `${projectName}-清单核查.xlsx`);
}

async function handleInspect() {
  const loading = createLoading({
    tip: '清单核查中...',
  });

  try {
    const res = await getListPreparationInspectQuota(vId);

    if (!res || !res.List || res.List.length === 0) {
      message.error('没有需要核查的项目');
      return;
    }

    const nameList: string[] = [];
    for (let i = 0; i < res.List.length; i += 10) {
      const chunk = res.List.slice(i, i + 10);
      const chunkNames = chunk.map((c) => c.Name);
      nameList.push(...chunkNames);

      loading.setTip(
        <div class="w-[400px] rounded-md bg-white p-4 text-left shadow-lg dark:bg-[#141414]">
          <div class="sticky top-0 z-10 bg-white dark:bg-[#141414]">
            <Typography.Title level={5}>正在核查</Typography.Title>
            <Progress
              percent={Math.floor(
                (Math.min(i + 10, res.List.length) / res.List.length) * 100,
              )}
              size="small"
              status="active"
              stroke-color={{ '0%': '#108ee9', '100%': '#87d068' }}
            />
            <Divider class="!my-2" />
          </div>
          <div class="flex h-[300px] flex-col gap-1 overflow-y-auto">
            {nameList.map((n, idx) => (
              <div class="shrink-0 overflow-hidden" key={idx}>
                <Typography.Text ellipsis>{n}</Typography.Text>
              </div>
            ))}
          </div>
        </div>,
      );

      await postListPreparationInspectQuota(vId, chunk);
    }
    await postListPreparationInspectQuestion(vId);
    message.success('核查完成');
    gridApi.reload();
  } finally {
    loading.close();
  }
}

onMounted(async () => {
  await getHistory();
  await getVersions();
  if (contrastFileOptions.value?.length > 0) {
    contrastId.value = contrastFileOptions.value[0]!.ID;
    gridApi.reload();
  }
});
</script>

<template>
  <VbenVxeGrid>
    <template #BenchMarkFile_Name_header>{{ benchMarkName }}</template>
    <template #ContrastFile_Name_header>
      <Select
        v-model:value="contrastId"
        :options="contrastFileOptions"
        :field-names="{ label: 'Name', value: 'ID' }"
        placeholder="请选择对比文件"
        class="w-full"
        @change="gridApi.reload()"
      />
    </template>
    <template #table-title>
      <Authority :value="permission.清单核查_历史项目">
        <Button class="mr-2" :disabled="disabledByAudit" @click="openHistory">
          历史项目
        </Button>
      </Authority>
      <Authority :value="permission.清单核查_一键核查">
        <Button
          class="mr-2"
          type="primary"
          :disabled="disabledByAudit"
          @click="handleInspect"
        >
          一键核查
        </Button>
      </Authority>
      <Button class="mr-2" @click="openReport">问题报告</Button>
      <Authority :value="permission.清单核查_导出excel">
        <Button class="mr-2" @click="exportExcel">导出Excel</Button>
      </Authority>
      <NumberRange v-model:value="deviation" class="w-[300px]">
        <template #prefix> 差异率(%): </template>
        <template #suffix>
          <Button :danger="isFilter" @click="filterAnomaly">
            {{ isFilter ? '取消' : '筛选' }}
          </Button>
        </template>
      </NumberRange>
    </template>
    <template #toolbar-tools>
      <Select
        v-model:value="questions"
        :options="questionOptions"
        mode="multiple"
        allow-clear
        :max-tag-count="2"
        placeholder="请选择问题类型"
        class="w-[300px]"
        @change="gridApi.reload()"
      />
    </template>
  </VbenVxeGrid>
  <ReportModal />
  <HistoryModal @reload-history="getHistory" />
</template>
