<!--
 * @Author: cwx
 * @Date: 2025-03-20 08:55:59
 * @LastEditTime: 2025-03-20 14:39:08
 * @LastEditors: cwx
 * @Description: 表格操作列
-->
<template>
  <div>
    <template
      v-for="(action, index) in getActions(actions)"
      :key="action.label"
    >
      <ActionButton :action="action"></ActionButton>
      <Divider
        type="vertical"
        class="m-0"
        v-if="divider && index < getActions(actions).length - 1"
      />
    </template>
    <Dropdown
      v-if="getActions(dropdownActions)?.length > 0"
      trigger="hover"
      :destroyPopupOnHide="true"
    >
      <MoreOutlined />
      <template #overlay>
        <Flex vertical>
          <ActionButton
            v-for="action in getActions(dropdownActions)"
            :key="action.label"
            :action="action"
          ></ActionButton>
        </Flex>
      </template>
    </Dropdown>
  </div>
</template>

<script setup lang="tsx" name="TableAction">
import { toRefs, type PropType } from 'vue';
import { Divider, Dropdown, Flex } from 'ant-design-vue';
import { MoreOutlined } from '@ant-design/icons-vue';

import type { ActionItem } from './types';
import ActionButton from './actionButton.vue';

import { isBoolean, isFunction } from '@vben/utils';
import { hasPermission } from '#/components/authority';

const props = defineProps({
  actions: {
    type: Array as PropType<ActionItem[]>,
    default: () => [],
  },
  dropdownActions: {
    type: Array as PropType<ActionItem[]>,
    default: () => [],
  },
  divider: {
    type: Boolean,
    default: true,
  },
});
const { actions, dropdownActions, divider } = toRefs(props);

const getIfShow = (action: ActionItem): boolean => {
  const ifShow = action.ifShow;

  let show = true;

  if (isBoolean(ifShow)) {
    show = ifShow;
  }
  if (isFunction(ifShow)) {
    show = ifShow(action);
  }

  return show;
};

const getActions = (actions: ActionItem[]) => {
  return actions.filter(
    (item) => hasPermission(item.auth, 'auth') && getIfShow(item),
  );
};
</script>

<style scoped></style>
