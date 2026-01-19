<!--
 * @Author: cwx
 * @Date: 2026-01-18 19:16:29
 * @LastEditTime: 2026-01-19 16:01:13
 * @LastEditors: cwx
 * @Description: 
-->
<script setup lang="ts" name="ProjectQueryModal">
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { postListPreparationQuery } from '#/api/listPreparationApi/listPreparationQueryApi';
import { ProjectQuery } from '#/components/_project/projectQuery';

const emit = defineEmits(['submit']);

const currentNode = ref<null | Record<string, any>>(null);
const vId = ref<string>('');

const projectQueryRef = ref<InstanceType<typeof ProjectQuery> | null>(null);

async function handleConfirm() {
  if (!currentNode.value?.ID) {
    message.error('请先选择左侧目录节点');
    return;
  }
  if (!vId.value) {
    message.error('未获取到版本信息');
    return;
  }
  const checked = projectQueryRef.value?.getChecked?.() ?? [];
  if (checked.length === 0) {
    message.error('未勾选项目');
    return;
  }
  if (checked.length > 1) {
    message.error('一次只能选择一个项目');
    return;
  }
  const ids = checked.map((item: Record<string, any>) => item.ID);
  await postListPreparationQuery(currentNode.value.ID, vId.value, ids);
  message.success('项目添加成功');
  emit('submit');
  modalApi.close();
}

const [VbenModal, modalApi] = useVbenModal({
  title: '项目查询',
  onConfirm: handleConfirm,
  onOpenChange: (isOpen: boolean) => {
    if (isOpen) {
      const data = modalApi.getData<Record<string, any>>();
      currentNode.value = data.currentNode || null;
      vId.value = data.vId || '';
      projectQueryRef.value?.reload?.();
    }
  },
});
</script>

<template>
  <VbenModal
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    fullscreen
    :fullscreen-button="false"
    footer-class="border-none"
    header-class="border-none"
    class="h-[600px] w-[90vw]"
  >
    <ProjectQuery
      ref="projectQueryRef"
      :show-mode-switcher="false"
      :filter-config="{
        level: {
          disabled: true,
          value: currentNode?.Hierarchy || null,
        },
      }"
      default-mode="table"
    />
  </VbenModal>
</template>

<style scoped></style>
