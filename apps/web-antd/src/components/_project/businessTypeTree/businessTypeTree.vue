<!--
 * @Author: cwx
 * @Date: 2026-01-18 20:28:37
 * @LastEditTime: 2026-01-19 11:02:38
 * @LastEditors: cwx
 * @Description: 业态类型树
-->
<script setup lang="ts" name="BusinessTypeTree">
import type { TreeProps } from 'ant-design-vue';

import type { Recordable } from '@vben/types';

import { computed, onMounted, ref } from 'vue';

import { useUserStore } from '@vben/stores';

import { watchDebounced } from '@vueuse/core';
import { Flex, Input, Spin, Tree } from 'ant-design-vue';

import { ConditionalType } from '#/api/basicType';
import { getBusiness } from '#/api/dataManagementApi/businessManagementApi';
import { arrayToTree, treeToArray } from '#/utils/tree';

const emit = defineEmits<{
  (e: 'nodeChange', node: Recordable<any>): void;
}>();

const userStore = useUserStore();

const loading = ref(false);
const searchValue = ref('');
const currentNode = ref<null | Recordable<any>>(null);
const treeData = ref<TreeProps['treeData']>([]);
const sourceNodes = ref<Recordable<any>[]>([]);

const selectedKeys = computed(() => {
  return currentNode.value ? [currentNode.value.ID] : [];
});

function setTreeDataFromList(list: Recordable<any>[]) {
  const tree = arrayToTree(list);
  treeData.value = tree as unknown as TreeProps['treeData'];
}

async function getBusinessTypeList() {
  loading.value = true;
  const Where = [
    {
      FieldName: 'Hierarchy',
      ConditionalType: ConditionalType.Equal,
      FieldValue: 0,
    },
  ];
  const params = {
    Where,
  };
  const res = await getBusiness({
    orgId: userStore.userInfo!.Orz_ID,
    params,
  });
  const list = res.List as Recordable<any>[];
  list.unshift({
    ID: '',
    Name: '全部',
  } as Recordable<any>);
  const tree = arrayToTree(list);
  treeData.value = tree as unknown as TreeProps['treeData'];
  sourceNodes.value = treeToArray(tree);
  const firstNode = sourceNodes.value[0];
  if (firstNode) {
    currentNode.value = firstNode as Recordable<any>;
    emit('nodeChange', currentNode.value);
  }
  loading.value = false;
}

watchDebounced(
  () => searchValue.value,
  () => {
    const term = searchValue.value.trim();
    if (term) {
      const idSet = new Set<string>();
      sourceNodes.value.forEach((item) => {
        if (item.Name && String(item.Name).includes(term)) {
          idSet.add(item.ID);
          if (Array.isArray(item.treeState?.pathIDs)) {
            item.treeState.pathIDs.forEach((id: string) => {
              idSet.add(id);
            });
          }
        }
      });
      const filtered = sourceNodes.value.filter((item) => idSet.has(item.ID));
      setTreeDataFromList(filtered);
    } else if (sourceNodes.value.length > 0) {
      setTreeDataFromList(sourceNodes.value);
    }
  },
  { debounce: 500 },
);

const handleSelect: NonNullable<TreeProps['onSelect']> = (_, info) => {
  currentNode.value = info.node as Recordable<any>;
  emit('nodeChange', currentNode.value);
};

onMounted(async () => {
  await getBusinessTypeList();
});
</script>

<template>
  <Flex vertical class="h-full w-full rounded-md bg-card">
    <div class="p-2">
      <Input
        v-model:value="searchValue"
        allow-clear
        placeholder="请输入关键词过滤"
      />
    </div>
    <div class="flex-1 overflow-auto p-2">
      <Spin :spinning="loading">
        <Tree
          :tree-data="treeData"
          :selected-keys="selectedKeys"
          :field-names="{ key: 'ID', title: 'Name', children: 'children' }"
          block-node
          default-expand-all
          @select="handleSelect"
        >
          <template #title="{ data }">
            <div class="whitespace-nowrap">{{ data.Name }}</div>
          </template>
        </Tree>
      </Spin>
    </div>
  </Flex>
</template>
