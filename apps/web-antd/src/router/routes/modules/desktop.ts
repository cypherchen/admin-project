/*
 * @Author: cwx
 * @Date: 2025-03-26 23:40:07
 * @LastEditTime: 2025-03-26 23:41:36
 * @LastEditors: cwx
 * @Description:
 */

import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'desktop',
    path: '/desktop',
    meta: {
      icon: 'carbon:dashboard',
      keepAlive: true,
      order: 1,
      title: '驾驶仓',
      hideChildrenInMenu: true,
      belongTo: 'user',
    },
    component: () => import('#/views/listPreparation/index.vue'),
  },
];

export default routes;
