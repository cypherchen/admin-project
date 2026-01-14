import type { AuthApi } from '#/api';

import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { message, notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

import { getUserInfoApi, loginApi, logoutApi } from '#/api';
import { $t } from '#/locales';
import { encrypt } from '#/utils/encrypt';
import { checkPwdStrength } from '#/utils/valid';

import { createModifyPassword } from '#/components/_project/modifyPassword';

import { accessRoutes } from '#/router/routes';

import { hasPermission } from '#/components/authority';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   */
  async function authLogin(
    params: Record<string, any>,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: AuthApi.LoginResult | null = null;

    try {
      loginLoading.value = true;

      const userData = await loginApi({
        account: params.username,
        password: encrypt(params.password),
      });

      // 如果成功获取到 accessToken
      if (userData.token) {
        accessStore.setAccessToken(userData.token);

        // 获取用户信息并存储到 accessStore 中
        // const [fetchUserInfoResult, accessCodes] = await Promise.all([
        //   fetchUserInfo(),
        //   getAccessCodesApi(),
        // ]);

        userData.homePath = accessRoutes
          .sort((a, b) => a.meta?.order! - b.meta?.order!)
          .find((item) => {
            return hasPermission(item.name as string, 'menu');
          })?.path;

        userInfo = userData;

        userStore.setUserInfo(userInfo);
        accessStore.setAccessCodes(userData.Authority);
        accessStore.setAccessMenuCodes(userData.Menu);

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          onSuccess
            ? await onSuccess?.()
            : await router.push(
                userInfo.homePath || preferences.app.defaultHomePath,
              );
        }

        if (userInfo?.Name) {
          notification.success({
            description: `${$t('authentication.loginSuccessDesc')}:${userInfo?.Name}`,
            duration: 3,
            message: $t('authentication.loginSuccess'),
          });
        }
      }
    } finally {
      loginLoading.value = false;
    }

    nextTick(() => {
      if (params.password === 'FScost@2024') {
        message.error('请修改初始密码');
        createModifyPassword({
          closeable: false,
          submit: () => {
            logout(false);
          },
        });
      } else if (!checkPwdStrength(params.password)) {
        message.error('密码强度不够');
        createModifyPassword({
          closeable: false,
          submit: () => {
            logout(false);
          },
        });
      }
    });

    return {
      userInfo,
    };
  }

  async function logout(redirect: boolean = true) {
    try {
      await logoutApi();
    } catch {
      // 不做任何处理
    }
    resetAllStores();
    accessStore.setLoginExpired(false);

    // 回登录页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query: redirect
        ? {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          }
        : {},
    });
  }

  async function fetchUserInfo() {
    let userInfo: AuthApi.LoginResult | null = null;
    userInfo = await getUserInfoApi();
    userStore.setUserInfo(userInfo);
    return userInfo;
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    fetchUserInfo,
    loginLoading,
    logout,
  };
});
