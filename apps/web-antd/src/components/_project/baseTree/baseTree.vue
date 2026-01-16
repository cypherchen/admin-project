<!--
 * @Author: cwx
 * @Date: 2024-12-24 20:46:24
 * @LastEditTime: 2026-01-16 10:30:11
 * @LastEditors: cwx
 * @Description: 基地树
-->
<script setup lang="ts" name="BaseTree">
import type { TreeProps } from 'ant-design-vue';

import type { Recordable } from '@vben/types';

import { computed, onActivated, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useUserStore } from '@vben/stores';

import { watchDebounced } from '@vueuse/core';
import { Flex, Input, Tree } from 'ant-design-vue';

import { ConditionalType } from '#/api/basicType';
import { getBase } from '#/api/dataManagementApi/baseManagementApi';
import { arrayToTree, treeToArray } from '#/utils/tree';

const { type } = defineProps({
  type: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['nodeClick']);

const userStore = useUserStore();

const searchValue = ref<string>('');
watchDebounced(
  () => searchValue.value,
  () => {
    if (searchValue.value?.trim()) {
      const idList = new Set(
        new Set(
          catalogList.value
            .filter((n: Recordable<any>) =>
              n.Name.includes(searchValue.value.trim()),
            )
            .flatMap((n: Recordable<any>) => [n.ID, ...n.treeState.pathIDs]),
        ),
      );
      treeData.value = arrayToTree(
        catalogList.value.filter((n: Recordable<any>) => idList.has(n.ID)),
      ) as unknown as TreeProps['treeData'];
    } else {
      treeData.value = arrayToTree(
        catalogList.value,
      ) as unknown as TreeProps['treeData'];
    }
  },
  { debounce: 500 },
);

const currentNode = ref<null | Recordable<any>>(null);
const selectedKeys = computed(() => {
  return currentNode.value ? [currentNode.value.ID] : [];
});

const { push, currentRoute } = useRouter();

const nodeSelect: NonNullable<TreeProps['onSelect']> = (_, info) => {
  currentNode.value = info.node as Recordable<any>;
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
  const Where = [
    {
      FieldName: 'Type',
      ConditionalType: ConditionalType.Equal,
      FieldValue: type,
    },
  ];
  const params = {
    Where,
  };

  const res = await getBase({
    orgId: userStore.userInfo!.Orz_ID,
    params,
  });
  const list = res.List.filter((n: Recordable<any>) => n.Name);
  catalogList.value = list;
  treeData.value = arrayToTree(list) as unknown as TreeProps['treeData'];
};

const initBaseTree = async () => {
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

    push({
      name: currentRoute.value.name,
      params: {
        bId: currentNode.value!.ID,
      },
    });
  }
};

onMounted(async () => {
  await initBaseTree();
});

onActivated(async () => {
  await initBaseTree();
});
</script>

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
        class="h-full min-w-[200px] overflow-auto p-2"
        :tree-data="treeData"
        :selected-keys="selectedKeys"
        :field-names="{ key: 'ID', title: 'Name' }"
        block-node
        @select="nodeSelect"
      />
    </div>
  </Flex>
</template>

<style scoped></style>
