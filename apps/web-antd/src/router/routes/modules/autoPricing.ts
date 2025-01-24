/*
 * @Author: cwx
 * @Date: 2024-12-19 20:56:58
 * @LastEditTime: 2025-01-20 20:48:04
 * @LastEditors: cwx
 * @Description:
 */
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'AutoPricing',
    path: '/autoPricing',
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 2,
      title: '自动套价',
      hideChildrenInMenu: true,
    },
    children: [
      {
        name: 'AutoPricingList',
        path: '/autoPricing',
        component: () => import('#/views/listPreparation/index.vue'),
        meta: {
          title: '自动套价',
          activePath: '/autoPricing',
        },
      },
      {
        name: 'AutoPricingDetail',
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
