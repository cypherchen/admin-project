<!--
 * @Author: cwx
 * @Date: 2025-01-24 20:56:52
 * @LastEditTime: 2025-03-17 23:18:39
 * @LastEditors: cwx
 * @Description: 
-->
<template>
  <Modal
    title="新增"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :fullscreen-button="false"
  >
    <Form> </Form>
  </Modal>
</template>

<script setup lang="tsx" name="FormModal">
import { useVbenModal, useVbenForm } from '@vben/common-ui';

import { formSchema } from './data';

const hanledConfirm = async () => {
  const { valid, values } = await formApi.validate();
  console.log('getValues', values);
};

const [Modal] = useVbenModal({
  onConfirm: hanledConfirm,
});

const [Form, formApi] = useVbenForm({
  schema: formSchema,
  showDefaultActions: false,
});

formApi.setValues({
  Files: [
    {
      FileID: '45fd35e7-7586-46ce-94fc-4b80bc28bd09',
      FileName: '3',
      MD5Code: '1c310b90875ed9679c01acc5f82dff42',
      FileUrl: '/src/文件管理/1c310b90875ed9679c01acc5f82dff42.png',
      Suffix: '.png',
      ContentType: 'image/png',
      Length: 143128,
    },
  ],
});
</script>

<style scoped></style>
