<!--
 * @Author: cwx
 * @Date: 2025-03-26 10:59:56
 * @LastEditTime: 2025-03-27 14:50:51
 * @LastEditors: cwx
 * @Description: 修改密码弹窗
-->
<script setup lang="ts" name="ModifyPassword">
import type { VbenFormSchema } from '@vben/common-ui';

import type { ModifyPasswordProps } from './props';

import { ref, toRefs } from 'vue';

import { useVbenForm, z } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';
import { isFunction } from '@vben/utils';

import { Button, Flex, message, Modal } from 'ant-design-vue';

import { putUserPassword } from '#/api/userApi/userApi';
import { encrypt } from '#/utils/encrypt';
import { checkPwdStrength } from '#/utils/valid';

const props = withDefaults(defineProps<ModifyPasswordProps>(), {
  closeable: true,
});
const { closeable, submit } = toRefs(props);

const userStore = useUserStore();

const formSchema: VbenFormSchema[] = [
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入新密码',
    },
    fieldName: 'Password',
    label: '新密码',
    rules: z
      .string()
      .min(1, { message: '请输入新密码' })
      .refine((value) => checkPwdStrength(value, userStore.userInfo!.IsAdmin), {
        message: `必须包含大写字母, 小写字母, 数字, 特殊字符, 不能出现3位连续或者重复的字符(111, abc), 长度至少${userStore.userInfo!.IsAdmin ? 12 : 8}位`,
      }),
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入密码',
    },
    fieldName: 'ConfirmPassword',
    label: '确认密码',
    rules: z.string().refine(
      async (value) => {
        const values = await formApi.getValues();
        return value === values.Password;
      },
      { message: '两次密码不一致' },
    ),
  },
];

const [VbenForm, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  schema: formSchema,
  showDefaultActions: false,
});

const open = ref<boolean>(true);
function handleOpen(isOpen: boolean) {
  open.value = isOpen;
}

async function handleSubmit() {
  const { valid } = await formApi.validate();
  const values = await formApi.getValues();
  if (!valid) return;

  await putUserPassword({
    userId: userStore.userInfo!.ID,
    newPassword: encrypt(values.Password),
  });

  message.success('修改成功, 请重新登录');

  handleOpen(false);
  isFunction(submit.value) && submit.value();
}
</script>

<template>
  <Modal
    v-bind="$attrs"
    title="修改密码"
    v-model:open="open"
    :destroy-on-close="true"
    :mask-closable="false"
    :keyboard="false"
    :closable="closeable"
    width="500px"
    :footer="null"
  >
    <VbenForm />
    <Flex justify="end" class="w-full">
      <Button type="primary" @click="handleSubmit">确认</Button>
    </Flex>
  </Modal>
</template>

<style scoped lang="less">
:deep(p[role='alert']) {
  position: unset !important;
}
</style>
