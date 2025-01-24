<!--
 * @Author: cwx
 * @Date: 2024-12-19 20:55:28
 * @LastEditTime: 2025-01-24 20:57:22
 * @LastEditors: cwx
 * @Description: 清单编制台账页
-->

<script lang="ts" setup name="ListPreparation">
import type { Recordable } from '@vben/types';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type { WhereType } from '#/api/basicType';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { ColPage } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { Button, Popconfirm } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { ConditionalType } from '#/api/basicType';
import { getListPreparation } from '#/api/listPreparationApi/listPreparationApi';
import BaseTree from '#/components/baseTree/index.vue';

import { columns, searchFormSchema } from './data';

const userStore = useUserStore();

const currentNode = ref<null | Recordable<any>>(null);
const gridOptions: VxeGridProps<Recordable<any>> = {
  columns,
  keepSource: true,
  height: 'auto',
  pagerConfig: {
    enabled: false,
  },
  treeConfig: {
    transform: true,
    expandAll: true,
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: async ({ page }, formValues) => {
        const where: WhereType[] = [];
        if (formValues.Name) {
          where.push({
            ConditionalType: ConditionalType.Like,
            FieldName: 'Name',
            FieldValue: formValues.Name,
          });
        }

        const params = {
          Where: where,
          PageSize: page.pageSize,
          PageIndex: page.currentPage,
        };

        return await getListPreparation({
          orgId: userStore.userInfo!.Orz_ID,
          treeId: currentNode.value?.ID,
          params,
        });
      },
    },
  },
  editConfig: {
    mode: 'cell',
    trigger: 'click',
  },
};

const [Grid, { reload }] = useVbenVxeGrid({
  gridOptions,
  formOptions: {
    schema: searchFormSchema,
    showCollapseButton: false,
  },
});

const nodeClick = (node: Recordable<any>) => {
  currentNode.value = node;
  reload();
};

const { push } = useRouter();
function handleView(row: Recordable<any>) {
  push({
    name: 'ListPreparationDetail',
    params: {
      bId: currentNode.value!.ID,
      pId: row.ID,
      vId: row.Version_ID,
    },
  });
}

async function handleDelete() {}
</script>

<template>
  <ColPage
    auto-content-height
    :left-width="10"
    :left-min-width="2"
    split-handle
  >
    <template #left>
      <BaseTree @node-click="nodeClick" />
    </template>
    <Grid class="ml-2">
      <template #toolbar-actions>
        <Button class="mr-2" type="primary"> 新建 </Button>
      </template>
      <template #action="{ row }">
        <Button type="link" @click="handleView(row)" class="px-1">
          编辑
        </Button>
        <Popconfirm
          title="是否确认删除?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="handleDelete()"
        >
          <Button type="link" danger class="px-1"> 删除 </Button>
        </Popconfirm>
      </template>
    </Grid>
  </ColPage>
</template>
