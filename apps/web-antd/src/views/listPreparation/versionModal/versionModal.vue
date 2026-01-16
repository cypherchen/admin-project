<!--
 * @Author: cwx
 * @Date: 2025-01-21 23:05:17
 * @LastEditTime: 2026-01-16 11:13:40
 * @LastEditors: cwx
 * @Description: 清单编制-版本管理
-->

<script setup lang="ts" name="VersionModal">
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import type { WhereType } from '#/api/basicType';

import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteListPreparationVersion,
  getListPreparationVersion,
  postListPreparationVersion,
  putListPreparationVersion,
} from '#/api/listPreparationApi/listPreparationApi';
import { Authority, hasPermission } from '#/components/authority';
import { TableAction } from '#/components/tableAction';
import { listPreparationPermission } from '#/permission';

import { columns } from './data';

const emit = defineEmits(['close']);

const permission = listPreparationPermission!.清单编制;

const userStore = useUserStore();

const currentRecord = ref<Record<string, any>>({});

const [VbenModal, modalApi] = useVbenModal({
  title: '版本',
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const data = modalApi.getData<Record<string, any>>();
      currentRecord.value = data.currentRecord;
      gridApi.reload();
    }
  },
  onBeforeClose: () => {
    emit('close');
    return true;
  },
});

const gridOptions: VxeGridProps = {
  columns,
  keepSource: true,
  height: 'auto',
  pagerConfig: {
    enabled: false,
  },
  editConfig: {
    enabled: hasPermission(permission.版本_修改, 'auth'),
    beforeEditMethod: () => !disabledByAudit.value,
  },
  proxyConfig: {
    autoLoad: true,
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
};

const gridEvents: VxeGridListeners = {
  editClosed: async ({ row, column }) => {
    if (row[column.field] === column.model.value) {
      return;
    }

    const data: Record<string, any> = {
      ID: row.ID,
      [column.field]: row[column.field],
    };

    try {
      await putListPreparationVersion(
        userStore.userInfo!.Orz_ID,
        currentRecord.value.ID,
        data,
      );
      message.success('修改成功');
    } finally {
      gridApi.reload();
    }
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: gridOptions as VxeGridProps,
  gridEvents,
} as any);

const disabledByAudit = computed((): boolean =>
  [1, 2].includes(currentRecord.value.AuditStatus),
);

async function handleCreate() {
  const tableData = gridApi.grid.getTableData().fullData;
  const index = tableData.length > 0 ? tableData.at(-1).Sort + 1 : 1;
  const data = {
    Name: `版本${index}`,
    ProjectName: currentRecord.value.Name,
    IPProjectID: currentRecord.value.ID,
    Label: '',
  };
  try {
    await postListPreparationVersion(
      userStore.userInfo!.Orz_ID,
      currentRecord.value.ID,
      data,
    );

    message.success('新增成功');
  } finally {
    gridApi.reload();
  }
}

const { push } = useRouter();
async function handleViewDetail(row: Record<string, any>) {
  push({
    name: 'listPreparationDetail',
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
        <Authority :value="permission.版本_新建">
          <a-button
            type="primary"
            :disabled="disabledByAudit"
            @click="handleCreate"
          >
            新建
          </a-button>
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
              disabled: disabledByAudit,
              auth: permission.版本_删除,
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

<style scoped></style>
