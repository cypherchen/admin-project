/*
 * @Author: cwx
 * @Date: 2024-12-19 20:56:58
 * @LastEditTime: 2025-01-20 20:54:54
 * @LastEditors: cwx
 * @Description:
 */
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'IndicatorAnalyze',
    path: '/indicatorAnalyze',
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 4,
      title: '指标分析',
      hideChildrenInMenu: true,
    },
    children: [
      {
        name: 'IndicatorAnalyzeList',
        path: '/indicatorAnalyze',
        component: () => import('#/views/listPreparation/index.vue'),
        meta: {
          title: '指标分析',
          activePath: '/indicatorAnalyze',
        },
      },
      {
        name: 'IndicatorAnalyzeDetail',
        path: '/indicatorAnalyze/:bId/detail/:pId/:vId',
        component: () => import('#/views/listPreparation/content/content.vue'),
        meta: {
          title: '指标分析详情',
          activePath: '/indicatorAnalyze',
        },
      },
    ],
  },
];

export default routes;
