<!--
 * @Author: cwx
 * @Date: 2026-01-21 17:23:12
 * @LastEditTime: 2026-01-22 10:13:29
 * @LastEditors: cwx
 * @Description: 
-->
<script setup lang="ts">
import type { VxeGridProps } from '#/adapter/vxe-table';

import { useRoute } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getListPreparationInspectSummary } from '#/api/listPreparationApi/listPreparationInspectApi';

import { columns } from './data';

const route = useRoute();
const vId = (route.params.vId as string) || '';
const pId = (route.params.pId as string) || '';

const gridOptions: VxeGridProps = {
  columns,
  height: 500,
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: async () => {
        if (!vId || !pId) {
          return { List: [] };
        }
        return getListPreparationInspectSummary(pId, vId);
      },
    },
  },
};

const [VbenVxeGrid, gridApi] = useVbenVxeGrid({
  gridOptions: gridOptions as VxeGridProps,
} as any);

const [VbenModal] = useVbenModal({
  title: '问题报告',
  fullscreen: false,
  footer: false,
  headerClass: 'border-none',
  class: 'w-[1000px]',
  onOpened: () => {
    gridApi.reload();
  },
});
</script>

<template>
  <VbenModal>
    <VbenVxeGrid />
  </VbenModal>
</template>
