<!--
 * @Author: cwx
 * @Date: 2025-01-24 20:56:52
 * @LastEditTime: 2025-03-21 23:21:08
 * @LastEditors: cwx
 * @Description: 清单编制-新增表单
-->
<template>
  <VbenModal
    title="新增"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :fullscreen-button="false"
    footer-class="border-none"
    header-class="border-none"
  >
    <VbenForm> </VbenForm>
  </VbenModal>
</template>

<script setup lang="tsx" name="FormModal">
import { ref } from 'vue';
import { useVbenModal, useVbenForm } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { formSchema } from './data';

import { postListPreparation } from '#/api/listPreparationApi/listPreparationApi';

const emit = defineEmits(['submit']);

const userStore = useUserStore();

async function hanledConfirm() {
  const { valid } = await formApi.validate();
  const values = await formApi.getValues();

  if (!valid) return;

  const data: Record<string, any> = {
    ...values,
    PlanTime: values.DateRange?.[0],
    PlanEndTime: values.DateRange?.[1],
  };

  await postListPreparation(
    userStore.userInfo!.Orz_ID,
    currentNode.value.ID,
    data,
  );

  emit('submit');
  modalApi.close();
}

const currentNode = ref<Record<string, any>>({});
const [VbenModal, modalApi] = useVbenModal({
  onConfirm: hanledConfirm,
  onOpenChange: (isOpen: boolean) => {
    if (isOpen) {
      const data = modalApi.getData<Record<string, any>>();
      currentNode.value = data.currentNode;
      formApi.resetForm();
    }
  },
});

const [VbenForm, formApi] = useVbenForm({
  schema: formSchema,
  showDefaultActions: false,
});
</script>

<style scoped></style>
