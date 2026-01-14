<!--
 * @Author: cwx
 * @Date: 2025-03-28 22:17:50
 * @LastEditTime: 2026-01-09 20:37:21
 * @LastEditors: 'cypherchen' dinmunhiong@gmail.com
 * @Description: 角色用户树
-->
<template>
  <Flex vertical gap="8" class="h-full w-full rounded-md p-2">
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
    ></RadioGroup>
    <Spin :spinning="loading">
      <Input
        v-model:value="searchValue"
        allow-clear
        class="mb-2"
        placeholder="请输入关键字"
      />
      <Tree
        class="h-full min-w-[200px] p-2"
        :tree-data="treeData"
        :field-names="{ key: 'ID', title: 'Name' }"
        block-node
        @select="nodeSelect"
      />
    </Spin>
  </Flex>
</template>

<script setup lang="ts" name="RoleUserTree">
import { ref, onMounted } from 'vue';
import {
  Flex,
  RadioGroup,
  Spin,
  Input,
  Tree,
  type TreeProps,
} from 'ant-design-vue';

import { watchDebounced } from '@vueuse/core';
import { useUserStore } from '@vben/stores';

import { getUser } from '#/api/userApi/userApi';
import { getRole } from '#/api/roleManagementApi/roleManagementApi';

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
    if (searchValue.value?.trim()) {
      treeData.value = treeList.value!.filter((n) =>
        n.Name.includes(searchValue.value.trim()),
      );
    } else {
      treeData.value = treeList.value;
    }
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

<style scoped></style>
