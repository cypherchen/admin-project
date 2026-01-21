<!--
 * @Author: cwx
 * @Date: 2025-03-15 02:38:33
 * @LastEditTime: 2026-01-19 18:53:15
 * @LastEditors: cwx
 * @Description: 清单编制-项目查询
-->
<script setup lang="ts" name="ProjectReference">
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import type { WhereType } from '#/api/basicType';

import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';

import { message, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { ConditionalType } from '#/api/basicType';
import {
  deleteListPreparationQuery,
  getListPreparationQuery,
  putListPreparationQuery,
} from '#/api/listPreparationApi/listPreparationQueryApi';
import { Authority } from '#/components/authority';
import { TableAction } from '#/components/tableAction';
import { listPreparationPermission } from '#/permission';

import { columns, searchFormSchema } from './data';
import ProjectQueryModal from './projectQueryModal.vue';

const props = defineProps<{
  currentNode: null | Record<string, any>;
}>();

const emit = defineEmits<{
  (e: 'reloadTree'): void;
}>();

const { currentRoute } = useRouter();

const permission = listPreparationPermission!.项目查询;

const auditStatus = computed(
  () => currentRoute.value.query?.auditStatus as string,
);
const disabledByAudit = computed(() =>
  [1, 2].includes(Number(auditStatus.value)),
);

const vId = computed(() => currentRoute.value.params.vId as string);

const gridOptions = computed((): VxeGridProps => {
  return {
    columns,
    height: 'auto',
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      autoLoad: false,
      ajax: {
        // 与旧项目 beforeFetch 保持一致：构造 Where + Order 后交给 getListPreparationQuery
        query: async (_params, formValues: Record<string, any>) => {
          if (!props.currentNode?.ID) {
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
          return getListPreparationQuery({
            treeId: props.currentNode.ID,
            params,
          });
        },
      },
    },
  };
});

const gridEvents: VxeGridListeners = {};

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

const [ProjectQueryModalOuter, projectQueryModalApi] = useVbenModal({
  connectedComponent: ProjectQueryModal,
});

async function handleToggleStatus(row: Record<string, any>, status: boolean) {
  if (disabledByAudit.value) {
    return;
  }
  const tips = status ? '启用' : '停用';
  const data = {
    ID: row.ID,
    IsUse: status,
  };
  await putListPreparationQuery(props.currentNode!.ID, data);
  message.success(`${tips}成功`);
  emit('reloadTree');
  gridApi.reload();
}

function openProjectQuery() {
  if (disabledByAudit.value) {
    return;
  }
  if (!props.currentNode?.ID) {
    message.error('请先选择左侧目录节点');
    return;
  }
  projectQueryModalApi
    .setData({
      currentNode: props.currentNode,
      vId: vId.value,
    })
    .open();
}

function handleProjectQuerySuccess() {
  gridApi.reload();
  emit('reloadTree');
}

async function handleDelete(row: Record<string, any>) {
  if (disabledByAudit.value) {
    return;
  }
  await deleteListPreparationQuery(props.currentNode!.ID, row.ID);
  message.success('删除成功');
  gridApi.reload();
}

watch(
  () => props.currentNode,
  (val) => {
    if (val?.ID) {
      gridApi.reload();
    }
  },
);
</script>

<template>
  <VbenVxeGrid>
    <template #toolbar-actions>
      <Authority :value="permission.项目查询_查询">
        <a-button
          type="primary"
          :disabled="disabledByAudit"
          @click="openProjectQuery"
        >
          项目查询
        </a-button>
      </Authority>
    </template>

    <template #IsUse="{ row }">
      <Tag :color="row.IsUse ? 'success' : 'error'">
        {{ row.IsUse ? '已启用' : '已停用' }}
      </Tag>
    </template>

    <template #action="{ row }">
      <TableAction
        :actions="[
          {
            icon: 'PlayCircleOutlined',
            color: 'success',
            model: 'confirm',
            tooltip: '启用',
            ifShow: !row.IsUse,
            disabled: disabledByAudit,
            auth: permission.项目查询_启用停用,
            popConfirm: {
              title: '确认启用?',
              confirm: handleToggleStatus.bind(null, row, true),
            },
          },
          {
            icon: 'StopOutlined',
            color: 'error',
            model: 'confirm',
            tooltip: '停用',
            ifShow: row.IsUse,
            disabled: disabledByAudit,
            auth: permission.项目查询_启用停用,
            popConfirm: {
              title: '确认停用?',
              confirm: handleToggleStatus.bind(null, row, false),
            },
          },
          {
            icon: 'DeleteOutlined',
            color: 'error',
            model: 'confirm',
            tooltip: '删除',
            disabled: row.IsUse || disabledByAudit,
            auth: permission.项目查询_删除,
            popConfirm: {
              title: '是否移除该数据?',
              confirm: handleDelete.bind(null, row),
            },
          },
        ]"
      />
    </template>
  </VbenVxeGrid>

  <ProjectQueryModalOuter @submit="handleProjectQuerySuccess" />
</template>
