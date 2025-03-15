<!--
 * @Author: cwx
 * @Date: 2025-03-14 16:21:55
 * @LastEditTime: 2025-03-14 17:27:53
 * @LastEditors: cwx
 * @Description: 按钮权限组件
-->
<template>
  <slot v-if="hasAuth"></slot>
</template>
<script setup lang="ts" name="Authority">
import { computed } from 'vue';
import { hasPermission } from './usePermission';

const props = defineProps({
  value: {
    type: String,
    default: undefined,
  },
});

const hasAuth = computed(() => {
  return hasPermission(props.value, 'auth');
});
</script>

<style scoped></style>
