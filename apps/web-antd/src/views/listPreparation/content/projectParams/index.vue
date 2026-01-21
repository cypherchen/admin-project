<!--
 * @Author: cwx
 * @Date: 2025-03-15 02:39:04
 * @LastEditTime: 2026-01-18 00:36:46
 * @LastEditors: cwx
 * @Description: 清单编制-项目信息
-->
<script setup lang="ts" name="ProjectParams">
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import type { WhereType } from '#/api/basicType';
import type { ParamsTemplateApi } from '#/api/paramsTemplateApi/paramsTemplateApi';

import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useUserStore } from '@vben/stores';

import { Alert, Flex, message, Select } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { ConditionalType } from '#/api/basicType';
import {
  getListPreparationCanSubmit,
  getListPreparationVersion,
} from '#/api/listPreparationApi/listPreparationApi';
import {
  getListPreparationParams,
  putListPreparationParams,
  setListPreparationParamsTemplate,
} from '#/api/listPreparationApi/listPreparationParamsApi';
import { getParamsTemplate } from '#/api/paramsTemplateApi/paramsTemplateApi';
import { Authority, hasPermission } from '#/components/authority';
import { ParamValueEditor } from '#/components/paramValueEditor';
import { listPreparationPermission } from '#/permission';

import { columns, searchFormSchema } from './data';

const props = defineProps<{
  currentNode: null | Record<string, any>;
}>();

const { currentRoute } = useRouter();
const userStore = useUserStore();

const permission = listPreparationPermission!.项目信息;

const orgId = computed(() => userStore.userInfo!.Orz_ID);
const pId = computed(() => currentRoute.value.params.pId as string);
const vId = computed(() => currentRoute.value.params.vId as string);

const auditStatus = computed(
  () => currentRoute.value.query?.auditStatus as string,
);
const disabledByAudit = computed(() =>
  [1, 2].includes(Number(auditStatus.value)),
);

const paramsTemplate = ref<string>('');
const paramsTemplateOptions = ref<ParamsTemplateApi.ParamsTemplateResult[]>([]);
const unfinishedList = ref<Record<string, any>[]>([]);

const paramsTemplateSelectOptions = computed(() =>
  paramsTemplateOptions.value.map((item) => ({
    label: item.Name,
    value: item.ID!,
  })),
);

const gridOptions = computed((): VxeGridProps => {
  return {
    columns,
    height: 'auto',
    pagerConfig: {
      enabled: false,
    },
    treeConfig: {
      expandAll: true,
    },
    editConfig: {
      enabled: hasPermission(permission.项目信息_修改, 'auth'),
      beforeEditMethod: () => !disabledByAudit.value,
    },
    proxyConfig: {
      autoLoad: false,
      ajax: {
        query: async (_params, formValues: Record<string, any>) => {
          if (!props.currentNode?.ID || !paramsTemplate.value) {
            return { List: [], Count: 0 };
          }
          const Where: WhereType[] = [];
          if (formValues.Name?.trim()) {
            Where.push({
              FieldName: 'Name',
              ConditionalType: ConditionalType.Like,
              FieldValue: formValues.Name.trim(),
            });
          }
          const params = {
            Where,
            Order: 'Sort asc',
          };
          return getListPreparationParams({
            vId: vId.value,
            treeId: props.currentNode.ID,
            tId: paramsTemplate.value,
            params,
          });
        },
      },
    },
  };
});

const gridEvents: VxeGridListeners = {
  editClosed: async ({ row, column }) => {
    if (row[column.field] === column.model?.value) {
      return;
    }
    const data: Record<string, any> = {
      ID: row.ID,
      [column.field as string]: row[column.field] ?? null,
    };
    try {
      await putListPreparationParams(vId.value, props.currentNode!.ID, data);
      message.success('修改成功');
    } finally {
      gridApi.reload();
      await getUnfinished();
    }
  },
};

const [VbenVxeGrid, gridApi] = useVbenVxeGrid({
  gridOptions: gridOptions.value as VxeGridProps,
  gridEvents,
  formOptions: {
    schema: searchFormSchema,
    showCollapseButton: false,
    compact: false,
  },
  separator: false,
} as any);

async function getTemplateOptions() {
  const res = await getParamsTemplate({ orgId: orgId.value });
  paramsTemplateOptions.value = res.List;
}

async function getCurrentTemplate() {
  const Where: WhereType[] = [
    {
      FieldName: 'ID',
      ConditionalType: ConditionalType.Equal,
      FieldValue: vId.value,
    },
  ];
  const res = await getListPreparationVersion({
    orgId: orgId.value,
    pId: pId.value,
    params: { Where },
  });
  paramsTemplate.value =
    res.List && res.List.length > 0
      ? res.List[0]!.ParameterSettingTemplate_ID || ''
      : '';
}

async function getUnfinished() {
  const res = await getListPreparationCanSubmit(pId.value);
  unfinishedList.value = res.List || [];
}

async function handleTemplateChange() {
  if (!paramsTemplate.value || !props.currentNode?.ID) {
    return;
  }
  await setListPreparationParamsTemplate(vId.value, props.currentNode.ID, {
    TemplateID: paramsTemplate.value,
  });
  await getCurrentTemplate();
  gridApi.reload();
  await getUnfinished();
}

watch(
  () => props.currentNode,
  (val) => {
    if (val?.ID && paramsTemplate.value) {
      gridApi.reload();
      getUnfinished();
    }
  },
);

onMounted(async () => {
  await getTemplateOptions();
  await getCurrentTemplate();
  if (paramsTemplate.value && props.currentNode?.ID) {
    gridApi.reload();
    await getUnfinished();
  }
});
</script>

<template>
  <VbenVxeGrid>
    <template #table-title>
      <Authority :value="permission.项目信息_设置模板">
        <Flex align="center">
          <span class="mr-2">参数模板:</span>
          <Select
            v-model:value="paramsTemplate"
            :options="paramsTemplateSelectOptions"
            placeholder="请选择参数模板"
            class="w-[260px]"
            :disabled="disabledByAudit"
            allow-clear
            @change="handleTemplateChange"
          />
        </Flex>
      </Authority>
      <Alert
        v-if="unfinishedList.length > 0"
        :message="`请完善 ${unfinishedList
          .map((n) => `【${n.TreeName}】`)
          .join(', ')} 必填参数项, 否则无法发起审批`"
        type="warning"
        show-icon
        :closable="false"
        class="ml-2 w-max py-[5px]"
      />
    </template>
    <template #ValueEdit="{ row }">
      <ParamValueEditor
        v-model:value="row.Value"
        :input-type="row.InputType"
        :options="row.Options"
      />
    </template>
  </VbenVxeGrid>
</template>
