/*
 * @Author: cwx
 * @Date: 2024-12-19 20:56:58
 * @LastEditTime: 2024-12-22 22:46:25
 * @LastEditors: cwx
 * @Description:
 */
import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: '清单编制',
    },
    name: 'ListPreparation',
    path: '/listPreparation',
    children: [
      {
        meta: {
          title: '台账页',
        },
        name: 'ListPreparationList',
        path: '/listPreparation/list',
        component: () => import('#/views/listPreparation/index.vue'),
      },
    ],
  },
];

export default routes;
