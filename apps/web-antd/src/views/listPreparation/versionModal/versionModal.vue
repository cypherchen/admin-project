<!--
 * @Author: cwx
 * @Date: 2025-01-21 23:05:17
 * @LastEditTime: 2025-03-21 22:54:32
 * @LastEditors: cwx
 * @Description: 清单编制-版本管理
-->

<template>
  <VbenModal
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :fullscreen-button="false"
    :footer="false"
    footer-class="border-none"
    header-class="border-none"
    class="h-[500px] w-[800px]"
  >
    <Grid>
      <template #toolbar-actions>
        <Authority value="listPreparation_version:create">
          <a-button type="primary" @click="handleCreate"> 新建 </a-button>
        </Authority>
      </template>

      <template #action="{ row }">
        <TableAction
          :actions="[
            {
              icon: 'EyeOutlined',
              model: 'button',
              tooltip: '查看详情',
              onClick: handleViewDetail.bind(null, row),
            },
            {
              icon: 'DeleteOutlined',
              color: 'error',
              model: 'confirm',
              tooltip: '删除',
              popConfirm: {
                title: '是否确认删除?',
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </VbenModal>
</template>

<script setup lang="ts" name="VersionModal">
import { nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { useVbenModal } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import type { VxeGridProps, VxeGridListeners } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { TableAction } from '#/components/tableAction';
import { Authority } from '#/components/authority';

import { type WhereType } from '#/api/basicType';

import {
  postListPreparationVersion,
  deleteListPreparationVersion,
  putListPreparationVersion,
  getListPreparationVersion,
} from '#/api/listPreparationApi/listPreparationApi';

import { columns } from './data';

const emit = defineEmits(['close']);

const userStore = useUserStore();

const currentRecord = ref<Record<string, any>>({});

const [VbenModal, modalApi] = useVbenModal({
  title: '版本',
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const data = modalApi.getData<Record<string, any>>();
      currentRecord.value = data.currentRecord;
      await nextTick();
      gridApi.reload();
    }
  },
  onBeforeClose: () => {
    emit('close');
    return true;
  },
});

const gridOptions: VxeGridProps<Record<string, any>> = {
  columns,
  keepSource: true,
  height: 'auto',
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: () => {
        const Where: WhereType[] = [];

        const params = {
          Where,
        };

        return getListPreparationVersion({
          orgId: userStore.userInfo!.Orz_ID,
          pId: currentRecord.value.ID,
          params,
        });
      },
    },
  },
  editConfig: {
    mode: 'cell',
    trigger: 'click',
  },
};

const gridEvents: VxeGridListeners = {
  editClosed: async ({ row, column }) => {
    if (row[column.field] == column.model.value) {
      return;
    }

    const data: Record<string, any> = {
      ID: row.ID,
      [column.field]: row[column.field],
    };

    await putListPreparationVersion(
      userStore.userInfo!.Orz_ID,
      currentRecord.value.ID,
      data,
    );
    message.success('修改成功');
    gridApi.reload();
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  gridEvents,
});

async function handleCreate() {
  const tableData = gridApi.grid.getTableData().fullData;
  const index = tableData.length ? tableData.at(-1).Sort + 1 : 1;
  const data = {
    Name: '版本' + index,
    ProjectName: currentRecord.value.Name,
    IPProjectID: currentRecord.value.ID,
    Label: '',
  };
  await postListPreparationVersion(
    userStore.userInfo!.Orz_ID,
    currentRecord.value.ID,
    data,
  );
  message.success('新增成功');
  gridApi.reload();
}

const { push } = useRouter();
async function handleViewDetail(row: Record<string, any>) {
  push({
    name: 'ListPreparationDetail',
    params: {
      bId: currentRecord.value!.APProjectBaseTree_ID,
      pId: row.IPProjectID,
      vId: row.ID,
    },
    query: {
      auditStatus: currentRecord.value.AuditStatus,
    },
  });
}

async function handleDelete(row: Record<string, any>) {
  await deleteListPreparationVersion(
    userStore.userInfo!.Orz_ID,
    currentRecord.value.ID,
    row.ID,
  );
  message.success('删除成功');
  gridApi.reload();
}
</script>

<style scoped></style>
