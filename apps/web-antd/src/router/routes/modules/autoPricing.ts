/*
 * @Author: cwx
 * @Date: 2024-12-19 20:56:58
 * @LastEditTime: 2026-01-16 15:18:47
 * @LastEditors: cwx
 * @Description:
 */
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'autoPricing',
    path: '/autoPricing',
    meta: {
      icon: 'carbon:pricing-container',
      keepAlive: true,
      order: 3,
      title: '自动套价',
      hideChildrenInMenu: true,
      belongTo: 'user',
    },
    children: [
      {
        name: 'autoPricingList',
        path: '/autoPricing/:bId?',
        component: () => import('#/views/autoPricing/index.vue'),
        meta: {
          title: '自动套价',
          activePath: '/autoPricing/:bId?',
        },
      },
      {
        name: 'autoPricingDetail',
        path: ':bId/detail/:pId/:vId',
        component: () => import('#/views/autoPricing/content/content.vue'),
        meta: {
          title: '自动套价详情',
          activePath: '/autoPricing/:bId?',
        },
      },
    ],
  },
];

export default routes;
