<!--
 * @Author: cwx
 * @Date: 2026-01-21 17:23:45
 * @LastEditTime: 2026-01-23 09:03:05
 * @LastEditors: cwx
 * @Description: 
-->
<script setup lang="ts">
import type { TreeProps } from 'ant-design-vue/es/tree';

import { onMounted, ref } from 'vue';

import { useUserStore } from '@vben/stores';

import { watchDebounced } from '@vueuse/core';
import { Flex, Input, Tree } from 'ant-design-vue';

import { getBase } from '#/api/dataManagementApi/baseManagementApi';
import { arrayToTree } from '#/utils/tree';

const emit = defineEmits<{
  (e: 'nodeChange', node: Record<string, any>): void;
}>();

const userStore = useUserStore();
const orgId = userStore.userInfo?.Orz_ID || '';

const loading = ref<boolean>(false);
const treeData = ref<TreeProps['treeData']>([]);
const searchValue = ref<string>('');
const selectedKeys = ref<string[]>([]);
const originalList = ref<Record<string, any>[]>([]);

const onSelect: TreeProps['onSelect'] = (keys, { node }) => {
  selectedKeys.value = keys as string[];
  if (keys.length > 0) {
    emit('nodeChange', node.dataRef as Record<string, any>);
  }
};

async function getTreeData() {
  loading.value = true;
  try {
    const res = await getBase({ orgId });
    const list = (res.List || []).filter((item) => item.Name);
    originalList.value = list;
    treeData.value = arrayToTree(list) as unknown as TreeProps['treeData'];

    if (treeData.value!.length > 0) {
      const firstNode = treeData.value![0]!;
      selectedKeys.value = [firstNode.ID as string];
      emit('nodeChange', firstNode);
    }
  } finally {
    loading.value = false;
  }
}

watchDebounced(
  () => searchValue.value,
  () => {
    if (searchValue.value?.trim()) {
      const idList = new Set(
        new Set(
          originalList.value
            .filter((n: Record<string, any>) =>
              n.Name.includes(searchValue.value.trim()),
            )
            .flatMap((n: Record<string, any>) => [
              n.ID,
              ...n.treeState.pathIDs,
            ]),
        ),
      );
      treeData.value = arrayToTree(
        originalList.value.filter((n: Record<string, any>) => idList.has(n.ID)),
      ) as unknown as TreeProps['treeData'];
    } else {
      treeData.value = arrayToTree(
        originalList.value,
      ) as unknown as TreeProps['treeData'];
    }
  },
  { debounce: 500 },
);

onMounted(() => {
  getTreeData();
});
</script>

<template>
  <Flex vertical class="w-[250px] pr-2">
    <Input
      v-model:value="searchValue"
      placeholder="请输入关键词过滤"
      class="mb-2"
    />
    <Tree
      :tree-data="treeData"
      :field-names="{ title: 'Name', key: 'ID' }"
      :selected-keys="selectedKeys"
      :default-expand-all="true"
      class="flex-1 overflow-auto p-2"
      @select="onSelect"
    >
      <template #title="{ data }">
        <div class="whitespace-nowrap">{{ data.Name }}</div>
      </template>
    </Tree>
  </Flex>
</template>
