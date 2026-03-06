<!--
 * @Author: cwx
 * @Date: 2026-01-15 11:48:19
 * @LastEditTime: 2026-03-07 00:50:50
 * @LastEditors: cwx
 * @Description: 自动套价-项目清单
-->
<script lang="ts" setup name="ProjectList">
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import type { WhereType } from '#/api/basicType';

import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import {
  Button,
  Flex,
  Input,
  InputGroup,
  message,
  Popover,
  Select,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAutoPricingByProjectID } from '#/api/autoPricingApi/autoPricingApi';
import {
  getAutoPricingList,
  getAutoPricingListExport,
  putAutoPricingListDeclineRate,
} from '#/api/autoPricingApi/autoPricingListApi';
import { ConditionalType } from '#/api/basicType';
import { getQuotationTemplate } from '#/api/quotationTemplateApi/quotationTemplateApi';
import { Authority } from '#/components/authority';
import { TableAction } from '#/components/tableAction';
import { autoPricingPermission } from '#/permission';
import { downloadByData } from '#/utils/download';

import { columns, searchFormSchema } from './data';

const props = defineProps<{
  currentNode: null | Record<string, any>;
}>();

const route = useRoute();

const permission = autoPricingPermission!.项目清单;

const pId = route.params.pId as string;
const vId = route.params.vId as string;

const currentProject = ref<Record<string, any>>({});
const declineRate = ref<string>('');

const disabledByAudit = computed(() =>
  [1, 2].includes(Number(route.query?.auditStatus)),
);

const gridOptions: VxeGridProps = {
  columns,
  keepSource: true,
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
      query: async (_params, formValues) => {
        if (!vId) return { List: [] };

        const Where: WhereType[] = [];
        if (formValues.Name) {
          Where.push({
            FieldName: 'Name',
            ConditionalType: ConditionalType.Like,
            FieldValue: formValues.Name,
          });
        }

        const params = {
          Where,
          Order: 'Sort asc',
        };

        return getAutoPricingList({
          vId,
          treeId: props.currentNode?.ID,
          params,
        });
      },
    },
  },
};

const gridEvents: VxeGridListeners = {};

const [VbenVxeGrid, gridApi] = useVbenVxeGrid({
  gridOptions: gridOptions as VxeGridProps,
  gridEvents,
  formOptions: {
    schema: searchFormSchema,
    showCollapseButton: false,
  },
  separator: false,
} as any);

async function getProject() {
  const res = await getAutoPricingByProjectID(pId);
  currentProject.value = res.List || {};
}

const exportTemplate = ref<string>();
const exportTemplateOptions = ref<Record<string, any>[]>([]);
async function getExportTemplateOptions() {
  const res = await getQuotationTemplate({ PageIndex: 1, PageSize: 100 });
  exportTemplateOptions.value = res.List;
}

async function exportExcel() {
  if (!exportTemplate.value) {
    message.error('请选择导出模板');
    return;
  }
  try {
    const res = await getAutoPricingListExport(vId, exportTemplate.value);

    downloadByData(
      res,
      `【${currentProject.value.BaseTreeName}】-${currentProject.value.Name}-项目清单.zip`,
    );
    exportTemplate.value = undefined;
  } catch (error) {
    console.error(error);
  }
}

async function changeDeclineRate() {
  const checked = gridApi.grid?.getCheckboxRecords();
  if (!checked || checked.length === 0) {
    message.error('未勾选数据');
    return;
  }
  if (!declineRate.value) {
    message.error('请输入下浮率');
    return;
  }
  const data = {
    listIds: checked.map((n: any) => n.ID),
    declineRate: declineRate.value,
  };
  await putAutoPricingListDeclineRate(vId, data);
  message.success('下浮率修改成功');
  gridApi.reload();
}

function handleAutoPricing() {
  message.info('自动套价功能待迁移');
}
function handleQuery(row: Record<string, any>) {
  console.warn(row);
  message.info('查询功能待迁移');
}
function handleExpenseComposition(row: Record<string, any>) {
  console.warn(row);
  message.info('单价组成功能待迁移');
}
onMounted(() => {
  getProject();
  getExportTemplateOptions();
  gridApi.reload();
});
</script>

<template>
  <VbenVxeGrid>
    <template #toolbar-actions>
      <Flex gap="8" align="center">
        <Authority :value="permission.项目清单_自动套价">
          <Button
            :disabled="disabledByAudit"
            type="primary"
            @click="handleAutoPricing"
          >
            自动套价
          </Button>
        </Authority>
        <Authority :value="permission.项目清单_下浮率">
          <InputGroup compact>
            <Input
              v-model:value="declineRate"
              :disabled="disabledByAudit"
              style="width: 100px"
              suffix="%"
            />
            <Button :disabled="disabledByAudit" @click="changeDeclineRate">
              下浮率
            </Button>
          </InputGroup>
        </Authority>
        <Authority :value="permission.项目清单_导出">
          <Popover placement="bottom" trigger="click">
            <template #content>
              <Flex align="center" gap="8">
                <Select
                  v-model:value="exportTemplate"
                  :options="exportTemplateOptions"
                  :field-names="{ label: 'Name', value: 'ID' }"
                  placeholder="请选择导出报价模板"
                  class="w-[300px]"
                />
                <Button type="primary" @click="exportExcel">确认</Button>
              </Flex>
            </template>
            <Button>导出报价清单</Button>
          </Popover>
        </Authority>
      </Flex>
    </template>

    <template #Name="{ row }">
      <Button
        type="link"
        :danger="row.ISAlone"
        @click="handleExpenseComposition(row)"
      >
        {{ row.Name }}
      </Button>
    </template>

    <template #action="{ row }">
      <TableAction
        :actions="[
          {
            icon: 'ZoomInOutlined',
            tooltip: '查询',
            model: 'button',
            ifShow: !row.children || row.children.length === 0,
            disabled: disabledByAudit,
            onClick: handleQuery.bind(null, row),
          },
        ]"
      />
    </template>
  </VbenVxeGrid>
</template>
