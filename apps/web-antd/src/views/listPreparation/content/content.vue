<!--
 * @Author: cwx
 * @Date: 2025-01-24 20:35:57
 * @LastEditTime: 2025-03-15 03:05:12
 * @LastEditors: cwx
 * @Description: 清单编制内容
-->
<template>
  <ColPage
    auto-content-height
    :left-width="10"
    :left-max-width="10"
    :left-min-width="2"
    split-handle
  >
    <template #left>
      <CatalogTree ref="treeRef" @nodeChange="handleNodeChange"></CatalogTree>
    </template>
    <div class="ml-2 h-full w-full rounded-md bg-white p-2">
      <Tabs
        v-model:activeKey="activeKey"
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
            :currentNode="currentNode"
            @reloadTree="reloadTree"
          ></component>
        </TabPane>
      </Tabs>
    </div>
  </ColPage>
</template>

<script setup lang="ts" name="ListPreparationContent">
import { ref, computed, onMounted } from 'vue';
import { Tabs, TabPane } from 'ant-design-vue';
import { RollbackOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';

import { ColPage } from '@vben/common-ui';

import CatalogTree from './catalogTree/catalogTree.vue';
import ProjectImport from './projectImport/index.vue';
import ProjectParams from './projectParams/index.vue';
import ProjectReference from './projectReference/index.vue';
import ProjectList from './projectList/index.vue';
import ListCheck from './listCheck/index.vue';

const { currentRoute, push } = useRouter();

const tabList = [
  {
    name: '导入工程',
    key: 'ProjectImport',
    component: ProjectImport,
  },
  {
    name: '项目信息',
    key: 'ProjectParams',
    component: ProjectParams,
  },
  {
    name: '项目查询',
    key: 'ProjectReference',
    component: ProjectReference,
  },
  {
    name: '项目清单',
    key: 'ProjectList',
    component: ProjectList,
  },
  {
    name: '清单核查',
    key: 'ListCheck',
    component: ListCheck,
  },
];

const computedTabList = computed(() => tabList.filter((item) => true));

const currentNode = ref<null | Record<string, any>>(null);
const handleNodeChange = (node: Record<string, any>) => {
  currentNode.value = node;
};

const activeKey = ref<string | undefined>('');
const handleTabChange = (key: string) => {
  push({
    name: currentRoute.value.name,
    query: {
      currentTab: key,
    },
  });
};

const handleBack = () => {
  push({
    name: 'ListPreparationList',
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

<style scoped>
:deep(.ant-tabs-content-holder) {
  height: 100%;
}
</style>
