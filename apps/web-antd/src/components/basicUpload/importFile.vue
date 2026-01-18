<!--
 * @Author: cwx
 * @Date: 2025-03-18 09:19:29
 * @LastEditTime: 2026-01-17 15:22:36
 * @LastEditors: cwx
 * @Description: 导入文件
-->
<script setup lang="tsx" name="ImportFile">
import type { ButtonProps, UploadFile } from 'ant-design-vue';

import type { PropType, VNode } from 'vue';

import { ref, toRefs } from 'vue';

import { message, Modal } from 'ant-design-vue';

import { BasicUpload } from './index';

const props = defineProps({
  label: {
    type: String,
    default: '导入',
  },
  title: {
    type: String,
    default: '注意事项',
  },
  // 提示, 字符串或者jsx
  tips: {
    type: [String, Object] as PropType<string | VNode>,
    default: '',
  },
  btnProps: {
    type: Object as PropType<ButtonProps>,
    default: () => ({}),
  },
});

const emit = defineEmits(['success']);

const { label, title, tips, btnProps } = toRefs(props);

const uploadRef = ref();

const uploadFile = () => {
  if (tips.value) {
    Modal.confirm({
      title: title.value,
      content: tips.value,
      onOk: () => {
        uploadRef.value.$el.querySelector('input[type=file]').click();
      },
    });
  } else {
    uploadRef.value.$el.querySelector('input[type=file]').click();
  }
};

const handleChange = (file: UploadFile) => {
  const status = file.response.Status;
  const value = file.response.Value;
  if (status === 200) {
    emit('success', value);
  } else {
    message.error(file.response.Message);
  }
};
</script>

<template>
  <BasicUpload
    ref="uploadRef"
    v-bind="$attrs"
    :open-file-dialog-on-click="false"
    :show-upload-list="false"
    @change="handleChange"
    class="!w-auto"
  >
    <a-button
      v-if="!$slots.default"
      v-bind="btnProps"
      :disabled="$attrs.disabled"
      @click="uploadFile"
    >
      {{ label }}
    </a-button>
    <slot v-else :disabled="$attrs.disabled" :upload-file="uploadFile"></slot>
  </BasicUpload>
</template>

<style scoped></style>
