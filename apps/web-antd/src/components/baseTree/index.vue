<!--
 * @Author: cwx
 * @Date: 2024-12-24 20:46:24
 * @LastEditTime: 2025-01-24 20:41:58
 * @LastEditors: cwx
 * @Description: 基地树
-->
<script setup lang="ts" name="BaseTree">
import type { Recordable } from '@vben/types';

import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useUserStore } from '@vben/stores';

import { Tree } from 'ant-design-vue';

import { getBase } from '#/api/dataManagementApi/baseManagementApi';
import { arrayToTree } from '#/utils/tree';

const emit = defineEmits(['nodeClick']);

const userStore = useUserStore();

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
    query: {
      bId: currentNode.value!.ID,
    },
  });
};

const treeData = ref<Recordable<any>[]>([]);
onMounted(async () => {
  const res = await getBase({
    orgId: userStore.userInfo!.Orz_ID,
  });
  const list = res.List.filter((n: Recordable<any>) => n.Name);

  if (list?.length) {
    treeData.value = arrayToTree(list);

    currentNode.value = currentRoute.value.query.bId
      ? list.find(
          (n: Recordable<any>) => n.ID === currentRoute.value.query.bId,
        )!
      : treeData.value[0]!;
    emit('nodeClick', currentNode.value);
  }
});
</script>

<template>
  <div class="h-full w-full overflow-auto rounded-md bg-white">
    <Tree
      class="h-full min-w-[250px] p-2"
      :tree-data="treeData"
      :selected-keys="selectedKeys"
      :field-names="{ key: 'ID', title: 'Name' }"
      block-node
      @select="nodeSelect"
    />
  </div>
</template>

<style scoped></style>
