<!--
 * @Author: cwx
 * @Date: 2025-01-24 20:56:52
 * @LastEditTime: 2025-03-25 16:38:30
 * @LastEditors: cwx
 * @Description: 清单编制-新增表单
-->
<script setup lang="tsx" name="FormModal">
import { ref } from 'vue';

import { useVbenForm, useVbenModal } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { postListPreparation } from '#/api/listPreparationApi/listPreparationApi';
import { getUser } from '#/api/userApi/userApi';

import { formSchema } from './data';

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
    ResponsibleUserName: userOptions.value.find(
      (n) => n.ID === values.ResponsibleUserID,
    )?.Name,
    ReportedUserName: userOptions.value.find(
      (n) => n.ID === values.ReportedUserID,
    )?.Name,
    APProjectBaseTree_ID: currentNode.value.ID,
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
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const data = modalApi.getData<Record<string, any>>();
      currentNode.value = data.currentNode;
      formApi.resetForm();
      await getUserList();
      formApi.updateSchema([
        {
          fieldName: 'ResponsibleUserID',
          componentProps: { options: userOptions.value },
        },
        {
          fieldName: 'ReportedUserID',
          componentProps: { options: userOptions.value },
        },
      ]);
    }
  },
});

const [VbenForm, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  schema: formSchema,
  showDefaultActions: false,
});

const userOptions = ref<Record<string, any>[]>([]);
async function getUserList() {
  const params = {
    orzId: userStore.userInfo!.Orz_ID,
  };
  const { List } = await getUser({ params });
  userOptions.value = List.map((n: Record<string, any>) => ({
    ID: n.ID,
    Name: n.Name,
  }));
}
</script>

<template>
  <VbenModal
    title="新增"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :fullscreen-button="false"
    footer-class="border-none"
    header-class="border-none"
  >
    <VbenForm />
  </VbenModal>
</template>

<style scoped></style>
