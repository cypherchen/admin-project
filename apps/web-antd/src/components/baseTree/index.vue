<!--
 * @Author: cwx
 * @Date: 2024-12-24 20:46:24
 * @LastEditTime: 2024-12-25 23:24:56
 * @LastEditors: cwx
 * @Description: 基地树
-->
<template>
  <div>
    <Tree
      class="h-full overflow-auto p-2"
      :treeData="treeData"
      v-model:selectedKeys="selectedKeys"
      :fieldNames="{ key: 'ID', title: 'Name' }"
      @select="nodeSelect"
    ></Tree>
  </div>
</template>

<script setup lang="ts" name="BaseTree">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Tree } from 'ant-design-vue';

import type { Recordable } from '@vben/types';
import { useUserStore } from '@vben/stores';

import { getBase } from '#/api/dataManagementApi/baseManagementApi';

import { arrayToTree } from '#/utils/tree';

const emit = defineEmits(['nodeClick']);

const userStore = useUserStore();

const { push, currentRoute } = useRouter();
const nodeSelect = (_, info: Recordable<any>) => {
  currentNode.value = info.node;
  emit('nodeClick', currentNode.value);
  push({
    query: {
      bId: currentNode.value!.ID,
    },
  });
};

const currentNode = ref<Recordable<any> | null>(null);
const selectedKeys = ref<string[]>([]);
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
    selectedKeys.value = [currentNode.value.ID];
    emit('nodeClick', currentNode.value);
  }
});
</script>

<style scoped></style>
