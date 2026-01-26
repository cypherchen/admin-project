<!--
 * @Author: cwx
 * @Date: 2026-01-26 11:47:48
 * @LastEditTime: 2026-01-26 14:59:25
 * @LastEditors: cwx
 * @Description: 
-->
<script setup lang="ts" name="SyncFeeModal">
import type { TreeProps } from 'ant-design-vue';

import { ref } from 'vue';
import { useRoute } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';

import { message, Tree } from 'ant-design-vue';

import { getAutoPricingCatalog } from '#/api/autoPricingApi/autoPricingCatalogApi';
import { syncAutoPricingFee } from '#/api/autoPricingApi/autoPricingFeeApi';
import { arrayToTree } from '#/utils/tree';

const props = defineProps<{
  currentNode: null | Record<string, any>;
}>();

const emit = defineEmits(['reload']);

const route = useRoute();
const pId = route.params.pId as string;
const vId = route.params.vId as string;

const treeLoading = ref(false);
const treeList = ref<TreeProps['treeData']>([]);
const checkedKeys = ref<string[]>([]);

async function getTreeData() {
  treeLoading.value = true;
  try {
    const res = await getAutoPricingCatalog({ pId, vId });
    treeList.value = arrayToTree(res.List) as unknown as TreeProps['treeData'];
  } finally {
    treeLoading.value = false;
  }
}

async function handleSubmit() {
  if (checkedKeys.value.length === 0) {
    message.error('未勾选节点');
    return;
  }
  if (!props.currentNode?.ID) {
    message.error('未选择当前节点');
    return;
  }
  await syncAutoPricingFee(vId, props.currentNode.ID, checkedKeys.value);
  message.success('同步成功');
  emit('reload');
  modalApi.close();
}

const [VbenModal, modalApi] = useVbenModal({
  title: '同步',
  headerClass: 'border-none',
  footerClass: 'border-none',
  onConfirm: handleSubmit,
  onOpened: () => {
    checkedKeys.value = [];
    getTreeData();
  },
});
</script>

<template>
  <VbenModal>
    <Tree
      v-if="treeList && treeList.length > 0"
      v-loading="treeLoading"
      v-model:checked-keys="checkedKeys"
      :height="400"
      checkable
      default-expand-all
      :tree-data="treeList"
      :field-names="{ key: 'ID', title: 'Name' }"
    />
  </VbenModal>
</template>
