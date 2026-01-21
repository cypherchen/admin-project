<!--
 * @Author: cwx
 * @Date: 2026-01-19 19:09:25
 * @LastEditTime: 2026-01-20 11:17:53
 * @LastEditors: cwx
 * @Description: 清单编制-项目清单-计算式抽屉
-->
<script setup lang="ts" name="FormulaDrawer">
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

import { nextTick, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { Checkbox, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteListPreparationListFormula,
  getListPreparationListFormula,
  postListPreparationListFormula,
  putListPreparationListFormula,
} from '#/api/listPreparationApi/listPreparationListApi';
import { Authority, hasPermission } from '#/components/authority';
import { listPreparationPermission } from '#/permission';

import { columns } from './data';

const emit = defineEmits(['reload']);

const permission = listPreparationPermission!.项目清单;

const record = ref<Record<string, any>>({});
const disabled = ref<boolean>(false);

const [Drawer, drawerApi] = useVbenDrawer({
  placement: 'bottom',
  appendToMain: true,
  modal: false,
  class: 'h-[400px]',
  footer: false,
});

watch(
  () => drawerApi.useStore().value.sharedData,
  async (data) => {
    if (data?.record && drawerApi.useStore().value.isOpen) {
      record.value = data.record;
      disabled.value = data.disabled;

      drawerApi.setState({ title: `工程量计算式-${record.value.Name}` });
      await nextTick();
      gridApi.reload();
    }
  },
  { deep: true },
);

const gridOptions: VxeGridProps = {
  columns,
  height: 'auto',
  pagerConfig: {
    enabled: false,
  },
  editConfig: {
    enabled: hasPermission(permission.计算式_修改),
    beforeEditMethod: () => !disabled.value,
  },
  proxyConfig: {
    ajax: {
      query: async () => {
        if (!record.value.ID) return { List: [] };
        return getListPreparationListFormula({
          listId: record.value.ID,
          params: {},
        });
      },
    },
  },
};

const gridEvents: VxeGridListeners = {
  editClosed: ({ row, column }) => {
    handleUpdate(row, column);
  },
};

const [VbenVxeGrid, gridApi] = useVbenVxeGrid({
  gridOptions: gridOptions as VxeGridProps,
  gridEvents,
} as any);

async function handleAdd() {
  try {
    drawerApi.setState({ loading: true });
    await postListPreparationListFormula(record.value.ID, {
      Explain: `内容说明${gridApi.grid?.getFullData().length + 1}`,
      Formula: '',
      IPProjectListID: record.value.ID,
    });
    message.success('新增成功');
    gridApi.reload();
  } finally {
    drawerApi.setState({ loading: false });
  }
}

async function handleUpdate(
  row: Record<string, any>,
  column: Record<string, any>,
) {
  if (row[column.field] === column.model?.value) {
    return;
  }
  const data: Record<string, any> = {
    ID: row.ID,
    [column.field as string]: row[column.field] ?? null,
  };

  await putListPreparationListFormula(record.value.ID, data);
  message.success('保存成功');
  emit('reload');
  gridApi.reload();
}

async function handleDelete() {
  const records = gridApi.grid?.getCheckboxRecords() as Record<string, any>[];
  if (records.length === 0) {
    return message.error('未勾选数据');
  }

  Modal.confirm({
    title: '确认删除选中项吗？',
    okText: '确认',
    okType: 'danger',
    onOk: async () => {
      await deleteListPreparationListFormula(
        record.value.ID,
        records.map((n) => n.ID),
      );
      message.success('删除成功');
      gridApi.reload();
      emit('reload');
    },
  });
}
</script>

<template>
  <Drawer>
    <VbenVxeGrid>
      <template #table-title>
        <Authority :value="permission.计算式_新增">
          <a-button
            type="primary"
            :disabled="disabled"
            @click="handleAdd"
            class="mr-2"
          >
            新增
          </a-button>
        </Authority>
        <Authority :value="permission.计算式_删除">
          <a-button danger :disabled="disabled" @click="handleDelete">
            删除
          </a-button>
        </Authority>
      </template>

      <template #IsAccrual="{ row, column }">
        <Checkbox
          v-model:checked="row.IsAccrual"
          :disabled="disabled || !hasPermission(permission.计算式_修改)"
          @change="handleUpdate(row, column)"
        />
      </template>
    </VbenVxeGrid>
  </Drawer>
</template>
