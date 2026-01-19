<!--
 * @Author: cwx
 * @Date: 2026-01-18 20:02:41
 * @LastEditTime: 2026-01-19 14:38:24
 * @LastEditors: cwx
 * @Description: 
-->
<script setup lang="ts" name="NumberRange">
import { computed, watch } from 'vue';

import { Input, InputNumber } from 'ant-design-vue';

const props = defineProps<{
  groupProps?: Record<string, any>;
  maxInputProps?: Record<string, any>;
  minInputProps?: Record<string, any>;
}>();

const emit = defineEmits<{
  (
    e: 'change',
    value: [number | undefined, number | undefined] | undefined,
  ): void;
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
    const rawMax = modelValue.value?.[1];
    const max = rawMax === null ? undefined : rawMax;
    const nextMin = val === null ? undefined : val;

    if (nextMin === undefined && max === undefined) {
      modelValue.value = undefined;
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
    const rawMin = modelValue.value?.[0];
    const min = rawMin === null ? undefined : rawMin;
    const nextMax = val === null ? undefined : val;

    if (min === undefined && nextMax === undefined) {
      modelValue.value = undefined;
      return;
    }

    modelValue.value = [min, nextMax];
  },
});

const handleBlur = (activeType: 'max' | 'min') => {
  const min = modelValue.value?.[0];
  const max = modelValue.value?.[1];

  if (min !== undefined && max !== undefined && min > max) {
    modelValue.value = activeType === 'min' ? [min, min] : [max, max];
  }
};

watch(
  () => modelValue.value,
  (val) => {
    emit('change', val);
  },
  { deep: true },
);
</script>

<template>
  <Input.Group compact v-bind="props.groupProps" class="!flex">
    <InputNumber
      v-model:value="innerMin"
      :controls="false"
      class="min-w-0 flex-1 text-center"
      placeholder="Minimum"
      v-bind="props.minInputProps"
      @blur="handleBlur('min')"
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
      @blur="handleBlur('max')"
    />
  </Input.Group>
</template>

<style scoped></style>
