/*
 * @Author: cwx
 * @Date: 2024-12-19 20:56:58
 * @LastEditTime: 2025-03-31 15:50:24
 * @LastEditors: cwx
 * @Description:
 */
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'listPreparation',
    path: '/listPreparation/:bId?',
    meta: {
      icon: 'carbon:list',
      keepAlive: true,
      order: 2,
      title: '清单编制',
      hideChildrenInMenu: true,
      menuVisibleWithForbidden: true,
      belongTo: 'user',
    },
    component: () => import('#/views/listPreparation/index.vue'),
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
