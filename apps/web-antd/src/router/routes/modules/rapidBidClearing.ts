/*
 * @Author: cwx
 * @Date: 2024-12-19 20:56:58
 * @LastEditTime: 2025-03-26 23:51:31
 * @LastEditors: cwx
 * @Description:
 */
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'rapidBidClearing',
    path: '/rapidBidClearing',
    meta: {
      icon: 'carbon:compare',
      keepAlive: true,
      order: 4,
      title: '快速清标',
      hideChildrenInMenu: true,
      belongTo: 'user',
    },
    children: [
      {
        name: 'rapidBidClearingList',
        path: '/rapidBidClearing/:bId?',
        component: () => import('#/views/listPreparation/index.vue'),
        meta: {
          title: '快速清标',
          activePath: '/rapidBidClearing/:bId?',
        },
      },
      {
        name: 'rapidBidClearingDetail',
        path: ':bId/detail/:pId/:vId',
        component: () => import('#/views/listPreparation/content/content.vue'),
        meta: {
          title: '快速清标详情',
          activePath: '/rapidBidClearing/:bId?',
        },
      },
    ],
  },
];

export default routes;
