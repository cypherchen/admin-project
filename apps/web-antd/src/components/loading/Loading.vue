<!--
 * @Author: cwx
 * @Date: 2026-01-23 11:16:08
 * @LastEditTime: 2026-01-23 15:21:48
 * @LastEditors: cwx
 * @Description: Loading 组件。支持全局/元素挂载、自定义内容和延迟显示。
-->
<script lang="ts" setup>
import type { LoadingProps } from './typing';

import { computed, onUnmounted, ref, watch } from 'vue';

import { Spin } from 'ant-design-vue';

const props = withDefaults(defineProps<LoadingProps>(), {
  tip: '',
  size: 'large',
  absolute: false,
  loading: false,
  delay: 0,
});

const visible = ref(false);
let showTimer: null | ReturnType<typeof setTimeout> = null;
let hideTimer: null | ReturnType<typeof setTimeout> = null;

const getVisible = computed(() => visible.value);

const clearTimers = () => {
  if (showTimer) {
    clearTimeout(showTimer);
    showTimer = null;
  }
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
};

watch(
  () => props.loading,
  async (loading) => {
    clearTimers();

    if (loading) {
      // 如果配置了 beforeLoading 回调，则在显示 loading 前执行
      if (props.beforeLoading) {
        const isFunction = (val: unknown): val is Function =>
          typeof val === 'function';
        if (isFunction(props.beforeLoading)) {
          const res = await props.beforeLoading();
          if (!res || !props.loading) return;
        }
      }

      // 处理显示延迟
      const delay =
        typeof props.delay === 'number' ? props.delay : props.delay?.show || 0;
      if (delay > 0) {
        showTimer = setTimeout(() => {
          visible.value = true;
        }, delay);
      } else {
        visible.value = true;
      }
    } else {
      // 处理隐藏延迟
      const delay =
        typeof props.delay === 'number' ? 0 : props.delay?.hide || 0;

      if (delay > 0) {
        hideTimer = setTimeout(() => {
          visible.value = false;
          props.afterLoading?.();
        }, delay);
      } else {
        visible.value = false;
        props.afterLoading?.();
      }
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  clearTimers();
});
</script>

<template>
  <section
    v-show="getVisible"
    class="left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-[rgba(240,242,245,0.4)] backdrop-blur-[4px] dark:!bg-[rgba(0,0,0,0.4)]"
    :class="[absolute ? 'absolute z-[300]' : 'fixed z-[200]']"
  >
    <Spin
      v-bind="$attrs"
      :tip="typeof tip === 'string' ? tip : undefined"
      :size="size"
      :spinning="getVisible"
    >
      <template v-if="icon || $slots.icon" #indicator>
        <slot name="icon">
          <component v-if="typeof icon !== 'string'" :is="icon" />
          <span v-else>{{ icon }}</span>
        </slot>
      </template>
    </Spin>
    <div v-if="tip && typeof tip !== 'string'" class="ant-spin-text">
      <component :is="tip" />
    </div>
  </section>
</template>
