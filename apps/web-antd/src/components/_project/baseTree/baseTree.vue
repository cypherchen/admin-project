<!--
 * @Author: cwx
 * @Date: 2024-12-24 20:46:24
 * @LastEditTime: 2026-01-15 09:49:13
 * @LastEditors: cwx
 * @Description: 基地树
-->
<template>
  <Flex vertical class="h-full w-full rounded-md">
    <Input
      v-model:value="searchValue"
      allow-clear
      class="mb-2"
      placeholder="请输入关键字"
    />
    <div class="flex-1 overflow-auto">
      <Tree
        class="h-full min-w-[200px] p-2 overflow-auto"
        :tree-data="treeData"
        :selected-keys="selectedKeys"
        :fieldNames="{ key: 'ID', title: 'Name' }"
        block-node
        @select="nodeSelect"
      />
    </div>
  </Flex>
</template>

<script setup lang="ts" name="BaseTree">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Flex, Input, Tree, type TreeProps } from 'ant-design-vue';

import type { Recordable } from '@vben/types';
import { watchDebounced } from '@vueuse/core';
import { useUserStore } from '@vben/stores';

import { getBase } from '#/api/dataManagementApi/baseManagementApi';
import { ConditionalType } from '#/api/basicType';

import { arrayToTree, treeToArray } from '#/utils/tree';

const emit = defineEmits(['nodeClick']);

const { type } = defineProps({
  type: {
    type: Number,
    default: 0,
  },
});

const userStore = useUserStore();

const searchValue = ref<string>('');
watchDebounced(
  () => searchValue.value,
  () => {
    if (searchValue.value?.trim()) {
      const idList = Array.from(
        new Set(
          catalogList.value
            .filter((n: Recordable<any>) =>
              n.Name.includes(searchValue.value.trim()),
            )
            .map((n: Recordable<any>) => [n.ID, ...n.treeState.pathIDs])
            .flat(),
        ),
      );
      treeData.value = arrayToTree(
        catalogList.value.filter((n: Recordable<any>) => idList.includes(n.ID)),
      );
    } else {
      treeData.value = arrayToTree(catalogList.value);
    }
  },
  { debounce: 500 },
);

const currentNode = ref<null | Recordable<any>>(null);
const selectedKeys = computed(() => {
  return currentNode.value ? [currentNode.value.ID] : [];
});

const { push, currentRoute } = useRouter();

const nodeSelect = (_, info: Recordable<any>) => {
  currentNode.value = info.node;
  emit('nodeClick', currentNode.value);
  push({
    name: currentRoute.value.name,
    params: {
      bId: currentNode.value!.ID,
    },
  });
};

const catalogList = ref<Recordable<any>[]>([]);
const treeData = ref<TreeProps['treeData']>([]);
const getBaseList = async () => {
  const Where = [];
  Where.push({
    FieldName: 'Type',
    ConditionalType: ConditionalType.Equal,
    FieldValue: type,
  });
  const params = {
    Where,
  };

  const res = await getBase({
    orgId: userStore.userInfo!.Orz_ID,
    params,
  });
  const list = res.List.filter((n: Recordable<any>) => n.Name);
  catalogList.value = list;
  treeData.value = arrayToTree(list);
};

onMounted(async () => {
  if (currentRoute.value.params?.bId === ':bId') {
    push({
      name: currentRoute.value.name,
      params: {
        bId: undefined,
      },
    });
  }

  await getBaseList();

  if (treeData.value?.length) {
    currentNode.value = currentRoute.value.params?.bId
      ? treeToArray(treeData.value).find(
          (n: Recordable<any>) => n.ID === currentRoute.value.params.bId,
        )!
      : treeData.value[0]!;

    emit('nodeClick', currentNode.value);
  }
});
</script>

<style scoped></style>
