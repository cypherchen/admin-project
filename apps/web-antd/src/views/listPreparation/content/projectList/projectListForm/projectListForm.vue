<!--
 * @Author: cwx
 * @Date: 2026-01-19 17:19:26
 * @LastEditTime: 2026-01-20 11:48:54
 * @LastEditors: cwx
 * @Description: 项目列表新增表单
-->
<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { postListPreparationList } from '#/api/listPreparationApi/listPreparationListApi';

import { formSchema } from './data';

const emit = defineEmits(['reload']);
const route = useRoute();
const vId = route.params.vId as string;

const [Form, formApi] = useVbenForm({
  schema: formSchema,
  showDefaultActions: false,
});

const currentNode = ref<Record<string, any>>({});
const currentRecord = ref<Record<string, any>>({});
const title = ref<string>('新增');

const [Modal, modalApi] = useVbenModal({
  onConfirm: handleSubmit,
  onOpened: () => {
    const data = modalApi.getData<Record<string, any>>();
    currentNode.value = data.currentNode || {};
    currentRecord.value = data.currentRecord || {};
    title.value =
      data.formTitle === '新增'
        ? '新增'
        : `${data.currentRecord.Name} - ${data.formTitle}`;
    modalApi.setState({
      title: title.value,
    });
    formApi.resetForm();
  },
});

async function handleSubmit() {
  const { valid } = await formApi.validate();
  if (!valid) return;

  const values = await formApi.getValues();
  const data = {
    ...values,
    Parent_ID: title.value === '新增' ? undefined : currentRecord.value.ID,
  };

  try {
    modalApi.setState({ loading: true, confirmLoading: true });
    await postListPreparationList(vId, currentNode.value.ID, data);
    message.success('新增成功');
    modalApi.close();
    emit('reload');
  } finally {
    modalApi.setState({ loading: false, confirmLoading: false });
  }
}
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>
