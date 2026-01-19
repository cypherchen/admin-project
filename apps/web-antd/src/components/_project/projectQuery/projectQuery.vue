<!--
 * @Author: cwx
 * @Date: 2026-01-18 20:28:35
 * @LastEditTime: 2026-01-19 15:18:01
 * @LastEditors: cwx
 * @Description: 项目查询
-->
<script setup lang="ts" name="ProjectQuery">
import type { SelectProps } from 'ant-design-vue';

import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import type { BasicParamsType } from '#/api/basicType';

import { computed, nextTick, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useUserStore } from '@vben/stores';

import { watchDebounced } from '@vueuse/core';
import {
  Card,
  Divider,
  Empty,
  Flex,
  Input,
  Pagination,
  Radio,
  Select,
  Spin,
} from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getBase } from '#/api/dataManagementApi/baseManagementApi';
import {
  getProjectByFilter,
  getProjectQueryParams,
} from '#/api/projectRepositoryApi/projectRepositoryApi';
import projectBg from '#/assets/images/_project/projectBg.jpg';
import { BusinessTypeTree } from '#/components/_project/businessTypeTree';
import { TableAction } from '#/components/tableAction';
import { formatPrice } from '#/utils/number';

type ModeType = 'card' | 'table';

type FilterConfig = {
  base?: {
    disabled?: boolean;
    value?: string | undefined;
  };
  keyName?: {
    disabled?: boolean;
    value?: string | undefined;
  };
  level?: {
    disabled: boolean;
    value?: number | undefined;
  };
};

interface ParamItem {
  ID: number;
  Name: string;
  InputType: number;
  Options?: { label: string; value: string }[];
  range: [number | undefined, number | undefined] | undefined;
  value: number | string | undefined;
}

const props = withDefaults(
  defineProps<{
    defaultMode?: ModeType;
    filterConfig?: FilterConfig;
    showModeSwitcher?: boolean;
  }>(),
  {
    defaultMode: 'card',
    filterConfig: () => ({
      base: {
        value: undefined,
        disabled: false,
      },
      level: {
        value: undefined,
        disabled: false,
      },
      keyName: {
        value: undefined,
        disabled: false,
      },
    }),
    showModeSwitcher: true,
  },
);

const emit = defineEmits<{
  (e: 'modeChange', mode: ModeType): void;
}>();

const userStore = useUserStore();
const { resolve } = useRouter();

const orgId = computed(() => userStore.userInfo!.Orz_ID);

const mode = ref<ModeType>(props.defaultMode);

const businessNode = ref<null | Recordable<any>>(null);

const base = ref<string | undefined>(props.filterConfig.base?.value);
const baseOptions = ref<Recordable<any>[]>([]);

const level = ref<number | undefined>(props.filterConfig.level?.value);
const keyName = ref<string | undefined>(props.filterConfig.keyName?.value);
const paramsList = ref<ParamItem[]>([]);

const paramsFormSchema = computed<VbenFormSchema[]>(() => {
  return paramsList.value.map((item) => {
    if (item.InputType === 1) {
      return {
        fieldName: `param_${item.ID}_range`,
        label: item.Name,
        component: 'NumberRange',
        componentProps: {
          onChange: (
            val: [number | undefined, number | undefined] | undefined,
          ) => {
            item.range = val;
          },
        },
      };
    }
    return {
      fieldName: `param_${item.ID}_value`,
      label: item.Name,
      component: 'ParamValueEditor',
      componentProps: {
        allowClear: true,
        onChange: (val: any) => {
          item.value = val;
        },
        options: item.Options,
        inputType: item.InputType,
      },
    };
  });
});

const condition = computed(() => {
  return {
    APProjectBaseTreeID: base.value,
    Hierarchy: level.value,
    KeyName: keyName.value,
    Parameters: paramsList.value
      .filter((n) => {
        const hasRange =
          n.range !== undefined &&
          (n.range[0] !== undefined || n.range[1] !== undefined);
        const hasValue =
          n.value !== undefined && n.value !== null && n.value !== '';
        return hasRange || hasValue;
      })
      .map((n) => {
        const min = n.range ? n.range[0] : undefined;
        const max = n.range ? n.range[1] : undefined;
        let type = 1;
        if (n.InputType === 1) {
          type = 0;
        } else if (n.InputType === 3) {
          type = 2;
        }
        return {
          Name: n.Name,
          MinValue: min,
          MaxValue: max,
          Value: n.value,
          Type: type,
        };
      }),
  };
});

async function getBaseOptions() {
  const res = await getBase({ orgId: orgId.value });
  baseOptions.value = res.List.filter((n) => n.Name);
}

async function getParamsList() {
  if (!base.value) {
    paramsList.value = [];
    return;
  }
  const res = await getProjectQueryParams({ baseId: base.value });
  paramsList.value = res.List.map((n, i) => {
    return {
      ID: i,
      Name: n.Name,
      InputType: n.InputType,
      Options: n.Options?.map((m) => {
        return {
          label: m,
          value: m,
        };
      }),
      range: undefined,
      value: undefined,
    };
  });
}

const handleBaseChange: SelectProps['onChange'] = (value) => {
  base.value = value === undefined ? '' : String(value);
  if (!base.value) {
    paramsList.value = [];
    return;
  }
  getParamsList();
};

const [ParamsForm, paramsFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  schema: paramsFormSchema.value,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-5',
  compact: true,
});

watch(
  paramsFormSchema,
  (schema) => {
    paramsFormApi.resetForm();
    paramsFormApi.setState({ schema });
  },
  { immediate: true },
);

const cardLoading = ref(false);
const cardData = ref<Recordable<any>[]>([]);
const currentPage = ref(1);
const total = ref(0);

async function loadCardData() {
  cardLoading.value = true;
  const data = {
    ...condition.value,
    ClassName: businessNode.value?.ID ? businessNode.value?.Name : '',
  };
  const params: BasicParamsType = {
    Order: 'Sort asc',
    PageIndex: currentPage.value,
    PageSize: 8,
  };
  const res = await getProjectByFilter({
    orgId: orgId.value,
    data,
    params,
  });
  cardData.value = res.List.map((item) => {
    const amount = item.Amount ?? 0;
    const area = item.Area ?? 0;
    const economic = item.EconomicIndicators ?? 0;
    return {
      ...item,
      AmountText: formatPrice(amount),
      AreaText: area || '',
      EconomicIndicatorsText: formatPrice(economic),
    };
  });
  total.value = res.Count ?? 0;
  cardLoading.value = false;
}

function handlePageChange(page: number) {
  currentPage.value = page;
  loadCardData();
}

function viewData(row: Recordable<any>) {
  const route = resolve({
    path: `projectRepository/${row.APProjectBaseTree_ID}/detail/query`,
    query: {
      familyTreeId: row.ID,
    },
  });
  window.open(route.href, '_blank');
}

const tableGridOptions = computed((): VxeGridProps => {
  return {
    columns: [
      {
        type: 'checkbox',
        width: 40,
      },
      {
        type: 'seq',
        width: 60,
      },
      {
        field: 'Name',
        title: '项目名称',
        minWidth: 260,
        resizable: true,
        showOverflow: true,
      },
      {
        field: 'action',
        title: '操作',
        width: 120,
        fixed: 'right',
        slots: { default: 'action' },
      },
    ],
    height: 'auto',
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      autoLoad: false,
      ajax: {
        query: async () => {
          const params: BasicParamsType = {
            Order: 'Sort asc',
          };
          const data = {
            ...condition.value,
            ClassName: businessNode.value?.ID ? businessNode.value?.Name : '',
          };
          return getProjectByFilter({
            orgId: orgId.value,
            data,
            params,
          });
        },
      },
    },
  };
});

const tableGridEvents: VxeGridListeners = {};

const [ProjectTableGrid, tableGridApi] = useVbenVxeGrid({
  gridOptions: tableGridOptions.value as VxeGridProps,
  gridEvents: tableGridEvents,
  separator: false,
} as any);

async function reloadCurrent() {
  if (mode.value === 'card') {
    currentPage.value = 1;
    loadCardData();
  } else {
    await nextTick();
    tableGridApi.reload();
  }
}

watchDebounced(
  () => condition.value,
  () => {
    reloadCurrent();
  },
  { debounce: 500, deep: true },
);

watch(
  () => mode.value,
  (val) => {
    emit('modeChange', val);
    reloadCurrent();
  },
);

function handleNodeChange(node: Recordable<any>) {
  businessNode.value = node;
  reloadCurrent();
}

function handleModeChange(value: ModeType) {
  mode.value = value;
}

function getChecked() {
  if (!tableGridApi.grid || !tableGridApi.grid.getCheckboxRecords) {
    return [];
  }
  return tableGridApi.grid.getCheckboxRecords() as Recordable<any>[];
}

function reload() {
  reloadCurrent();
}

defineExpose({
  getChecked,
  reload,
});

getBaseOptions();
</script>

<template>
  <Flex class="h-full w-full" gap="small">
    <div class="h-full w-[250px] rounded-md bg-card">
      <BusinessTypeTree @node-change="handleNodeChange" />
    </div>
    <div class="flex h-full flex-1 flex-col rounded-md bg-card p-2">
      <div class="mb-2 flex items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-2">
            <span>基地:</span>
            <Select
              v-model:value="base"
              allow-clear
              show-search
              class="w-[300px]"
              placeholder="请选择基地"
              :filter-option="
                (input, option) => (option?.label as string).includes(input)
              "
              :options="
                baseOptions.map((item) => ({
                  label: item.Name,
                  value: item.ID,
                }))
              "
              :disabled="props.filterConfig.base?.disabled"
              @change="handleBaseChange"
            />
          </div>
          <div class="flex items-center gap-2">
            <span>划分层级:</span>
            <Select
              v-model:value="level"
              allow-clear
              class="w-[200px]"
              placeholder="请选择划分层级"
              :options="[
                { label: '单项工程', value: 1 },
                { label: '单位工程', value: 2 },
                { label: '分部分项', value: 3 },
              ]"
              :disabled="props.filterConfig.level?.disabled"
            />
          </div>
          <div class="flex items-center gap-2">
            <span>名称:</span>
            <Input
              v-model:value="keyName"
              allow-clear
              class="w-[200px]"
              placeholder="请输入名称"
              :disabled="props.filterConfig.keyName?.disabled"
            />
          </div>
        </div>
        <Radio.Group
          v-if="props.showModeSwitcher"
          v-model:value="mode"
          option-type="button"
          button-style="solid"
          @change="(e) => handleModeChange(e.target.value)"
        >
          <Radio.Button value="card">卡片模式</Radio.Button>
          <Radio.Button value="table">表格模式</Radio.Button>
        </Radio.Group>
      </div>
      <Divider class="my-2" plain orientation="left">参数条件</Divider>
      <div class="h-[240px] overflow-y-auto p-2">
        <ParamsForm />
      </div>
      <div class="flex-1 overflow-auto">
        <Spin v-if="mode === 'card'" :spinning="cardLoading">
          <div
            class="mb-3 mt-2 grid grid-cols-4 gap-4"
            v-if="cardData.length > 0"
          >
            <Card
              v-for="item in cardData"
              :key="item.ID"
              hoverable
              class="cursor-pointer"
              :style="{
                backgroundImage: `url('${projectBg}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }"
              @click="viewData(item)"
            >
              <div class="text-base font-medium">{{ item.Name }}</div>
              <div class="mt-3 text-sm">
                <span>总造价: </span>
                <span class="text-primary">
                  {{ item.AmountText || item.Amount || '' }}
                </span>
              </div>
              <div class="mt-2 text-sm">
                <span>建筑面积: </span>
                <span class="text-primary">
                  {{ item.AreaText || item.Area || '' }}
                </span>
              </div>
              <div class="mt-2 text-sm">
                <span>平米指标: </span>
                <span class="text-primary">
                  {{
                    item.EconomicIndicatorsText || item.EconomicIndicators || ''
                  }}
                </span>
              </div>
            </Card>
          </div>
          <div v-else class="flex h-full items-center justify-center">
            <Empty
              :image="Empty.PRESENTED_IMAGE_SIMPLE"
              description="暂无数据"
            />
          </div>
          <div class="mt-2 flex justify-end">
            <Pagination
              v-if="total > 0"
              :current="currentPage"
              :page-size="8"
              :total="total"
              :show-total="(t) => `共 ${t} 条`"
              @change="handlePageChange"
            />
          </div>
        </Spin>
        <ProjectTableGrid v-else>
          <template #action="{ row }">
            <TableAction
              :actions="[
                {
                  icon: 'EyeOutlined',
                  model: 'button',
                  tooltip: '查看项目',
                  onClick: viewData.bind(null, row),
                },
              ]"
            />
          </template>
        </ProjectTableGrid>
      </div>
    </div>
  </Flex>
</template>
