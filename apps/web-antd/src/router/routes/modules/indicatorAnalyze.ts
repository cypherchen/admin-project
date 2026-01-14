/*
 * @Author: cwx
 * @Date: 2024-12-19 20:56:58
 * @LastEditTime: 2025-03-27 00:01:30
 * @LastEditors: cwx
 * @Description:
 */
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'indicatorAnalyze',
    path: '/indicatorAnalyze',
    meta: {
      icon: 'carbon:analytics-reference',
      keepAlive: true,
      order: 5,
      title: '指标分析',
      hideChildrenInMenu: true,
      belongTo: 'user',
    },
    children: [
      {
        name: 'indicatorAnalyzeList',
        path: '/indicatorAnalyze',
        component: () => import('#/views/listPreparation/index.vue'),
        meta: {
          title: '指标分析',
          activePath: '/indicatorAnalyze',
        },
      },
      {
        name: 'indicatorAnalyzeDetail',
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
