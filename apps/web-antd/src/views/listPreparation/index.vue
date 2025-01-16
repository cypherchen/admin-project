<!--
 * @Author: cwx
 * @Date: 2024-12-19 20:55:28
 * @LastEditTime: 2024-12-25 23:47:25
 * @LastEditors: cwx
 * @Description: 清单编制台账页
-->
<script lang="ts" setup name="ListPreparation">
import { ref } from 'vue';
import { Button } from 'ant-design-vue';

import { type VxeGridProps, useVbenVxeGrid } from '#/adapter/vxe-table';
import { Page } from '@vben/common-ui';

import type { Recordable } from '@vben/types';
import { useUserStore } from '@vben/stores';

import { getListPreparation } from '#/api/listPreparationApi/listPreparationApi';

import { columns } from './data';

import BaseTree from '#/components/baseTree/index.vue';

const userStore = useUserStore();

const gridOptions: VxeGridProps<Recordable<any>> = {
  columns: columns,
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
      query: async ({ page }) => {
        return await getListPreparation({
          orgId: userStore.userInfo!.Orz_ID,
          treeId: currentNode.value?.ID,
          params: { PageSize: page.pageSize, PageIndex: page.currentPage },
        });
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

const currentNode = ref<Recordable<any> | null>(null);
const nodeClick = (node: Recordable<any>) => {
  currentNode.value = node;
  gridApi.reload();
};
</script>

<template>
  <Page auto-content-height content-class="gap-2 flex">
    <BaseTree
      class="w-250px h-full flex-none"
      @node-click="nodeClick"
    ></BaseTree>
    <Grid>
      <template #toolbar-actions>
        <Button class="mr-2" type="primary"> 新建 </Button>
      </template>
    </Grid>
  </Page>
</template>
