<!--
 * @Author: cwx
 * @Date: 2025-01-24 20:56:52
 * @LastEditTime: 2025-03-15 03:02:03
 * @LastEditors: cwx
 * @Description: 清单编制目录树
-->

<template>
  <Flex vertical class="h-full w-full rounded-md bg-white p-2">
    <Tooltip
      :title="
        currentProject.BaseTreeName?.length > 16
          ? currentProject.BaseTreeName
          : ''
      "
    >
      <div class="truncate border-l-4 border-[#1b7be8] pl-2 text-sm font-bold">
        {{ currentProject.BaseTreeName }}
      </div>
    </Tooltip>
    <Input
      v-model:value="searchValue"
      allow-clear
      class="my-2"
      placeholder="请输入关键字"
    />
    <div class="flex-1 overflow-auto" v-loading="loading">
      <Tree
        class="h-full min-w-[200px]"
        :tree-data="treeData"
        v-model:expandedKeys="expandedKeys"
        :selected-keys="selectedKeys"
        :field-names="{ key: 'ID', title: 'Name' }"
        block-node
        @select="nodeSelect"
      />
    </div>
  </Flex>
</template>

<script setup lang="ts" name="CatalogTree">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Flex, Tooltip, Tree, Input } from 'ant-design-vue';

import type { Recordable } from '@vben/types';
import { watchDebounced } from '@vueuse/core';
import { useUserStore } from '@vben/stores';

import { getListPreparationCatalog } from '#/api/listPreparationApi/listPreparationContentApi';
import { getListPreparationByProjectID } from '#/api/listPreparationApi/listPreparationApi';
import { ConditionalType } from '#/api/basicType';

import { arrayToTree } from '#/utils/tree';

const emit = defineEmits(['nodeChange']);

const { currentRoute } = useRouter();

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

const nodeSelect = (_, info: Recordable<any>) => {
  currentNode.value = info.node;
  emit('nodeChange', currentNode.value);
};

const loading = ref<boolean>(false);
const catalogList = ref<Recordable<any>[]>([]);
const treeData = ref<Recordable<any>[]>([]);
const expandedKeys = ref<string[]>([]);
const getCatalogList = async () => {
  loading.value = true;
  const Where = [];
  Where.push({
    FieldName: 'Hierarchy',
    ConditionalType: ConditionalType.LessThanOrEqual,
    FieldValue: 3,
  });
  const params = {
    Where,
  };

  try {
    const res = await getListPreparationCatalog({
      pId: pId.value,
      vId: vId.value,
      params,
    });
    catalogList.value = res.List;
    treeData.value = arrayToTree(res.List);
    expandedKeys.value = res.List.map((n: Recordable<any>) => n.ID);
  } finally {
    loading.value = false;
  }
};

const currentProject = ref<Recordable<any>>({});
const getProject = async () => {
  const orgId = userStore.userInfo!.Orz_ID;
  const res = await getListPreparationByProjectID(orgId, pId.value);
  currentProject.value = res.List[0]!;
};

const pId = ref<string>('');
const vId = ref<string>('');
const auditStatus = ref<string>('');
onMounted(async () => {
  pId.value = currentRoute.value.params?.pId as string;
  vId.value = currentRoute.value.params?.vId as string;
  auditStatus.value = currentRoute.value.query?.auditStatus as string;

  getProject();

  await getCatalogList();

  if (treeData.value?.length) {
    currentNode.value = treeData.value[0]!;

    emit('nodeChange', currentNode.value);
  }
});

defineExpose({ getCatalogList });
</script>

<style scoped></style>
