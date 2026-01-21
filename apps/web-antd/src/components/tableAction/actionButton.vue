<!--
 * @Author: cwx
 * @Date: 2025-03-20 11:05:24
 * @LastEditTime: 2025-03-26 09:19:26
 * @LastEditors: cwx
 * @Description: 操作列按钮
-->
<script setup lang="tsx" name="ActionButton">
import type { PropType } from 'vue';

import type { ActionItem } from './types';

import { toRefs } from 'vue';

import { isObject, isString } from '@vben/utils';

import * as Icons from '@ant-design/icons-vue';
import { Button, Popconfirm, Tooltip } from 'ant-design-vue';

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

const getIcon = (icon: string) => {
  return (Icons as Record<string, any>)[icon];
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
  return 'link-default';
};
</script>

<template>
  <Tooltip v-bind="getTooltip(action)">
    <template v-if="action.model === 'button'">
      <Button
        v-if="action.label"
        v-bind="action"
        type="link"
        size="small"
        class="!text-[13px]"
        :class="getColorClass(action)"
      >
        {{ action.label }}
      </Button>
      <component
        v-if="action.icon"
        :is="getIcon(action.icon)"
        :disabled="action.disabled"
        @click="() => !action.disabled && action.onClick?.()"
        class="px-2 !text-[13px]"
        :class="getColorClass(action)"
      />
    </template>
    <Popconfirm v-else v-bind="getPopConfirm(action)">
      <Button
        v-if="action.label"
        v-bind="action"
        type="link"
        size="small"
        class="!text-[13px]"
        :class="getColorClass(action)"
      >
        {{ action.label }}
      </Button>
      <component
        v-if="action.icon"
        :is="getIcon(action.icon)"
        :disabled="action.disabled"
        class="px-2 !text-[13px]"
        :class="getColorClass(action)"
      />
    </Popconfirm>
  </Tooltip>
</template>

<style scoped>
.link-default:not(:disabled) {
  color: #1677ff;

  &:hover {
    color: #69b1ff;
  }
}

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

[disabled='true'] {
  color: rgb(0 0 0 / 25%) !important;
  cursor: not-allowed;
}
</style>
