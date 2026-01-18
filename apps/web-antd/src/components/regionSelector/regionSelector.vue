<!--
 * @Author: cwx
 * @Date: 2026-01-17 21:20:00
 * @LastEditTime: 2026-01-18 01:20:00
 * @LastEditors: cwx
 * @Description: 地区选择组件，支持名称/code 两种值类型和自定义分隔符
-->
<script setup lang="ts" name="RegionSelector">
import type { PropType } from 'vue';

import { computed } from 'vue';

import { Cascader } from 'ant-design-vue';

import { provinceData, regionData } from './data';

interface RegionOption {
  label: string;
  value: string;
  code: string;
  name: string;
  children?: RegionOption[];
}

interface RegionNode {
  code: string;
  name: string;
  children?: RegionNode[];
}

const props = defineProps({
  valueType: {
    type: String as PropType<'code' | 'name'>,
    default: 'name',
  },
  separator: {
    type: String,
    default: '-',
  },
});

const modelValue = defineModel<string>('value', {
  default: '',
});

function buildRegionNodes() {
  // 使用 Map 维护省、市节点，便于后续按 code 快速查找与挂载
  const provinceMap = new Map<string, RegionNode>();
  const cityMap = new Map<string, RegionNode>();

  // 先根据静态的 provinceData 初始化所有省份节点
  provinceData.forEach(([code, name]) => {
    const node: RegionNode = {
      code,
      name,
      children: [],
    };
    provinceMap.set(code, node);
  });

  // 遍历 regionData：
  // - code 以 "0000" 结尾：视为省级行政区，补充到省份 Map 中
  // - code 以 "00" 结尾（但不以 "0000" 结尾）：视为市级行政区，挂到对应省份下并记录到 cityMap
  Object.entries(regionData).forEach(([code, name]) => {
    if (code.endsWith('0000')) {
      // 如果 provinceData 中没有该省份，则在此处动态补充
      const exist = provinceMap.get(code);
      if (!exist) {
        const node: RegionNode = {
          code,
          name,
          children: [],
        };
        provinceMap.set(code, node);
      }
      return;
    }
    if (code.endsWith('00')) {
      // 通过前两位编码推导出所属省份编码，例如：110100 -> 110000
      const provinceCode = `${code.slice(0, 2)}0000`;
      const province = provinceMap.get(provinceCode);
      // 数据不完整时直接跳过，避免出现无父级节点
      if (!province) return;
      const node: RegionNode = {
        code,
        name,
        children: [],
      };
      // 将当前城市挂载到省份节点下，并记录到 cityMap 中，便于区县挂载
      province.children!.push(node);
      cityMap.set(code, node);
    }
  });

  // 再次遍历 regionData，处理区县级节点：
  // - 普通 code（不以 "0000"/"00" 结尾）视为区/县
  // - 优先挂到对应的 city 节点；如果找不到 city，则退而求其次挂到省级节点下
  Object.entries(regionData).forEach(([code, name]) => {
    // 省级/市级节点在前面已处理，这里直接跳过
    if (code.endsWith('0000')) return;
    if (code.endsWith('00')) return;
    // 前四位编码对应城市，例如：110101 -> 110100
    const cityCode = `${code.slice(0, 4)}00`;
    const city = cityMap.get(cityCode);
    // 前两位编码对应省份，例如：110101 -> 110000
    const provinceCode = `${code.slice(0, 2)}0000`;
    const province = provinceMap.get(provinceCode);
    // 优先挂载到城市，其次挂载到省份，保证最大程度保持层级结构完整
    const parent = city || province;
    if (!parent) return;
    const node: RegionNode = {
      code,
      name,
    };
    // 某些节点可能还没有 children 字段，这里做一次兜底初始化
    if (!parent.children) {
      parent.children = [];
    }
    parent.children.push(node);
  });

  return [...provinceMap.values()];
}

const regionNodes = buildRegionNodes();

const options = computed<RegionOption[]>(() => {
  // 根据 props.valueType 决定 value 是 code 还是 name
  const useCode = props.valueType === 'code';
  // 递归将 RegionNode 转换成 Cascader 可识别的 Option 结构
  const mapNode = (node: RegionNode): RegionOption => {
    return {
      label: node.name,
      value: useCode ? node.code : node.name,
      code: node.code,
      name: node.name,
      children: node.children
        ? node.children.map((child) => mapNode(child))
        : undefined,
    };
  };
  return regionNodes.map((node) => mapNode(node));
});

const innerValue = computed<(number | string)[]>({
  get() {
    // 外部存储为单一字符串（例如 "北京市-海淀区"），内部需要一个数组用于级联展示
    if (!modelValue.value) return [];
    return modelValue.value.split(props.separator);
  },
  set(val) {
    // 当用户清空选择时，向外部同步为空字符串
    if (!val || (Array.isArray(val) && val.length === 0)) {
      modelValue.value = '';
      return;
    }
    // 确保所有级联值最终都转成字符串，再按分隔符拼接
    const result = (val as (number | string)[]).map(String);
    modelValue.value = result.join(props.separator);
  },
});

function displayRender({ labels }: { labels: string[] }) {
  // 自定义级联展示方式，将各级名称使用同样的分隔符连接显示
  return labels.join(props.separator);
}
</script>

<template>
  <Cascader
    v-bind="$attrs"
    :options="options"
    v-model:value="innerValue"
    allow-clear
    change-on-select
    show-search
    :display-render="displayRender"
  />
</template>
