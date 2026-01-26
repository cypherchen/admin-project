<!--
 * @Author: cwx
 * @Date: 2025-01-24 20:56:52
 * @LastEditTime: 2026-01-26 09:55:37
 * @LastEditors: cwx
 * @Description: 自动套价目录树
-->

<script setup lang="ts" name="CatalogTree">
import type { TreeProps } from 'ant-design-vue';

import type { Recordable } from '@vben/types';

import { computed, h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue';
import { watchDebounced } from '@vueuse/core';
import {
  Button,
  Flex,
  Input,
  message,
  Modal,
  Select,
  Tooltip,
  Tree,
} from 'ant-design-vue';

import { ConditionalType } from '#/api/basicType';
import { getAutoPricingByProjectID } from '#/api/autoPricingApi/autoPricingApi';
import {
  deleteAutoPricingCatalog,
  getAutoPricingCatalog,
} from '#/api/autoPricingApi/autoPricingCatalogApi';
import { Authority } from '#/components/authority';
import { autoPricingPermission } from '#/permission';
import { arrayToTree } from '#/utils/tree';

import TreeForm from './treeForm.vue';
import TreeSelectForm from './treeSelectForm.vue';

const emit = defineEmits(['nodeChange']);

const { currentRoute } = useRouter();

const permission = autoPricingPermission!.导入工程;

const [TreeFormModal, treeFormApi] = useVbenModal({
  connectedComponent: TreeForm,
});

const [TreeSelectFormModal, treeSelectFormApi] = useVbenModal({
  connectedComponent: TreeSelectForm,
});

const expandLevel = ref<number>(3);

const maxLevel = computed(() => {
  if (catalogList.value.length === 0) return 3;
  return Math.max(
    ...catalogList.value.map(
      (n: Recordable<any>) => n.treeState?.level + 1 || 0,
    ),
  );
});

const levelOptions = computed(() => {
  return Array.from(
    {
      length: maxLevel.value,
    },
    (_, index) => ({
      label: `${index + 1}级`,
      value: index,
    }),
  );
});

const levelChange = () => {
  expandedKeys.value = catalogList.value
    .filter((n: Recordable<any>) => n.Hierarchy <= expandLevel.value - 1)
    .map((n: Recordable<any>) => n.ID);
};

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

const nodeSelect: TreeProps['onSelect'] = (_, info) => {
  currentNode.value = info.node;
  emit('nodeChange', currentNode.value);
};

const loading = ref<boolean>(false);
const catalogList = ref<Recordable<any>[]>([]);
const treeData = ref<TreeProps['treeData']>([]);
const expandedKeys = ref<string[]>([]);
const getCatalogList = async () => {
  loading.value = true;
  const Where = [
    {
      FieldName: 'Hierarchy',
      ConditionalType: ConditionalType.LessThanOrEqual,
      FieldValue: 3,
    },
  ];
  const params = {
    Where,
  };

  try {
    const res = await getAutoPricingCatalog({
      pId: pId.value,
      vId: vId.value,
      params,
    });
    catalogList.value = res.List;
    treeData.value = arrayToTree(res.List) as unknown as TreeProps['treeData'];

    if (expandedKeys.value.length === 0) {
      expandedKeys.value = res.List.filter(
        (item: Recordable<any>) => item.Hierarchy <= expandLevel.value - 1,
      ).map((item: Recordable<any>) => item.ID);
    }

    if (currentNode.value) {
      const newNode = res.List.find(
        (n: Record<string, any>) => n.ID === currentNode.value?.ID,
      );
      if (newNode) {
        currentNode.value = newNode;
      }
    }
  } finally {
    loading.value = false;
  }
};

const currentProject = ref<Recordable<any>>({});
const getProject = async () => {
  const res = await getAutoPricingByProjectID(pId.value);
  currentProject.value = res.List[0]!;
};

const pId = ref<string>('');
const vId = ref<string>('');
const auditStatus = ref<string>('');

const disabledByAudit = computed(() => {
  return [1, 2].includes(Number(auditStatus.value));
});

const addDisable = computed(() => {
  return currentNode.value?.Hierarchy === 3;
});

const editDisable = computed(() => {
  return currentNode.value?.Hierarchy === 0;
});

const deleteDisable = computed(() => {
  return currentNode.value?.Hierarchy === 0;
});

function showTreeForm(isUpdate: boolean) {
  if (!currentNode.value && !isUpdate) return;
  if (!currentNode.value && isUpdate) {
    message.warning('请选择一个节点');
    return;
  }

  const hierarchy = currentNode.value?.Hierarchy;

  let useSelectForm = false;
  if (isUpdate) {
    // Modify
    if ([1, 2].includes(hierarchy)) {
      useSelectForm = true;
    }
  } else {
    // Add
    if ([0, 1].includes(hierarchy)) {
      useSelectForm = true;
    }
  }

  const data = {
    isUpdate,
    currentNode: currentNode.value,
  };

  if (useSelectForm) {
    treeSelectFormApi.setData(data);
    treeSelectFormApi.open();
  } else {
    treeFormApi.setData(data);
    treeFormApi.open();
  }
}

async function deleteTreeNode() {
  if (!currentNode.value) return;

  Modal.confirm({
    title: '提示',
    content: '是否删除该节点及其关联数据?',
    type: 'warning',
    onOk: async () => {
      await deleteAutoPricingCatalog(
        pId.value,
        vId.value,
        currentNode.value!.ID,
      );
      message.success('删除成功');
      await getCatalogList();

      if (treeData.value?.length) {
        currentNode.value = treeData.value[0]!;
        emit('nodeChange', currentNode.value);
      } else {
        currentNode.value = null;
        emit('nodeChange', null);
      }
    },
  });
}

onMounted(async () => {
  pId.value = currentRoute.value.params?.pId as string;
  vId.value = currentRoute.value.params?.vId as string;
  auditStatus.value = currentRoute.value.query?.auditStatus as string;

  getProject();

  await getCatalogList();

  expandLevel.value = maxLevel.value - 1;

  if (treeData.value?.length) {
    currentNode.value = treeData.value[0]!;

    emit('nodeChange', currentNode.value);
  }
});

defineExpose({ getCatalogList });
</script>

<template>
  <Flex vertical class="h-full w-full rounded-md bg-card">
    <Tooltip
      :title="
        currentProject.BaseTreeName?.length > 16
          ? currentProject.BaseTreeName
          : ''
      "
    >
      <div
        class="m-2 truncate border-l-4 border-[#1b7be8] pl-2 text-sm font-bold"
      >
        {{ currentProject.BaseTreeName }}
      </div>
    </Tooltip>

    <Flex justify="center" class="my-2 bg-card">
      <div class="flex gap-1">
        <Authority :value="permission.目录树_新增">
          <Button
            size="small"
            :icon="h(PlusOutlined)"
            title="添加节点"
            :disabled="addDisable || disabledByAudit"
            @click="showTreeForm(false)"
          />
        </Authority>
        <Authority :value="permission.目录树_删除">
          <Button
            size="small"
            :icon="h(DeleteOutlined)"
            title="删除节点"
            :disabled="deleteDisable || disabledByAudit"
            @click="deleteTreeNode"
          />
        </Authority>
        <Authority :value="permission.目录树_修改">
          <Button
            size="small"
            :icon="h(EditOutlined)"
            title="修改节点"
            :disabled="editDisable || disabledByAudit"
            @click="showTreeForm(true)"
          />
        </Authority>
      </div>
    </Flex>

    <Flex class="mb-2 p-2">
      <Select
        v-model:value="expandLevel"
        :options="levelOptions"
        @change="levelChange"
        class="mr-2 w-[90px]"
      />
      <Input
        v-model:value="searchValue"
        allow-clear
        placeholder="请输入关键字"
      />
    </Flex>
    <Tree
      v-loading="loading"
      class="flex-1 overflow-auto"
      :tree-data="treeData"
      v-model:expanded-keys="expandedKeys"
      :selected-keys="selectedKeys"
      :field-names="{ key: 'ID', title: 'Name' }"
      block-node
      @select="nodeSelect"
    >
      <template #title="{ data }">
        <div v-if="data.Hierarchy !== 2" class="whitespace-nowrap">
          {{ data.Name }}
        </div>
        <div v-else class="whitespace-nowrap">
          <template v-if="!data.Specification">
            {{ data.Code ? `${data.Name} - [${data.Code}]` : data.Name }}
          </template>
          <Tooltip
            v-else
            :title="data.Specification"
            overlay-class-name="!max-w-lg"
            placement="topLeft"
          >
            {{ data.Code ? `${data.Name} - [${data.Code}]` : data.Name }}
          </Tooltip>
        </div>
      </template>
    </Tree>

    <TreeFormModal :tree-list="catalogList" @submit="getCatalogList" />
    <TreeSelectFormModal :tree-list="catalogList" @submit="getCatalogList" />
  </Flex>
</template>
