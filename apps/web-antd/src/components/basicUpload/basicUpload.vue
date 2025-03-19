<!--
 * @Author: cwx
 * @Date: 2025-03-15 15:59:10
 * @LastEditTime: 2025-03-18 21:12:43
 * @LastEditors: cwx
 * @Description: 上传组件
-->
<template>
  <Upload
    v-bind="$attrs"
    v-model:file-list="uploadFileList"
    :headers="headers"
    :accept="computedAccept"
    :action="computedAction"
    :beforeUpload="beforeValidator"
    :progress="progress"
    :showUploadList="showUploadList"
    @change="handleChange"
    class="w-full"
  >
    <template v-if="!$slots.default">
      <a-button
        v-if="attrs.listType !== 'picture-card'"
        :disabled="$attrs.disabled"
      >
        上传文件
      </a-button>
      <PlusOutlined
        v-if="attrs.listType === 'picture-card'"
        :disabled="$attrs.disabled"
      />
    </template>
    <slot v-else name="default" :disable="$attrs.disabled"></slot>
  </Upload>
</template>

<script setup lang="tsx" name="BasicUpload">
import { ref, computed, toRefs, type PropType, useAttrs, watch } from 'vue';
import {
  Upload,
  type UploadProps,
  type UploadFile,
  message,
} from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';

import { useAccessStore } from '@vben/stores';
import { useAppConfig } from '@vben/hooks';

import { isFunction, difference } from 'lodash';

import { getFileMd5, formatFile } from './upload';

interface FileType<T = Record<string, any>> extends UploadFile<T> {
  md5?: string;
}

const props = defineProps({
  fileList: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
  accept: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  action: {
    type: String,
    default: '',
  },
  beforeupload: {
    type: Function as PropType<UploadProps['beforeUpload']>,
    default: null,
  },
  showUploadList: {
    type: Object as PropType<UploadProps['showUploadList']>,
    default: () => ({
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: true,
    }),
  },
  maxSize: {
    type: Number,
    default: 2048,
  },
});
const { fileList, accept, action, beforeupload, showUploadList, maxSize } =
  toRefs(props);

const attrs = useAttrs() as UploadProps;

const emit = defineEmits(['change', 'update:fileList']);

const uploadFileList = ref<FileType<Record<string, any>>[]>([]);
watch(
  () => fileList.value,
  (val) => {
    const fileMD5s = val.map((f) => f.MD5Code);
    const uploadFileMD5s = uploadFileList.value
      .filter((f) => f.status === 'done')
      .map((f) => f.md5);
    // 如果uploadFileList中的md5和fileList中的md5不一致, 则更新数据
    if (
      difference(fileMD5s, uploadFileMD5s).length ||
      difference(uploadFileMD5s, fileMD5s).length
    ) {
      uploadFileList.value = val.map(formatFile) as FileType[];
    }
  },
  {
    immediate: true,
  },
);

const computedAccept = computed(() => {
  return accept.value.join(',');
});

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);
const computedAction = computed(() => {
  return apiURL + action.value;
});

const accessStore = useAccessStore();
const headers = {
  Authorization: `Bearer ${accessStore.accessToken}`,
};

const beforeValidator: UploadProps['beforeUpload'] = async (
  file,
  _fileList,
) => {
  const validator: UploadProps['beforeUpload'] = async (file, _fileList) => {
    if (
      attrs.maxCount &&
      uploadFileList.value &&
      uploadFileList.value.length >= attrs.maxCount
    ) {
      message.error(`最多上传 ${attrs.maxCount} 个文件`);
      return false;
    }

    if (file.size > maxSize.value * 1024 * 1024) {
      message.error(`文件大小不能超过 ${maxSize.value}MB`);
      return Upload.LIST_IGNORE;
    }

    Object.assign(file, { status: 'uploading' });
    const md5 = await getFileMd5(file);
    if (uploadFileList.value?.some((f: Record<string, any>) => f.md5 === md5)) {
      return Upload.LIST_IGNORE;
    }

    const suffix = file?.name?.match(/\.[^.]+$/)?.[0];
    if (suffix && accept.value && !accept.value.includes(suffix)) {
      Object.assign(file, {
        status: 'error',
        response: `只能上传 ${accept.value.join(', ')} 格式的文件`,
      });
      message.error(`只能上传 ${accept.value.join(', ')} 格式的文件`);
      return false;
    }

    Object.assign(file, { status: 'done', md5 });

    return true;
  };

  return isFunction(beforeupload.value)
    ? await beforeupload.value!(file, _fileList)
    : await validator(file, _fileList);
};

const progress: UploadProps['progress'] = {
  strokeColor: {
    '0%': '#108ee9',
    '100%': '#87d068',
  },
  strokeWidth: 3,
  format: (percent) => `${parseFloat(percent!.toFixed(2))}%`,
  class: 'upload-progress',
};

const handleChange: UploadProps['onChange'] = async ({ file }) => {
  // 状态机判断
  switch (file.status) {
    case 'uploading':
      // if (file.percent === 0) {
      //   console.log('开始上传', file.name);
      // } else {
      //   console.log('上传进度:', file.percent + '%');
      // }
      break;
    case 'done':
      const doneList = uploadFileList.value
        .filter((f: FileType) => f.status === 'done' && f.response?.Value)
        .map((f: FileType) => f.response?.Value);
      emit('update:fileList', doneList);
      emit('change', file);
      break;
    case 'error':
      break;
    case 'removed':
      const removedList = fileList.value.filter((f) => f.MD5Code !== file.md5);
      emit('update:fileList', removedList);
      emit('change', removedList);
      break;
    default:
      console.warn('未知状态:', file.status);
  }
};
</script>

<style scoped lang="less">
:deep(.upload-progress) {
  .ant-progress-outer {
    margin-inline-end: calc(-3em - 8px) !important;
    padding-inline-end: calc(3em + 8px) !important;
  }
  .ant-progress-text {
    width: 3em !important;
  }
}
</style>
