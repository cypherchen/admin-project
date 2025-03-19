/*
 * @Author: cwx
 * @Date: 2025-03-11 21:54:23
 * @LastEditTime: 2025-03-11 21:54:42
 * @LastEditors: cwx
 * @Description:
 */

import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'DepartManagement',
    path: '/departManagement',
    component: () => import('#/views/listPreparation/index.vue'),
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 0,
      title: '部门管理',
      hideChildrenInMenu: true,
      menuVisibleWithForbidden: true,
      belongTo: 'admin',
    },
  },
];

export default routes;
