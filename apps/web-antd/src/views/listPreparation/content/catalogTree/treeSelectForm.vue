<!--
 * @Author: cwx
 * @Date: 2025-01-24 20:56:52
 * @LastEditTime: 2026-01-17 18:23:40
 * @LastEditors: cwx
 * @Description: 目录树选择表单
-->
<script setup lang="ts" name="TreeSelectForm">
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import type { WhereType } from '#/api/basicType';

import { computed, nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';

import { Flex, InputSearch, message, Select } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { ConditionalType } from '#/api/basicType';
import { getBaseMonomer } from '#/api/dataManagementApi/baseManagementApi';
import { getMaterial } from '#/api/dataManagementApi/materialManagementApi';
import {
  postListPreparationCatalog,
  putListPreparationCatalog,
} from '#/api/listPreparationApi/listPreparationCatalogApi';

import { matColumns, monomerColumns } from './data';

const props = defineProps<{
  treeList: Record<string, any>[];
}>();

const emit = defineEmits(['submit']);

const { currentRoute } = useRouter();

const isUpdate = ref(false);
const currentNode = ref<Record<string, any>>({});
const copyTreeID = ref<string | undefined>(undefined);
const selectedRows = ref<Record<string, any>[]>([]);

const nameKeyword = ref<string>();
const featureKeyword = ref<string>();

const isMonomer = computed(() => {
  return (
    (!isUpdate.value && currentNode.value?.Hierarchy === 0) ||
    (isUpdate.value && currentNode.value?.Hierarchy === 1)
  );
});

const copyOptions = computed(() => {
  if (!currentNode.value?.treeState) return [];
  return props.treeList
    .filter((n) => n.treeState?.level === currentNode.value.treeState.level + 1)
    .map((n) => ({
      label: [...(n.treeState?.pathNames || []), n.Name].join(' -> '),
      value: n.ID,
    }));
});

const gridOptions = computed((): VxeGridProps => {
  return {
    columns: isMonomer.value ? monomerColumns : matColumns,
    height: 'auto',
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      autoLoad: true,
      ajax: {
        query: async () => {
          const bId = currentRoute.value.params.bId as string;

          const keywords_name = (nameKeyword.value || '').trim()
            ? nameKeyword.value!.trim().split(' ')
            : [];
          const keywords_feature = (featureKeyword.value || '').trim()
            ? featureKeyword.value!.trim().split(' ')
            : [];

          const Where: WhereType[] = [];

          if (isMonomer.value) {
            Where.push({
              FieldName: 'APProjectBaseTree_ID',
              ConditionalType: ConditionalType.Equal,
              FieldValue: bId,
            });
            keywords_name.length > 0 &&
              Where.push({
                ConditionalList: keywords_name.map((n) => ({
                  Key: 0,
                  Value: {
                    FieldName: 'MonomerName',
                    ConditionalType: ConditionalType.Like,
                    FieldValue: n,
                  },
                })),
              });
          } else {
            keywords_name.length > 0 &&
              Where.push({
                ConditionalList: keywords_name.map((n) => ({
                  Key: 0,
                  Value: {
                    FieldName: 'MatName',
                    ConditionalType: ConditionalType.Like,
                    FieldValue: n,
                  },
                })),
              });
            keywords_feature.length > 0 &&
              Where.push({
                ConditionalList: keywords_feature.map((n) => ({
                  Key: 0,
                  Value: {
                    FieldName: 'MatFeature',
                    ConditionalType: ConditionalType.Like,
                    FieldValue: n,
                  },
                })),
              });
          }

          const api = isMonomer.value ? getBaseMonomer : getMaterial;
          return api({
            Where,
            Order: 'Sort asc',
          });
        },
      },
    },
    checkboxConfig: {
      highlight: true,
    },
  };
});

const gridEvents: VxeGridListeners = {
  checkboxChange: ({ records }) => {
    handleSelectionChange(records as any[]);
  },
  checkboxAll: ({ records }) => {
    handleSelectionChange(records as any[]);
  },
};

function handleSelectionChange(records: any[]) {
  selectedRows.value = records.map((n) => ({
    ID: n.ID,
    Name: isMonomer.value ? n.MonomerName : n.MatName,
    Code: isMonomer.value ? n.MonomerHierarchyCode : n.MatCode,
    Specification: n.MatFeature || null,
  }));
}

async function handleSubmit() {
  if (!isUpdate.value && selectedRows.value.length === 0) {
    message.error('请至少选择一条数据新增');
    return;
  }

  if (isUpdate.value && selectedRows.value.length !== 1) {
    message.error('请选择一条数据修改');
    return;
  }

  const pId = currentRoute.value.params.pId as string;
  const vId = currentRoute.value.params.vId as string;

  const data = isUpdate.value
    ? {
        Name: selectedRows.value[0]!.Name,
        Code: selectedRows.value[0]!.Code,
        Specification: selectedRows.value[0]!.Specification,
        ID: currentNode.value.ID,
      }
    : selectedRows.value.map((n) => ({
        Name: n.Name,
        Code: n.Code,
        Specification: n.Specification,
        Parent_ID: currentNode.value.ID,
        CopyTreeID: copyTreeID.value,
        Hierarchy: currentNode.value.Hierarchy + 1,
      }));

  await (isUpdate.value
    ? putListPreparationCatalog(pId, vId, data)
    : postListPreparationCatalog(pId, vId, data));

  emit('submit');
  modalApi.close();
}

const [VbenVxeGrid, gridApi] = useVbenVxeGrid({
  gridOptions: gridOptions.value as VxeGridProps,
  gridEvents,
} as any);

const [VbenModal, modalApi] = useVbenModal({
  onConfirm: handleSubmit,
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const data = modalApi.getData<Record<string, any>>();
      isUpdate.value = data.isUpdate;
      currentNode.value = data.currentNode;
      selectedRows.value = isUpdate.value ? [currentNode.value] : [];
      copyTreeID.value = undefined;
      nameKeyword.value = undefined;
      featureKeyword.value = undefined;

      await nextTick();
      // bug: 避免类型实例化过深
      gridApi.setGridOptions(gridOptions.value as any);
      gridApi.reload();
    }
  },
});
</script>

<template>
  <VbenModal
    :title="isUpdate ? '修改' : '新增'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :fullscreen-button="false"
    footer-class="border-none"
    header-class="border-none"
    @confirm="handleSubmit"
    class="w-[1000px]"
  >
    <div class="h-[600px] w-full">
      <VbenVxeGrid>
        <template #table-title>
          <Flex align="left" vertical>
            <span v-if="selectedRows.length > 0">
              名称: {{ selectedRows.map((n) => n.Name).join(', ') }}
            </span>
            <Flex v-if="!isUpdate" align="center" class="mt-2">
              <span class="mr-2">复制节点:</span>
              <Select
                v-model:value="copyTreeID"
                :options="copyOptions"
                placeholder="请选择复制节点"
                allow-clear
                show-search
                class="w-[300px]"
                :filter-option="
                  (input, option) => (option?.label as string).includes(input)
                "
              />
            </Flex>
          </Flex>
        </template>
        <template #toolbar-tools>
          <Flex>
            <InputSearch
              v-model:value="nameKeyword"
              placeholder="名称多关键字以空格分隔"
              @search="gridApi.reload()"
              class="mr-2"
            />
            <InputSearch
              v-if="!isMonomer"
              v-model:value="featureKeyword"
              placeholder="规格多关键字以空格分隔"
              @search="gridApi.reload()"
            />
          </Flex>
        </template>
      </VbenVxeGrid>
    </div>
  </VbenModal>
</template>
