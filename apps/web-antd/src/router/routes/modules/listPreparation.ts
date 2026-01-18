/*
 * @Author: cwx
 * @Date: 2024-12-19 20:56:58
 * @LastEditTime: 2026-01-16 09:50:06
 * @LastEditors: cwx
 * @Description:
 */
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'listPreparation',
    path: '/listPreparation',
    meta: {
      icon: 'carbon:list',
      keepAlive: true,
      order: 2,
      title: '清单编制',
      hideChildrenInMenu: true,
      belongTo: 'user',
    },
    children: [
      {
        name: 'listPreparationList',
        path: '/listPreparation/:bId?',
        component: () => import('#/views/listPreparation/index.vue'),
        meta: {
          title: '清单编制',
          activePath: '/listPreparation/:bId?',
        },
      },
      {
        name: 'listPreparationDetail',
        path: ':bId/detail/:pId/:vId',
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
