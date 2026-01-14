/*
 * @Author: cwx
 * @Date: 2024-12-19 20:56:58
 * @LastEditTime: 2025-03-26 23:58:20
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
        path: '/autoPricing',
        component: () => import('#/views/listPreparation/index.vue'),
        meta: {
          title: '自动套价',
          activePath: '/autoPricing',
        },
      },
      {
        name: 'autoPricingDetail',
        path: '/autoPricing/:bId/detail/:pId/:vId',
        component: () => import('#/views/listPreparation/content/content.vue'),
        meta: {
          title: '自动套价详情',
          activePath: '/autoPricing',
        },
      },
    ],
  },
];

export default routes;
