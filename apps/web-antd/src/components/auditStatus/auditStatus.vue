<!--
 * @Author: cwx
 * @Date: 2025-03-18 22:09:53
 * @LastEditTime: 2026-03-07 22:06:57
 * @LastEditors: cwx
 * @Description: 审核状态
-->
<script setup lang="ts" name="AuditStatus">
import type { Component, PropType } from 'vue';

import { toRefs } from 'vue';

import {
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  InfoCircleFilled,
  StopFilled,
} from '@ant-design/icons-vue/lib/icons';
import { message } from 'ant-design-vue';

import { createViewAuditModal } from '#/components/auditModal';
import { AuditStatusEnum } from '#/enums/auditStatusEnum';

const props = defineProps({
  status: {
    type: Number as PropType<AuditStatusEnum>,
    default: 0,
  },
  instanceId: {
    type: String as PropType<string>,
    default: '',
  },
  clickable: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
});

const emit = defineEmits(['close']);

const iconMap: Record<AuditStatusEnum, { color: string; icon: Component }> = {
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
  [AuditStatusEnum.已退回]: {
    icon: CloseCircleFilled,
    color: '#f56c6c',
  },
};

const { status, instanceId, clickable } = toRefs(props);

function handleClick() {
  if (!clickable.value) return;
  if (status.value === AuditStatusEnum.未提交) {
    message.error('该数据未提交审批');
    return;
  }
  createViewAuditModal({
    instanceId: instanceId.value,
    close: () => emit('close'),
  });
}
</script>

<template>
  <div class="cursor-pointer" @click="handleClick">
    <component
      :is="iconMap[status].icon"
      :style="{ color: iconMap[status].color }"
    />
    {{ AuditStatusEnum[status] }}
  </div>
</template>

<style scoped></style>
