<!--
 * @Author: cwx
 * @Date: 2026-01-22 09:00:41
 * @LastEditTime: 2026-01-23 10:54:25
 * @LastEditors: cwx
 * @Description: 
-->
<script setup lang="ts">
import type { TreeProps } from 'ant-design-vue';

import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import type { WhereType } from '#/api/basicType';

import { ref } from 'vue';
import { useRoute } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { Alert, Button, Divider, Flex, message, Tree } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAutoPricing } from '#/api/autoPricingApi/autoPricingApi';
import { ConditionalType } from '#/api/basicType';
import { getIndicatorAnalyze } from '#/api/indicatorAnalyzeApi/indicatorAnalyzeApi';
import { postListPreparationInspectHistory } from '#/api/listPreparationApi/listPreparationInspectApi';

import BaseTree from './baseTree.vue';
import { columns, searchFormSchema } from './data';

const emit = defineEmits(['reloadHistory']);

const route = useRoute();
const vId = (route.params.vId as string) || '';

const userStore = useUserStore();
const orgId = userStore.userInfo?.Orz_ID;
const currentNode = ref<null | Record<string, any>>(null);
const checkedProjects = ref<TreeProps['treeData']>([]);
const checkedKeys = ref<string[]>([]);

const gridOptions: VxeGridProps = {
  columns,
  height: 'auto',
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    ajax: {
      query: async (_, formValues) => {
        if (!currentNode.value?.ID || !orgId) {
          return { List: [] };
        }

        const Where: WhereType[] = [];
        if (formValues.Name) {
          Where.push({
            ConditionalType: ConditionalType.Like,
            FieldName: 'Name',
            FieldValue: formValues.Name,
          });
        }

        Where.push({
          FieldName:
            currentNode.value.Type === 0 ? 'RLCAuditStatus' : 'AuditStatus',
          ConditionalType: ConditionalType.Equal,
          FieldValue: 2,
        });

        const params = {
          Where,
        };
        return currentNode.value.Type === 0
          ? getAutoPricing({
              orgId,
              treeId: currentNode.value.ID,
              params,
            })
          : getIndicatorAnalyze({
              orgId,
              treeId: currentNode.value.ID,
              params,
            });
      },
    },
  },
};

function setCheckedProjects() {
  const checked = gridApi.grid.getCheckboxRecords();
  if (!checked || checked.length === 0) {
    return;
  }
  const existingIds = new Set(
    (checkedProjects.value || []).map((p: Record<string, any>) => p.ID),
  );
  const newProjects = checked.filter(
    (item: Record<string, any>) => !existingIds.has(item.Version_ID),
  );

  if (newProjects.length > 0) {
    checkedProjects.value = [
      ...(checkedProjects.value || []),
      ...newProjects.map((n: Record<string, any>) => ({
        ID: n.Version_ID,
        Name: n.Name,
      })),
    ] as unknown as TreeProps['treeData'];
    const newIds = newProjects.map(
      (item: Record<string, any>) => item.Version_ID,
    );
    checkedKeys.value = [...checkedKeys.value, ...newIds];
  }
}

const gridEvents: VxeGridListeners = {
  checkboxChange: () => {
    setCheckedProjects();
  },
  checkboxAll: () => {
    setCheckedProjects();
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

function handleNodeChange(node: Record<string, any>) {
  currentNode.value = node;
  gridApi.reload();
}

async function handleComfirm() {
  const records = checkedProjects.value!.filter((n) =>
    checkedKeys.value.includes(n.ID),
  );
  if (records.length === 0) {
    message.warning('请选择一条记录');
    return;
  }
  const data = records.map((n) => {
    return {
      ID: n.ID,
      Name: n.Name,
    };
  });
  await postListPreparationInspectHistory(vId, data);
  emit('reloadHistory');
  modalApi.close();
}

const [VbenModal, modalApi] = useVbenModal({
  title: '选择历史项目',
  fullscreen: true,
  fullscreenButton: false,
  headerClass: 'border-none',
  footer: false,
  contentClass: 'flex',
  onOpened: () => {
    const data = modalApi.getData();
    checkedProjects.value = data.list || [];
    checkedKeys.value = data.list.map((n: Record<string, any>) => n.ID);
  },
});
</script>

<template>
  <VbenModal>
    <BaseTree @node-change="handleNodeChange" />
    <VbenVxeGrid class="flex-1" />
    <Flex vertical gap="8" class="w-[250px] pr-2">
      <Alert type="success" message="已选择历史项目" />
      <Divider class="my-2" />
      <Button type="primary" @click="handleComfirm">加入对比</Button>
      <Tree
        :tree-data="checkedProjects"
        v-model:checked-keys="checkedKeys"
        :selectable="false"
        checkable
        :field-names="{ title: 'Name', key: 'ID' }"
      >
        <template #title="{ data }">
          <div class="whitespace-nowrap">{{ data.Name }}</div>
        </template>
      </Tree>
    </Flex>
  </VbenModal>
</template>
