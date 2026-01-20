<!--
 * @Author: cwx
 * @Date: 2026-01-20 11:08:58
 * @LastEditTime: 2026-01-20 11:16:21
 * @LastEditors: cwx
 * @Description: 单位选择器
-->
<script setup lang="ts" name="UnitSelector">
import { computed } from 'vue';

import { AutoComplete } from 'ant-design-vue';

import { unitData } from './data';

defineProps({
  placeholder: {
    type: String,
    default: '请选择或输入单位',
  },
  allowClear: {
    type: Boolean,
    default: true,
  },
});

const modelValue = defineModel<string>('value', {
  default: '',
});

const options = computed(() => {
  return unitData.map((item) => ({ value: item }));
});

const filterOption = (input: string, option: any) => {
  return option.value.includes(input);
};
</script>

<template>
  <AutoComplete
    v-bind="$attrs"
    v-model:value="modelValue"
    :options="options"
    :filter-option="filterOption"
    :allow-clear="allowClear"
    :placeholder="placeholder"
    class="w-full"
  />
</template>
