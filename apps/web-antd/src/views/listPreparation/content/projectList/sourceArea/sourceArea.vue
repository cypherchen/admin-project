<!--
 * @Author: cwx
 * @Date: 2026-01-19 17:34:22
 * @LastEditTime: 2026-01-21 10:20:04
 * @LastEditors: cwx
 * @Description: 项目库源数据区域
-->
<script setup lang="ts" name="SourceArea">
import type { TreeProps } from 'ant-design-vue/es/tree';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { onMounted, ref } from 'vue';

import { useUserStore } from '@vben/stores';

import { watchDebounced } from '@vueuse/core';
import {
  Button,
  Empty,
  Flex,
  InputSearch,
  RadioGroup,
  Select,
  Tree,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getList,
  getListRepository,
  getListTree,
} from '#/api/listRepositoryApi/listRepositoryApi';
import {
  getMaterial,
  getMaterialRepository,
  getMaterialTree,
} from '#/api/materialRepositoryApi/materialRepositoryApi';
import { Authority } from '#/components/authority';
import { listPreparationPermission } from '#/permission';
import { arrayToTree } from '#/utils/tree';

import { columns } from './data';

const props = withDefaults(defineProps<Props>(), {
  currentNode: () => ({}),
  disabled: false,
});

const emit = defineEmits(['addData', 'replaceData']);

const permission = listPreparationPermission!.项目清单;

interface Props {
  currentNode?: Record<string, any>;
  disabled?: boolean;
}

const userStore = useUserStore();
const orgId = userStore.userInfo!.Orz_ID;

const activeKey = ref<number>(0);
const currentRepository = ref<string | undefined>(undefined);
const repositoryOptions = ref<[Record<string, any>[], Record<string, any>[]]>([
  [],
  [],
]);
const catalogList = ref<Record<string, any>[]>([]);
const treeData = ref<TreeProps['treeData']>([]);
const treeLoading = ref<boolean>(false);
const searchValue = ref<string>('');
const keyword = ref<string>('');
const currentTreeNode = ref<any>(null);

const gridOptions: VxeGridProps = {
  columns,
  height: 'auto',
  pagerConfig: {
    enabled: false,
  },
  rowConfig: {
    isCurrent: true,
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: async () => {
        if (!currentTreeNode.value) return { List: [] };

        const params = {
          keyname: keyword.value,
          Order:
            activeKey.value === 0 ? 'Code asc, CreatedTime asc' : 'Sort asc',
        };

        return activeKey.value === 0
          ? getList({
              orgId,
              treeId: currentTreeNode.value.ID,
              params,
            })
          : getMaterial({
              treeId: currentTreeNode.value.ID,
              params,
            });
      },
      querySuccess: ({ response }) => {
        if (activeKey.value === 1) {
          response.List.forEach((n: Record<string, any>) => {
            n.Feature = n.Specification;
          });
        }
      },
    },
  },
};

const [VbenVxeGrid, gridApi] = useVbenVxeGrid({
  gridOptions: gridOptions as VxeGridProps,
} as any);

const getRepositoryOptions = async () => {
  const listRepository = await getListRepository({
    orgId,
    params: { Order: 'CreatedTime asc' },
  });
  const materialRepository = await getMaterialRepository({
    orgId,
    params: { Order: 'CreatedTime asc' },
  });
  repositoryOptions.value = [listRepository.List, materialRepository.List];
};

const handleActiveKeyChange = () => {
  currentRepository.value = undefined;
  catalogList.value = [];
  treeData.value = [];
  currentTreeNode.value = null;
  gridApi.reload();
};

const getTreeList = async () => {
  if (!currentRepository.value) return;
  treeLoading.value = true;
  catalogList.value = [];
  treeData.value = [];
  currentTreeNode.value = null;

  try {
    let list: Record<string, any>[] = [];
    if (activeKey.value === 0) {
      const res = await getListTree({
        orgId,
        warehouseID: currentRepository.value,
        params: {},
      });
      list = res.List;
    } else {
      const res = await getMaterialTree({
        warehouseID: currentRepository.value,
        params: {},
      });
      list = res.List;
    }

    catalogList.value = list;
    treeData.value = arrayToTree(list) as unknown as TreeProps['treeData'];
  } finally {
    treeLoading.value = false;
  }
};

const handleSelect: TreeProps['onSelect'] = (_, info) => {
  currentTreeNode.value = info.node;
  gridApi.setGridOptions(gridOptions as any);
  gridApi.reload();
};

const handleAdd = () => {
  const checked = gridApi.grid?.getCheckboxRecords();

  const repoName = repositoryOptions.value[activeKey.value]!.find(
    (item) => item.ID === currentRepository.value,
  )?.Name;

  const data = {
    Source:
      activeKey.value === 0
        ? `【清单库】-${repoName}`
        : `【材料库】-${repoName}`,
    SourceType: activeKey.value + 1,
    IDList: checked?.map((n) => n.ID),
  };
  emit('addData', data);
};

const handleReplace = () => {
  const currentRow = gridApi.grid?.getCurrentRecord();
  const data = currentRow
    ? {
        SourceType: activeKey.value + 1,
        SourceID: currentRow.ID,
        Code: currentRow.Code,
        Name: currentRow.Name,
      }
    : null;
  emit('replaceData', data);
};

watchDebounced(
  () => searchValue.value,
  () => {
    if (searchValue.value?.trim()) {
      const idList = new Set(
        new Set(
          catalogList.value
            .filter((n: Record<string, any>) =>
              n.Name.includes(searchValue.value.trim()),
            )
            .flatMap((n: Record<string, any>) => [
              n.ID,
              ...n.treeState.pathIDs,
            ]),
        ),
      );
      treeData.value = arrayToTree(
        catalogList.value.filter((n: Record<string, any>) => idList.has(n.ID)),
      ) as unknown as TreeProps['treeData'];
    } else {
      treeData.value = arrayToTree(
        catalogList.value,
      ) as unknown as TreeProps['treeData'];
    }
  },
  { debounce: 500 },
);

onMounted(() => {
  getRepositoryOptions();
});
</script>

<template>
  <Flex class="h-full w-full">
    <Flex vertical class="mt-2 w-1/6 border-r p-2 pt-0">
      <RadioGroup
        v-model:value="activeKey"
        :options="[
          { label: '清单库', value: 0 },
          { label: '材料库', value: 1 },
        ]"
        option-type="button"
        button-style="solid"
        class="mb-2"
        @change="handleActiveKeyChange"
      />
      <Select
        v-model:value="currentRepository"
        placeholder="请选择仓库"
        :options="repositoryOptions[activeKey]"
        :field-names="{ label: 'Name', value: 'ID' }"
        @change="getTreeList"
        class="mb-2 w-full"
      />
      <InputSearch
        v-model:value="searchValue"
        placeholder="请输入关键词过滤"
        class="mb-2 w-full"
      />
      <Tree
        v-if="treeData && treeData.length > 0"
        :tree-data="treeData"
        default-expand-all
        block-node
        class="flex-1 overflow-auto p-2"
        @select="handleSelect"
      >
        <template #title="{ data }">
          <div>{{ data.Name }}</div>
        </template>
      </Tree>
      <Empty v-else :image="Empty.PRESENTED_IMAGE_SIMPLE" />
    </Flex>

    <VbenVxeGrid class="w-5/6">
      <template #table-title>
        <Authority :value="permission.清单_批量增加">
          <Button
            type="primary"
            :disabled="props.disabled"
            @click="handleAdd"
            class="mr-2"
          >
            增加
          </Button>
        </Authority>
        <Authority :value="permission.清单_替换">
          <Button :disabled="props.disabled" @click="handleReplace">
            替换
          </Button>
        </Authority>
      </template>
      <template #toolbar-tools>
        <InputSearch
          v-model:value="keyword"
          placeholder="请输入名称或特征关键字, 多关键字以空格分隔"
          class="w-[350px]"
          @search="gridApi.reload()"
        />
      </template>
    </VbenVxeGrid>
  </Flex>
</template>
