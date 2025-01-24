/*
 * @Author: cwx
 * @Date: 2024-12-19 20:56:58
 * @LastEditTime: 2025-01-21 00:05:51
 * @LastEditors: cwx
 * @Description:
 */
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'listPreparation',
    path: '/listPreparation',
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1,
      title: '清单编制',
      hideChildrenInMenu: true,
      authority: ['admin'],
      menuVisibleWithForbidden: true,
    },
    children: [
      {
        name: 'ListPreparationList',
        path: '/listPreparation',
        component: () => import('#/views/listPreparation/index.vue'),
        meta: {
          title: '清单编制',
          activePath: '/listPreparation',
        },
      },
      {
        name: 'ListPreparationDetail',
        path: '/listPreparation/:bId/detail/:pId/:vId',
        component: () => import('#/views/listPreparation/content/content.vue'),
        meta: {
          title: '清单编制详情',
          activePath: '/listPreparation',
        },
      },
    ],
  },
];

export default routes;
