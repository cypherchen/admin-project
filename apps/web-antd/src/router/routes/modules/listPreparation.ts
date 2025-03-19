/*
 * @Author: cwx
 * @Date: 2024-12-19 20:56:58
 * @LastEditTime: 2025-03-14 23:08:22
 * @LastEditors: cwx
 * @Description:
 */
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'ListPreparation',
    path: '/listPreparation',
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1,
      title: '清单编制',
      hideChildrenInMenu: true,
      menuVisibleWithForbidden: true,
      belongTo: 'user',
    },
    children: [
      {
        name: 'ListPreparationList',
        path: '/listPreparation/:bId?',
        component: () => import('#/views/listPreparation/index.vue'),
        meta: {
          title: '清单编制',
          activePath: '/listPreparation/:bId?',
        },
      },
      {
        name: 'ListPreparationDetail',
        path: '/listPreparation/:bId/detail/:pId/:vId',
        component: () => import('#/views/listPreparation/content/content.vue'),
        meta: {
          title: '清单编制详情',
          activePath: '/listPreparation/:bId?',
        },
      },
    ],
  },
];

export default routes;
