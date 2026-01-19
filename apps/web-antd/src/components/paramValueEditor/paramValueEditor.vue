<!--
 * @Author: cwx
 * @Date: 2026-01-18 00:30:00
 * @LastEditTime: 2026-01-19 10:40:29
 * @LastEditors: cwx
 * @Description: 参数值编辑器，根据 InputType 自动渲染不同的输入控件
-->
<script setup lang="ts" name="ParamValueEditor">
import { computed, watch } from 'vue';

import { DatePicker, Input, InputNumber, Select } from 'ant-design-vue';

import { RegionSelector } from '#/components/regionSelector';
import { ParamsTypeEnum } from '#/enums/paramsTypeEnum';

type OptionItem = {
  label: string;
  value: string;
};

type RawOptions = null | OptionItem[] | string | string[] | undefined;

const props = withDefaults(
  defineProps<{
    inputType: number;
    multiSeparator?: string;
    options?: RawOptions;
  }>(),
  {
    options: undefined,
    multiSeparator: '/',
  },
);

const emit = defineEmits<{
  (e: 'change', value: null | string): void;
}>();

const modelValue = defineModel<null | string>('value', {
  default: null,
});

function normalizeOptions(source: RawOptions): OptionItem[] {
  // source 为空或未配置时直接返回空数组，避免后续分支做无效处理
  if (!source) return [];

  // 如果已经是数组类型，进一步区分：
  // - 字符串数组：每个元素同时作为 label 和 value
  // - 对象数组：按 OptionItem 结构直接透传
  if (Array.isArray(source)) {
    // 空数组直接返回，避免访问 source[0] 时报错
    if (source.length === 0) return [];
    const first = source[0];
    // 统一处理字符串数组
    if (typeof first === 'string') {
      return (source as string[]).map((item: string) => ({
        label: item,
        value: item,
      }));
    }
    // 处理对象数组时，显式拷贝 label、value，避免引用外部对象
    return (source as OptionItem[]).map((item: OptionItem) => ({
      label: item.label,
      value: item.value,
    }));
  }

  // 走到这里说明 source 不是数组，将其转成字符串再做统一解析
  const text = String(source).trim();
  if (!text) return [];

  // 优先尝试把字符串当作 JSON 解析：
  // - ["A","B"] 或 ["A","B","C"]
  // - [{ "label": "中文", "value": "code" }]
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      // JSON 数组为空时直接返回
      if (parsed.length === 0) return [];
      const first = parsed[0];
      // 解析成字符串数组
      if (typeof first === 'string') {
        return parsed.map((item: string) => ({
          label: item,
          value: item,
        }));
      }
      // 解析成对象数组，且对象中同时包含 label / value 字段
      if (
        first &&
        typeof first === 'object' &&
        'label' in first &&
        'value' in first
      ) {
        return parsed as OptionItem[];
      }
    }
  } catch {}

  const parts: string[] = text
    .split('/')
    .map((item: string) => item.trim())
    .filter(Boolean);

  // 支持两种格式：
  // - "北京"：label/value 都是 "北京"
  // - "110000|北京市"：value 为 "110000"，label 为 "北京市"
  return parts.map((item: string) => {
    const hasSeparator = item.includes('|');
    if (!hasSeparator) {
      return {
        label: item,
        value: item,
      };
    }
    const [value, label] = item.split('|', 2);
    const valueText = value ?? '';
    const labelText = label ?? valueText;
    return {
      label: labelText,
      value: valueText,
    };
  });
}

const selectOptions = computed<OptionItem[]>(() =>
  normalizeOptions(props.options),
);

// 文本值包装：对外仍然是 string|null，这里保证 Input 始终拿到 string
const textValue = computed<string>({
  get() {
    // 当外部值为 null 时，Input 依然使用空串渲染，避免受控组件警告
    return modelValue.value ?? '';
  },
  set(val) {
    // 统一约定：空串在对外时转换为 null，表示“无值”
    modelValue.value = val || null;
  },
});

// 数字值包装：与 InputNumber 的 value 类型对齐，对外仍然通过 modelValue 维护字符串
const numberValue = computed<number | undefined>({
  get() {
    // 未设置值或为 null 时，返回 undefined 以让 InputNumber 认为是“无值”状态
    if (modelValue.value === null || modelValue.value === undefined) {
      return undefined;
    }
    // 空字符串同样视为无值，避免 Number('') 转成 0
    if (modelValue.value === '') {
      return undefined;
    }
    // 将字符串安全地转换为数字，如果转换失败则返回 undefined
    const num = Number(modelValue.value);
    return Number.isNaN(num) ? undefined : num;
  },
  set(val) {
    // 当用户清空或输入非法数字时，统一重置为 null
    if (val === undefined || Number.isNaN(val)) {
      modelValue.value = null;
      return;
    }
    // 其余情况将数字转成字符串向外部同步
    modelValue.value = String(val);
  },
});

// 单选下拉包装：Select 支持 undefined/null，统一映射成内部的字符串/null
const singleSelectValue = computed<string | undefined>({
  get() {
    // 外部的 null 映射成 undefined，便于 Select 识别“未选择”状态
    return modelValue.value ?? undefined;
  },
  set(val) {
    // Select 传入 undefined/null 时，都视为“无值”，统一转为 null
    modelValue.value = val ?? null;
  },
});

// 日期包装：配合 value-format，用字符串和外部值交互
const dateValue = computed<string | undefined>({
  get() {
    // 始终返回字符串或 undefined，便于与 value-format 协同工作
    return modelValue.value ?? undefined;
  },
  set(val) {
    // 清空时设置为 null，其余情况传递原始字符串
    modelValue.value = val ?? null;
  },
});

// 地区选择包装：RegionSelector 使用字符串值，外部仍然是字符串/null
const regionValue = computed<string>({
  get() {
    // 对外为 null 的场景，在内部使用空串展示
    return modelValue.value ?? '';
  },
  set(val) {
    // 清空时统一转为 null 表示“没有选择地区”
    modelValue.value = val || null;
  },
});

// 多选下拉包装：组件内部使用数组，外部在字符串和数组之间转换
const multiValue = computed<string[]>({
  get() {
    // 外部没有值时，内部使用空数组表示“未选择任何项”
    if (!modelValue.value) {
      return [];
    }
    // 将以分隔符连接的字符串拆成数组，并去掉首尾空格及空项
    return modelValue.value
      .split(props.multiSeparator)
      .map((item: string) => item.trim())
      .filter(Boolean);
  },
  set(vals) {
    // 当用户清空选择时，将外部值重置为 null
    if (!vals || vals.length === 0) {
      modelValue.value = null;
      return;
    }
    // 将数组中的每一项去空格、过滤空字符串后，再按分隔符拼接成字符串
    modelValue.value = vals
      .map((item: string) => item.trim())
      .filter(Boolean)
      .join(props.multiSeparator);
  },
});

watch(
  () => modelValue.value,
  (val) => {
    emit('change', val);
  },
);
</script>

<template>
  <Input
    v-if="inputType === ParamsTypeEnum.文本型"
    v-model:value="textValue"
    placeholder="请输入"
  />
  <InputNumber
    v-else-if="inputType === ParamsTypeEnum.数字型"
    v-model:value="numberValue"
  />
  <Select
    v-else-if="
      inputType === ParamsTypeEnum.单选下拉框 ||
      inputType === ParamsTypeEnum.业态类型 ||
      inputType === ParamsTypeEnum.企业业态类型
    "
    v-model:value="singleSelectValue"
    :options="selectOptions"
    allow-clear
    placeholder="请选择"
  />
  <DatePicker
    v-else-if="inputType === ParamsTypeEnum.日期型"
    v-model:value="dateValue"
    value-format="YYYY-MM-DD"
  />
  <RegionSelector
    v-else-if="inputType === ParamsTypeEnum.地区选择"
    v-model:value="regionValue"
  />
  <Select
    v-else-if="inputType === ParamsTypeEnum.多选下拉框"
    v-model:value="multiValue"
    :options="selectOptions"
    mode="multiple"
    allow-clear
    placeholder="请选择"
  />
  <Input v-else v-model:value="textValue" placeholder="请输入" />
</template>
