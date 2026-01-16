<!--
 * @Author: cwx
 * @Date: 2025-01-24 20:56:52
 * @LastEditTime: 2026-01-16 16:19:56
 * @LastEditors: cwx
 * @Description: 目录树表单
-->
<script setup lang="ts" name="TreeForm">
import type { VbenFormSchema } from '@vben/common-ui';

import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useVbenForm, useVbenModal } from '@vben/common-ui';

import {
  postListPreparationCatalog,
  putListPreparationCatalog,
} from '#/api/listPreparationApi/listPreparationContentApi';

const props = defineProps<{
  treeList: Record<string, any>[];
}>();

const emit = defineEmits(['submit']);

const { currentRoute } = useRouter();

const isUpdate = ref(false);
const currentNode = ref<Record<string, any>>({});

const copyOptions = computed(() => {
  if (!currentNode.value?.treeState) return [];
  return props.treeList
    .filter((n) => n.treeState?.level === currentNode.value.treeState.level + 1)
    .map((n) => ({
      label: [...(n.treeState?.pathNames || []), n.Name].join(' -> '),
      value: n.ID,
    }));
});

const formSchema = computed((): VbenFormSchema[] => [
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入名称',
    },
    fieldName: 'Name',
    label: '名称',
    rules: 'required',
  },
  {
    component: 'Select',
    componentProps: {
      placeholder: '请选择复制节点',
      options: copyOptions.value,
      allowClear: true,
      showSearch: true,
      filterOption: (input: string, option: Record<string, any>) =>
        option.label.includes(input),
    },
    fieldName: 'CopyTreeID',
    label: '复制节点',
    hide: isUpdate.value,
  },
]);

async function handleSubmit() {
  const { valid } = await formApi.validate();
  const values = await formApi.getValues();

  if (!valid) return;

  const pId = currentRoute.value.params.pId as string;
  const vId = currentRoute.value.params.vId as string;

  const data = {
    ...values,
    ID: isUpdate.value ? currentNode.value.ID : undefined,
    Parent_ID: isUpdate.value ? undefined : currentNode.value.ID,
    CopyTreeID: values.CopyTreeID,
  };

  await (isUpdate.value
    ? putListPreparationCatalog(pId, vId, data)
    : postListPreparationCatalog(pId, vId, [data]));

  emit('submit');
  modalApi.close();
}

const [VbenModal, modalApi] = useVbenModal({
  onConfirm: handleSubmit,
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const data = modalApi.getData<Record<string, any>>();
      isUpdate.value = data.isUpdate;
      currentNode.value = data.currentNode;

      formApi.resetForm();
      formApi.updateSchema(formSchema.value);

      if (isUpdate.value) {
        formApi.setValues({
          Name: currentNode.value.Name,
        });
      }
    }
  },
});

const [VbenForm, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  schema: formSchema.value,
  showDefaultActions: false,
});
</script>

<template>
  <VbenModal
    :title="isUpdate ? '修改' : '新增'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :fullscreen-button="false"
    footer-class="border-none"
    header-class="border-none"
    class="w-[600px]"
  >
    <VbenForm />
  </VbenModal>
</template>
