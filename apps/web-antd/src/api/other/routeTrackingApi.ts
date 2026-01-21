/*
 * @Author: cwx
 * @Date: 2025-03-13 23:01:13
 * @LastEditTime: 2025-03-13 23:48:35
 * @LastEditors: cwx
 * @Description: 路由埋点api
 */
import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace RouteTrackingApi {
  export type RouteTrackingApiModel = {
    appId: string;
    currentPageName: string;
    currentUrl: string;
    eventType: string;
    evt: string;
    operationId: string;
    page: string;
    pageName: string;
    preUrl: string;
    startTime: string;
    tenantCode: string;
    tenantId: number;
    username: string;
  };
}

/**
 * @description: 路由埋点
 * @param {Recordable<string | number>} data
 * @return {*}
 */
export async function postRouteTracking(data: Recordable<number | string>) {
  return requestClient.post<Recordable<string>>(
    `/api/Common/BuryingPointAsk`,
    data,
    {
      headers: { disableErrorPrompt: true },
    },
  );
}
