<!--
 * @Author: cwx
 * @Date: 2025-03-18 22:09:53
 * @LastEditTime: 2025-03-18 22:53:48
 * @LastEditors: cwx
 * @Description: 审核状态
-->
<template>
  <div class="cursor-pointer" @click="handleClick">
    <component
      :is="iconMap[status].icon"
      :style="{ color: iconMap[status].color }"
    />
    {{ AuditStatusEnum[status] }}
  </div>
</template>

<script setup lang="ts" name="AuditStatus">
import { toRefs, type Component, type PropType } from 'vue';
import {
  InfoCircleFilled,
  ClockCircleFilled,
  CheckCircleFilled,
  CloseCircleFilled,
  StopFilled,
} from '@ant-design/icons-vue/lib/icons';

import { AuditStatusEnum } from '#/enums/auditStatusEnum';

const iconMap: Record<AuditStatusEnum, { icon: Component; color: string }> = {
  [AuditStatusEnum.未提交]: {
    icon: InfoCircleFilled,
    color: '#909399',
  },
  [AuditStatusEnum.审批中]: {
    icon: ClockCircleFilled,
    color: '#409eff',
  },
  [AuditStatusEnum.已审批]: {
    icon: CheckCircleFilled,
    color: '#67c23a',
  },
  [AuditStatusEnum.已驳回]: {
    icon: CloseCircleFilled,
    color: '#f56c6c',
  },
  [AuditStatusEnum.撤销]: {
    icon: StopFilled,
    color: '#909399',
  },
};

const props = defineProps({
  status: {
    type: Number as PropType<AuditStatusEnum>,
    default: 0,
  },
  record: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  clickable: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
});
const { status, record, clickable } = toRefs(props);

const handleClick = () => {
  if (!clickable.value) return;
  console.log('record', record.value);
};
</script>

<style scoped></style>
