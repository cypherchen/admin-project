<!--
 * @Author: cwx
 * @Date: 2025-01-24 20:35:57
 * @LastEditTime: 2026-01-17 00:21:47
 * @LastEditors: cwx
 * @Description: 清单编制内容
-->
<script setup lang="ts" name="ListPreparationContent">
import type { TabsProps } from 'ant-design-vue';

import { computed, defineAsyncComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { ColPage } from '@vben/common-ui';

import { RollbackOutlined } from '@ant-design/icons-vue';
import { TabPane, Tabs } from 'ant-design-vue';

import { hasPermission } from '#/components/authority';
import { listPreparationPermission } from '#/permission';

import CatalogTree from './catalogTree/catalogTree.vue';

const { currentRoute, push } = useRouter();

const tabList = [
  {
    name: '导入工程',
    key: 'ProjectImport',
    component: defineAsyncComponent(() => import('./projectImport/index.vue')),
    authKey: listPreparationPermission!.导入工程.key,
  },
  {
    name: '项目信息',
    key: 'ProjectParams',
    component: defineAsyncComponent(() => import('./projectParams/index.vue')),
    authKey: listPreparationPermission!.项目信息.key,
  },
  {
    name: '项目查询',
    key: 'ProjectReference',
    component: defineAsyncComponent(
      () => import('./projectReference/index.vue'),
    ),
    authKey: listPreparationPermission!.项目查询.key,
  },
  {
    name: '项目清单',
    key: 'ProjectList',
    component: defineAsyncComponent(() => import('./projectList/index.vue')),
    authKey: listPreparationPermission!.项目清单.key,
  },
  {
    name: '清单核查',
    key: 'ListCheck',
    component: defineAsyncComponent(() => import('./listCheck/index.vue')),
    authKey: listPreparationPermission!.清单核查.key,
  },
];

const computedTabList = computed(() =>
  tabList.filter((item) => hasPermission(item.authKey, 'menu')),
);

const currentNode = ref<null | Record<string, any>>(null);
const handleNodeChange = (node: Record<string, any>) => {
  currentNode.value = node;
};

const activeKey = ref<string | undefined>('');
const handleTabChange: TabsProps['onChange'] = (key) => {
  push({
    name: currentRoute.value.name,
    query: {
      currentTab: key,
    },
  });
};

const handleBack = () => {
  push({
    name: 'listPreparationList',
    params: {
      bId: currentRoute.value.params?.bId,
    },
  });
};

const treeRef = ref<InstanceType<typeof CatalogTree> | null>(null);
const reloadTree = async () => {
  treeRef.value && (await treeRef.value.getCatalogList());
};

onMounted(() => {
  activeKey.value =
    (currentRoute.value.query?.currentTab as string) ||
    computedTabList.value[0]?.key;
});
</script>

<template>
  <ColPage
    auto-content-height
    :left-width="12"
    :left-max-width="12"
    :left-min-width="2"
    split-handle
  >
    <template #left>
      <CatalogTree ref="treeRef" @node-change="handleNodeChange" />
    </template>
    <div class="ml-2 h-full w-full rounded-md bg-card p-2">
      <Tabs
        v-model:active-key="activeKey"
        @change="handleTabChange"
        class="h-full"
      >
        <template #rightExtra>
          <a-button type="link" @click="handleBack">
            <template #icon>
              <RollbackOutlined />
            </template>
            返回台账页
          </a-button>
        </template>
        <TabPane
          v-for="item in computedTabList"
          :key="item.key"
          :tab="item.name"
        >
          <component
            :key="item.key"
            :is="item.component"
            :current-node="currentNode"
            @reload-tree="reloadTree"
          />
        </TabPane>
      </Tabs>
    </div>
  </ColPage>
</template>

<style scoped>
:deep(.ant-tabs-content-holder) {
  height: 100%;
}
</style>
