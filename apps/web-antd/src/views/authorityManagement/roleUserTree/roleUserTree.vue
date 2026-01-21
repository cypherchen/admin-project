<!--
 * @Author: cwx
 * @Date: 2025-03-28 22:17:50
 * @LastEditTime: 2026-01-21 11:48:37
 * @LastEditors: cwx
 * @Description: 角色用户树
-->
<script setup lang="ts" name="RoleUserTree">
import type { TreeProps } from 'ant-design-vue';

import { onMounted, ref } from 'vue';

import { useUserStore } from '@vben/stores';

import { watchDebounced } from '@vueuse/core';
import { Flex, Input, RadioGroup, Spin, Tree } from 'ant-design-vue';

import { getRole } from '#/api/roleManagementApi/roleManagementApi';
import { getUser } from '#/api/userApi/userApi';

const emit = defineEmits(['nodeClick', 'typeChange']);

const userStore = useUserStore();

const type = ref<number>(0);
function typeChange() {
  emit('typeChange', type.value);
  getTreeData();
}

const searchValue = ref<string>('');
watchDebounced(
  () => searchValue.value,
  () => {
    treeData.value = searchValue.value?.trim()
      ? treeList.value!.filter((n) => n.Name.includes(searchValue.value.trim()))
      : treeList.value;
  },
  { debounce: 500 },
);

const loading = ref<boolean>(false);
const treeList = ref<TreeProps['treeData']>([]);
const treeData = ref<TreeProps['treeData']>([]);
async function getTreeData() {
  loading.value = true;
  const res =
    type.value === 0
      ? await getRole(userStore.userInfo!.Orz_ID)
      : await getUser({ params: { orzId: userStore.userInfo!.Orz_ID } });
  treeList.value = res.List as unknown as TreeProps['treeData'];
  treeData.value = res.List as unknown as TreeProps['treeData'];
  loading.value = false;
}

const currentNode = ref<Record<string, any>>({});
function nodeSelect(_, { node }: Record<string, any>) {
  currentNode.value = node;
  emit('nodeClick', currentNode.value);
}

onMounted(() => {
  getTreeData();
});

defineExpose({ getTreeData });
</script>

<template>
  <Flex vertical gap="8" class="h-full w-full rounded-md bg-card p-2">
    <RadioGroup
      v-model:value="type"
      :options="[
        { label: '角色', value: 0 },
        { label: '用户', value: 1 },
      ]"
      option-type="button"
      button-style="solid"
      @change="typeChange"
      class="mx-auto"
    />
    <Input v-model:value="searchValue" allow-clear placeholder="请输入关键字" />
    <Spin :spinning="loading" wrapperClassName="flex-1 overflow-auto">
      <Tree
        :tree-data="treeData"
        :field-names="{ key: 'ID', title: 'Name' }"
        block-node
        @select="nodeSelect"
      >
        <template #title="{ data }">
          <div class="whitespace-nowrap">{{ data.Name }}</div>
        </template>
      </Tree>
    </Spin>
  </Flex>
</template>

<style scoped>
:deep(.ant-spin-container) {
  height: 100%;
}
</style>
