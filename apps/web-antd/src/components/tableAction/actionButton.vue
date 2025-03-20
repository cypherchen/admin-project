<!--
 * @Author: cwx
 * @Date: 2025-03-20 11:05:24
 * @LastEditTime: 2025-03-20 14:54:18
 * @LastEditors: cwx
 * @Description: 操作列按钮
-->
<template>
  <Tooltip v-bind="getTooltip(action)">
    <Button
      v-if="action.model === 'button'"
      v-bind="action"
      type="link"
      size="small"
      @click="action.onClick"
      class="!text-[13px]"
      :class="getColorClass(action)"
    >
      {{ action.label }}
    </Button>
    <Popconfirm v-else v-bind="getPopConfirm(action)">
      <Button
        v-bind="action"
        type="link"
        size="small"
        class="!text-[13px]"
        :class="getColorClass(action)"
      >
        {{ action.label }}
      </Button>
    </Popconfirm>
  </Tooltip>
</template>

<script setup lang="tsx" name="ActionButton">
import { toRefs, type PropType } from 'vue';
import { Tooltip, Button, Popconfirm } from 'ant-design-vue';

import type { ActionItem } from './types';
import { isObject, isString } from '@vben/utils';

const props = defineProps({
  action: {
    type: Object as PropType<ActionItem>,
    default: () => ({}),
  },
});
const { action } = toRefs(props);

const getTooltip = (action: ActionItem) => {
  if (isObject(action.tooltip)) {
    return action.tooltip;
  }
  if (isString(action.tooltip)) {
    return { title: action.tooltip, destroyTooltipOnHide: true };
  }
  return undefined;
};

const getPopConfirm = (action: ActionItem) => {
  const defaultPopConfirm = {
    title: `是否确认${action.label}?`,
    onConfirm: action.popConfirm?.confirm,
    onCancel: action.popConfirm?.cancel,
    disabled: action.disabled,
  };
  return Object.assign(defaultPopConfirm, action.popConfirm);
};

const getColorClass = (action: ActionItem) => {
  if (action.color) {
    return `link-${action.color}`;
  }
  return '';
};
</script>

<style scoped>
.link-success:not(:disabled) {
  color: #52c41a;
  &:hover {
    color: #73d13d;
  }
}
.link-warning:not(:disabled) {
  color: #faad14;
  &:hover {
    color: #ffc53d;
  }
}
.link-error:not(:disabled) {
  color: #ff4d4f;
  &:hover {
    color: #ff7875;
  }
}
</style>
