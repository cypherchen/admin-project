<!--
 * @Author: cwx
 * @Date: 2026-01-15 11:48:17
 * @LastEditTime: 2026-01-26 15:01:19
 * @LastEditors: cwx
 * @Description: 自动套价-取费设置
-->
<script setup lang="ts" name="FeeSetting">
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import type { WhereType } from '#/api/basicType';

import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { Button, Flex, message, Modal, Select } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteAutoPricingFee,
  getAutoPricingFee,
  getAutoPricingFeeTemplate,
  postAutoPricingFee,
  putAutoPricingFee,
  setAutoPricingFeeTemplate,
} from '#/api/autoPricingApi/autoPricingFeeApi';
import { ConditionalType } from '#/api/basicType';
import { getFeeTemplate } from '#/api/feeTemplateApi/feeTemplateApi';
import { Authority, hasPermission } from '#/components/authority';
import { autoPricingPermission } from '#/permission';
import { treeToArray } from '#/utils/tree';

import { columns, searchFormSchema } from './data';
import SyncFeeModal from './syncFeeModal/syncFeeModal.vue';

const props = defineProps<{
  currentNode: null | Record<string, any>;
}>();

const permission = autoPricingPermission!.取费设置;

const route = useRoute();
const userStore = useUserStore();

const orgId = userStore.userInfo!.Orz_ID;
const vId = route.params.vId as string;
const disabledByAudit = computed(() =>
  [1, 2].includes(Number(route.query?.auditStatus as string)),
);

const feeTemplate = ref<string>('');
const feeTemplateOptions = ref<Record<string, any>[]>([]);
const disabled = computed(
  () =>
    !feeTemplate.value ||
    (Array.isArray(props.currentNode?.children) &&
      props.currentNode!.children.length > 0),
);

const gridOptions: VxeGridProps = {
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  treeConfig: {
    expandAll: true,
  },
  editConfig: {
    enabled: hasPermission(permission.取费设置_修改, 'auth'),
    beforeEditMethod: () => !disabled.value && !disabledByAudit.value,
  },
  rowConfig: {
    isCurrent: true,
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: async (_params, formValues) => {
        if (!feeTemplate.value || !props.currentNode?.ID) {
          return { List: [] };
        }
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
        return getAutoPricingFee({
          vId,
          tId: feeTemplate.value,
          treeId: props.currentNode.ID,
          params,
        });
      },
    },
  },
};

const gridEvents: VxeGridListeners = {
  editClosed: async ({ row, column }) => {
    if (row[column.field] === column.model.value) {
      return;
    }

    const data = {
      ID: row.ID,
      [column.field]: row[column.field],
    };
    try {
      await putAutoPricingFee(vId, data);
      message.success('修改成功');
    } finally {
      gridApi.reload();
    }
  },
};

const [VbenVxeGrid, gridApi] = useVbenVxeGrid({
  gridOptions: gridOptions as VxeGridProps,
  gridEvents,
  formOptions: {
    schema: searchFormSchema,
    showCollapseButton: false,
  },
  separator: false,
} as any);

const [SynFeeModalOuter, modalApi] = useVbenModal({
  connectedComponent: SyncFeeModal,
});

// 获取模板选项
async function getTemplateOptions() {
  const res = await getFeeTemplate(orgId);
  feeTemplateOptions.value = res.List;
}

// 获取当前模板
async function getCurrentTemplate() {
  const res = await getAutoPricingFeeTemplate(vId);
  feeTemplate.value = res.List;
}

// 模板切换
async function handleTemplateChange() {
  const params = { templateId: feeTemplate.value };
  try {
    gridApi.setLoading(true);
    await setAutoPricingFeeTemplate(vId, params);
    gridApi.reload();
  } finally {
    gridApi.setLoading(false);
  }
}

watch(
  () => props.currentNode,
  (val) => {
    if (feeTemplate.value && val?.ID) {
      gridApi.reload();
    }
  },
);

// 新增
async function handleCreate(type: 0 | 1) {
  const row = gridApi.grid?.getCurrentRecord();
  if (type === 1) {
    if (!row) {
      message.error('未选择数据');
      return;
    }
    if (row.Parent_ID) {
      message.error('请选择父级添加子项');
      return;
    }
  }

  const fullData = gridApi.grid?.getFullData() || [];

  const flatData = treeToArray(fullData);
  const maxSort =
    flatData.length > 0
      ? Math.max(...flatData.map((n: Record<string, any>) => n.Sort))
      : 0;
  const index = maxSort + 1;

  const data = {
    Name: `费用${index}`,
    Identification: `F${index}`,
    Parent_ID: type === 1 ? row.ID : undefined,
  };

  await postAutoPricingFee(vId, feeTemplate.value, props.currentNode!.ID, data);
  message.success('添加成功');
  gridApi.reload();
}

// 删除
async function handleDelete() {
  const row = gridApi.grid?.getCurrentRecord();
  if (!row) {
    message.error('未选择数据');
    return;
  }
  Modal.confirm({
    title: '提示',
    content: '是否删除该数据?',
    type: 'warning',
    async onOk() {
      const data = treeToArray([row]).map((n: Record<string, any>) => n.ID);
      await deleteAutoPricingFee(vId, data);
      message.success('删除成功');
      gridApi.reload();
    },
  });
}

onMounted(async () => {
  await getTemplateOptions();
  await getCurrentTemplate();
  if (feeTemplate.value && props.currentNode?.ID) {
    gridApi.reload();
  }
});
</script>

<template>
  <VbenVxeGrid>
    <template #toolbar-actions>
      <Flex gap="8" align="center">
        <Authority :value="permission.取费设置_新建">
          <Button
            type="primary"
            :disabled="disabled || disabledByAudit"
            @click="handleCreate(0)"
          >
            新增
          </Button>
        </Authority>
        <Authority :value="permission.取费设置_新建">
          <Button
            :disabled="disabled || disabledByAudit"
            @click="handleCreate(1)"
          >
            新增子项
          </Button>
        </Authority>
        <Authority :value="permission.取费设置_删除">
          <Button :disabled="disabled || disabledByAudit" @click="handleDelete">
            删除
          </Button>
        </Authority>
        <Authority :value="permission.取费设置_同步">
          <Button
            :disabled="disabled || disabledByAudit"
            @click="modalApi.open()"
          >
            同步
          </Button>
        </Authority>
        <Authority :value="permission.取费设置_设置模板">
          <span>取费模板:</span>
          <Select
            v-model:value="feeTemplate"
            :options="
              feeTemplateOptions.map((item) => ({
                label: item.Name,
                value: item.ID,
              }))
            "
            class="w-[300px]"
            :disabled="disabledByAudit"
            @change="handleTemplateChange"
          />
        </Authority>
      </Flex>
    </template>
  </VbenVxeGrid>
  <SynFeeModalOuter :current-node="currentNode" @reload="gridApi.reload()" />
</template>
