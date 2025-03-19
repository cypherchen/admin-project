<!--
 * @Author: cwx
 * @Date: 2025-03-18 09:19:29
 * @LastEditTime: 2025-03-18 21:09:09
 * @LastEditors: cwx
 * @Description: 导入文件
-->
<template>
  <BasicUpload
    ref="uploadRef"
    v-bind="$attrs"
    :openFileDialogOnClick="false"
    :showUploadList="false"
    @change="handleChange"
    class="!w-auto"
  >
    <a-button
      v-if="!$slots.default"
      :disabled="$attrs.disabled"
      @click="uploadFile"
    >
      {{ label }}
    </a-button>
    <slot v-else :disabled="$attrs.disabled" :uploadFile="uploadFile"></slot>
  </BasicUpload>
</template>

<script setup lang="tsx" name="ImportFile">
import { toRefs, ref, type PropType, type VNode } from 'vue';
import { Modal, type UploadFile, message } from 'ant-design-vue';

import { BasicUpload } from './index';

const emit = defineEmits(['success']);

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
});
const { label, title, tips } = toRefs(props);

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

<style scoped></style>
