import type { Router, RouteRecordRaw } from 'vue-router';

import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
} from '@vben/types';

import { generateAccessible } from '@vben/access';
import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { getAllMenusApi } from '#/api';
import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';
import { useAuthStore } from '#/store';

const forbiddenComponent = () => import('#/views/_core/fallback/forbidden.vue');

const DEFAULT_OPTIONS = { setMenus: true, setRoutes: true };

async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue');

  const layoutMap: ComponentRecordType = {
    BasicLayout,
    IFrameView,
  };

  return await generateAccessible(preferences.app.accessMode, {
    ...options,
    fetchMenuListAsync: async () => {
      message.loading({
        content: `${$t('common.loadingMenu')}...`,
        duration: 1.5,
      });
      return await getAllMenusApi();
    },
    // 可以指定没有权限跳转403页面
    forbiddenComponent,
    // 如果 route.meta.menuVisibleWithForbidden = true
    layoutMap,
    pageMap,
  });
}

async function generateCustomAccess(
  router: Router,
  routes: RouteRecordRaw[],
  options: Record<string, any> = DEFAULT_OPTIONS,
) {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const authStore = useAuthStore();

  // 生成路由表
  // 当前登录用户拥有的角色标识列表
  const userInfo = userStore.userInfo || (await authStore.fetchUserInfo());
  const userRoles = userInfo.roleName ? [userInfo.roleName] : [];

  // 生成菜单和路由
  const { accessibleMenus, accessibleRoutes } = await generateAccess({
    roles: userRoles,
    router,
    // 则会在菜单中显示，但是访问会被重定向到403
    routes,
  });

  // 保存菜单信息和路由信息
  options.setMenus && accessStore.setAccessMenus(accessibleMenus);
  options.setRoutes && accessStore.setAccessRoutes(accessibleRoutes);
}

export { generateAccess, generateCustomAccess };
