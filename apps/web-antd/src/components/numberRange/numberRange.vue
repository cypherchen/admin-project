<!--
 * @Author: cwx
 * @Date: 2026-01-18 20:02:41
 * @LastEditTime: 2026-01-19 10:35:41
 * @LastEditors: cwx
 * @Description: 
-->
<script setup lang="ts" name="NumberRange">
import { computed } from 'vue';

import { Input, InputNumber } from 'ant-design-vue';

const props = defineProps<{
  groupProps?: Record<string, any>;
  minInputProps?: Record<string, any>;
  maxInputProps?: Record<string, any>;
}>();

const modelValue = defineModel<
  [number | undefined, number | undefined] | undefined
>('value', {
  default: undefined,
});

const innerMin = computed<number | undefined>({
  get() {
    return modelValue.value?.[0];
  },
  set(val) {
    const max = modelValue.value?.[1];
    const nextMin = val;

    if (nextMin === undefined && max === undefined) {
      modelValue.value = undefined;
      return;
    }

    if (nextMin !== undefined && max !== undefined && nextMin > max) {
      modelValue.value = [max, max];
      return;
    }

    modelValue.value = [nextMin, max];
  },
});

const innerMax = computed<number | undefined>({
  get() {
    return modelValue.value?.[1];
  },
  set(val) {
    const min = modelValue.value?.[0];
    const nextMax = val;

    if (min === undefined && nextMax === undefined) {
      modelValue.value = undefined;
      return;
    }

    if (min !== undefined && nextMax !== undefined && nextMax < min) {
      modelValue.value = [min, min];
      return;
    }

    modelValue.value = [min, nextMax];
  },
});
</script>

<template>
  <Input.Group compact v-bind="props.groupProps" class="!flex">
    <InputNumber
      v-model:value="innerMin"
      :controls="false"
      class="min-w-0 flex-1 text-center"
      placeholder="Minimum"
      v-bind="props.minInputProps"
    />
    <Input
      :readonly="true"
      class="pointer-events-none !w-8 select-none border-x-0 text-center"
      value="~"
    />
    <InputNumber
      v-model:value="innerMax"
      :controls="false"
      class="min-w-0 flex-1 border-l-0 text-center"
      placeholder="Maximum"
      v-bind="props.maxInputProps"
    />
  </Input.Group>
</template>

<style scoped></style>
