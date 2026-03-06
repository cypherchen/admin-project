/*
 * @Author: cwx
 * @Date: 2025-03-26 23:40:07
 * @LastEditTime: 2026-01-15 10:21:51
 * @LastEditors: cwx
 * @Description:
 */

import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'authorityManagement',
    path: '/authorityManagement',
    meta: {
      icon: 'carbon:dashboard',
      keepAlive: true,
      order: 1,
      title: '权限管理',
      hideChildrenInMenu: true,
      belongTo: 'admin',
    },
    component: () => import('#/views/authorityManagement/index.vue'),
  },
];

export default routes;
