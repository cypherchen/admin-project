<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed, markRaw } from 'vue';

import { AuthenticationLogin, SliderCaptcha, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useAuthStore } from '#/store';
import { useAppConfig } from '@vben/hooks';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    {
      component: markRaw(SliderCaptcha),
      fieldName: 'captcha',
      rules: z.boolean().refine((value) => value, {
        message: $t('authentication.verifyRequiredTip'),
      }),
    },
  ];
});

const { envType, ssoUrlProd, ssoUrlTest, ssoClientIdProd, ssoClientIdTest } =
  useAppConfig(import.meta.env, import.meta.env.PROD);
const SSOLogin = (state = '') => {
  const ssoUrl = envType === 0 ? ssoUrlProd : ssoUrlTest;

  const ssoClientId = envType === 0 ? ssoClientIdProd : ssoClientIdTest;

  const encodeUrl = encodeURIComponent(`${window.location.origin}/#/login`);

  let href = `${ssoUrl}?client_id=${ssoClientId}&response_type=code&redirect_uri=${encodeUrl}`;

  if (state) {
    href += `&state=${state}`;
  }

  window.open(href, '_self');
};
</script>

<template>
  <AuthenticationLogin
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    :showForgetPassword="false"
    :showCodeLogin="false"
    :showQrcodeLogin="false"
    :showThirdPartyLogin="false"
    :showRegister="false"
    @submit="authStore.authLogin"
  >
    <template #third-party-login>
      <a-button class="mt-4 w-full" @click="SSOLogin()">单点登录</a-button>
    </template>
  </AuthenticationLogin>
</template>
