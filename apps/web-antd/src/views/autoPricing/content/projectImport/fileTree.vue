<!--
 * @Author: cwx
 * @Date: 2026-01-26 10:35:27
 * @LastEditTime: 2026-01-26 10:37:09
 * @LastEditors: cwx
 * @Description: 
-->
<script setup lang="ts" name="ProjectImportFileTree">
import type { TreeProps } from 'ant-design-vue';

import type { WhereType } from '#/api/basicType';

import { ref, watch } from 'vue';

import { Button, Empty, message, Tree } from 'ant-design-vue';

import {
  getAutoPricingImportFileTree,
  moveAutoPricingImportFileTree,
} from '#/api/autoPricingApi/autoPricingImportApi';
import { ConditionalType } from '#/api/basicType';
import { Authority, hasPermission } from '#/components/authority';
import { autoPricingPermission } from '#/permission';
import { arrayToTree } from '#/utils/tree';

const props = defineProps<{
  currentNode: null | Record<string, any>;
  currentRow: null | Record<string, any>;
  disabledByAudit: boolean;
}>();

const emit = defineEmits(['reloadTree']);

const permission = autoPricingPermission!.导入工程;

const treeLoading = ref(false);
const treeList = ref<TreeProps['treeData']>([]);
const expandedKeys = ref<string[]>([]);
const checkedKeys = ref<string[]>([]);

async function getTreeData() {
  if (!props.currentRow?.ID) {
    treeList.value = [];
    expandedKeys.value = [];
    return;
  }
  treeLoading.value = true;
  const Where: WhereType[] = [
    {
      FieldName: 'Type',
      ConditionalType: ConditionalType.LessThanOrEqual,
      FieldValue: 3,
    },
  ];
  const params = {
    Where,
  };
  try {
    const res = await getAutoPricingImportFileTree(props.currentRow.ID, params);
    treeList.value = arrayToTree(res.List) as unknown as TreeProps['treeData'];
    expandedKeys.value = res.List.map((item) => item.ID) as string[];
  } finally {
    treeLoading.value = false;
  }
}

watch(
  () => props.currentRow,
  (val) => {
    if (val?.ID) {
      getTreeData();
    } else {
      treeList.value = [];
      expandedKeys.value = [];
    }
  },
  {
    immediate: true,
  },
);

async function handleMoveNode() {
  if (!props.currentNode || !props.currentNode.ID) {
    message.warning('请选择左侧目录树节点');
    return;
  }
  if (checkedKeys.value.length === 0) {
    message.warning('请选择要移动的节点');
    return;
  }
  await moveAutoPricingImportFileTree(props.currentNode.ID, checkedKeys.value);
  message.success('移动成功');
  emit('reloadTree');
}
</script>

<template>
  <div class="flex h-full w-[300px] flex-col overflow-hidden p-2">
    <div class="mb-2 flex h-[30px] items-center justify-between">
      <span>文件目录树</span>
      <Authority
        v-if="hasPermission(permission.目录树_移动, 'auth')"
        :value="permission.目录树_移动"
      >
        <Button :disabled="disabledByAudit" @click="handleMoveNode">
          移动
        </Button>
      </Authority>
    </div>
    <Tree
      v-if="treeList && treeList.length > 0"
      v-loading="treeLoading"
      node-key="ID"
      checkable
      :tree-data="treeList"
      v-model:expanded-keys="expandedKeys"
      v-model:checked-keys="checkedKeys"
      :field-names="{ key: 'ID', title: 'Name' }"
      :block-node="true"
      class="flex-1 overflow-auto"
    >
      <template #title="{ data }">
        <div class="whitespace-nowrap">
          {{ data.Name }}
        </div>
      </template>
    </Tree>
    <Empty v-else :image="Empty.PRESENTED_IMAGE_SIMPLE" />
  </div>
</template>
