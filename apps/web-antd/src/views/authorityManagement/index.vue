<!--
 * @Author: cwx
 * @Date: 2025-03-27 16:18:41
 * @LastEditTime: 2025-03-31 09:38:56
 * @LastEditors: cwx
 * @Description: 权限管理
-->
<script setup lang="ts" name="AuthorityManagement">
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

import { computed, onMounted, ref } from 'vue';

import { ColPage } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { Button, Checkbox, CheckboxGroup, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { putRole } from '#/api/roleManagementApi/roleManagementApi';
import { putUser } from '#/api/userApi/userApi';
import { permissions } from '#/permission';
import { accessRoutes } from '#/router/routes';

import { columns } from './data';
import RoleUserTree from './roleUserTree/roleUserTree.vue';

const userStore = useUserStore();

const gridOptions: VxeGridProps = {
  columns,
  data: [],
  keepSource: true,
  height: 'auto',
  rowConfig: {
    height: 60,
  },
  pagerConfig: {
    enabled: false,
  },
  treeConfig: {
    expandAll: true,
  },
  checkboxConfig: {
    checkField: 'menuChecked',
    checkStrictly: true,
    showHeader: true,
  },
};

const isCheckAllMenu = ref<boolean>(false);

const gridEvents: VxeGridListeners = {
  checkboxAll: () => {
    isCheckAllMenu.value = !isCheckAllMenu.value;
    gridApi.grid?.setCheckboxRow(dataSource.value, isCheckAllMenu.value);
  },
  checkboxChange: ({ row, checked }) => {
    const currentRow = dataSource.value.find((n) => n.ID === row.ID);
    currentRow && (currentRow.menuChecked = checked);
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  gridEvents,
});

const isCheckAllAuth = ref<boolean>(false);
const checkAllAuthDisabled = computed(
  () => !dataSource.value.some((n) => n.menuChecked),
);

function checkAllAuth() {
  dataSource.value
    .filter((n) => n.menuChecked)
    .forEach((n) => {
      n.allChecked = isCheckAllAuth.value;
      n.checkedAuth = isCheckAllAuth.value
        ? n.auth.map((n: Record<string, any>) => n.key)
        : [];
    });
}

function checkRowAllAuth(row: Record<string, any>) {
  row.checkedAuth = row.allChecked
    ? row.auth.map((n: Record<string, any>) => n.key)
    : [];
}

function authChange(row: Record<string, any>) {
  row.allChecked =
    row.auth.map((n: Record<string, any>) => n.key).length ===
    row.checkedAuth.length;
}

const dataSource = ref<Record<string, any>[]>([]);
function transformData() {
  permissions
    .toSorted((a, b) => {
      const aIndex =
        accessRoutes.find((n) => n.name === a.key)?.meta?.order || 0;
      const bIndex =
        accessRoutes.find((n) => n.name === b.key)?.meta?.order || 0;
      return aIndex - bIndex;
    })
    .forEach((n) => {
      dataSource.value.push({
        ...n,
        menuChecked: false,
        allChecked: false,
        checkedAuth: [],
        ID: n.key,
        Parent_ID: null,
      });

      if (Array.isArray(n.tabs)) {
        n.tabs.forEach((m) => {
          dataSource.value.push({
            ...m,
            menuChecked: false,
            allChecked: false,
            checkedAuth: [],
            ID: m.key,
            Parent_ID: n.key,
          });
        });
      }
    });
}
const currentNode = ref<Record<string, any>>({});
function loadAuth() {
  isCheckAllMenu.value = false;
  isCheckAllAuth.value = false;

  dataSource.value.forEach((n) => {
    n.menuChecked = currentNode.value.Menu?.includes(n.key);
    n.allChecked = n.auth.every((a: Record<string, any>) =>
      currentNode.value.Authority?.includes(a.key),
    );
    n.checkedAuth = n.auth
      .filter((a: Record<string, any>) =>
        currentNode.value.Authority?.includes(a.key),
      )
      .map((n: Record<string, any>) => n.key);
  });
}

const treeRef = ref<InstanceType<typeof RoleUserTree> | null>(null);
const treeType = ref<number>(0);
function typeChange(type: number) {
  treeType.value = type;
  currentNode.value = {};
  loadAuth();
}

function nodeClick(node: Record<string, any>) {
  currentNode.value = node;
  loadAuth();
}

async function handleSave() {
  if (!currentNode.value.ID) {
    return message.error('请选择角色/用户');
  }

  const menu: string[] = [];
  const auth: string[] = [];

  gridApi.grid.getCheckboxRecords().forEach((n) => {
    menu.push(n.key);
    auth.push(...n.checkedAuth);
  });

  const data = { ID: currentNode.value.ID, Menu: menu, Authority: auth };
  treeType.value === 0
    ? await putRole(userStore.userInfo!.Orz_ID, data)
    : await putUser(data);
  message.success('修改成功');
  treeRef.value?.getTreeData();
}

onMounted(() => {
  transformData();

  gridApi.setGridOptions({
    data: dataSource.value,
  });
});
</script>

<template>
  <ColPage
    auto-content-height
    :left-width="15"
    :left-max-width="15"
    :left-min-width="2"
    split-handle
  >
    <template #left>
      <RoleUserTree
        ref="treeRef"
        @type-change="typeChange"
        @node-click="nodeClick"
      />
    </template>
    <Grid class="ml-2">
      <template #toolbar-actions>
        <Button type="primary" @click="handleSave">保存</Button>
      </template>
      <template #allCheckedHeader>
        <Checkbox
          v-model:checked="isCheckAllAuth"
          :disabled="checkAllAuthDisabled"
          @change="checkAllAuth"
        >
          控制
        </Checkbox>
      </template>
      <template #allChecked="{ row }">
        <Checkbox
          v-model:checked="row.allChecked"
          :disabled="!row.menuChecked"
          @change="checkRowAllAuth(row)"
        />
      </template>
      <template #auth="{ row }">
        <CheckboxGroup
          v-model:value="row.checkedAuth"
          :disabled="!row.menuChecked"
          @change="authChange(row)"
        >
          <Checkbox v-for="item in row.auth" :value="item.key" :key="item.key">
            {{ item.name }}
          </Checkbox>
        </CheckboxGroup>
      </template>
    </Grid>
  </ColPage>
</template>

<style scoped></style>
