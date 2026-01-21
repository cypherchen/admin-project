<script lang="ts" setup>
import type { RouteRecordRaw } from 'vue-router';

import type { NotificationItem } from '@vben/layouts';

import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { AuthenticationLoginExpiredModal } from '@vben/common-ui';
import { useWatermark } from '@vben/hooks';
import {
  BasicLayout,
  LockScreen,
  Notification,
  UserDropdown,
} from '@vben/layouts';
import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';

import { sortBy } from 'lodash';

import { createModifyPassword } from '#/components/_project/modifyPassword';
import { accessRoutes } from '#/router/routes';
import { useAuthStore } from '#/store';
import LoginForm from '#/views/_core/authentication/login.vue';

const notifications = ref<NotificationItem[]>([
  // {
  //   avatar: 'https://avatar.vercel.sh/vercel.svg?text=VB',
  //   date: '3小时前',
  //   isRead: true,
  //   message: '描述信息描述信息描述信息',
  //   title: '收到了 14 份新周报',
  // },
]);

const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();
const { destroyWatermark, updateWatermark } = useWatermark();
const showDot = computed(() =>
  notifications.value.some((item) => !item.isRead),
);

const router = useRouter();
const menus = computed(() => [
  {
    handler: async () => {
      const routes = sortBy(
        accessRoutes.filter((item) => item.meta?.belongTo === 'user'),
        (r: RouteRecordRaw) => r.meta?.order,
      );
      router.push({ name: routes[0]?.name });
    },
    text: '前台',
  },
  {
    handler: async () => {
      const routes = sortBy(
        accessRoutes.filter((item) => item.meta?.belongTo === 'admin'),
        (r: RouteRecordRaw) => r.meta?.order,
      );
      router.push({ name: routes[0]?.name });
    },
    text: '后台',
  },
  {
    handler: () => {
      createModifyPassword({
        closeable: true,
        submit: () => {
          handleLogout();
        },
      });
    },
    text: '修改密码',
  },
]);

const computedMenus = computed(() => {
  return userStore.userInfo?.IsAdmin
    ? menus.value
    : menus.value.filter((item) => !['前台', '后台'].includes(item.text));
});

const avatar = computed(() => {
  return userStore.userInfo?.avatar ?? preferences.app.defaultAvatar;
});

async function handleLogout() {
  await authStore.logout(false);
}

function handleNoticeClear() {
  notifications.value = [];
}

function markRead(id: number | string) {
  const item = notifications.value.find((item) => item.id === id);
  if (item) {
    item.isRead = true;
  }
}

function remove(id: number | string) {
  notifications.value = notifications.value.filter((item) => item.id !== id);
}

function handleMakeAll() {
  notifications.value.forEach((item) => (item.isRead = true));
}
watch(
  () => ({
    enable: preferences.app.watermark,
    content: preferences.app.watermarkContent,
  }),
  async ({ enable }) => {
    if (enable) {
      await updateWatermark({
        content: `${userStore.userInfo?.Name}`,
      });
    } else {
      destroyWatermark();
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <BasicLayout @clear-preferences-and-logout="handleLogout">
    <template #user-dropdown>
      <UserDropdown
        :avatar
        :menus="computedMenus"
        :text="userStore.userInfo?.Name"
        description=""
        tag-text="Pro"
        @logout="handleLogout"
      />
    </template>
    <template #notification>
      <Notification
        :dot="showDot"
        :notifications="notifications"
        @clear="handleNoticeClear"
        @read="(item) => item.id && markRead(item.id)"
        @remove="(item) => item.id && remove(item.id)"
        @make-all="handleMakeAll"
      />
    </template>
    <template #extra>
      <AuthenticationLoginExpiredModal
        v-model:open="accessStore.loginExpired"
        :avatar
      >
        <LoginForm />
      </AuthenticationLoginExpiredModal>
    </template>
    <template #lock-screen>
      <LockScreen :avatar @to-login="handleLogout" />
    </template>
  </BasicLayout>
</template>
