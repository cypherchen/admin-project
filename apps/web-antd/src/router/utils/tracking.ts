/*
 * @Author: cwx
 * @Date: 2024-09-24 11:21:19
 * @LastEditTime: 2025-03-13 23:37:21
 * @LastEditors: cwx
 * @Description: 埋点
 */
import { useUserStore } from '@vben/stores';

import dayjs from 'dayjs';
import { v7 as uuidV7 } from 'uuid';

import { postRouteTracking } from '#/api/other/routeTrackingApi';

function getFullPath(url: string): string {
  return `${window.location.origin}/#${url}`;
}

/**
 * @description: 路由埋点
 * @param {string} eventType 'enterPage' | 'leavePage'
 * @param {*} to
 * @param {*} from
 * @return {*}
 */
export async function tracking(eventType: string, to: any, from: any) {
  const userStore = useUserStore();
  const userInfo = userStore.userInfo;

  if (!userInfo) return;

  const pageName: string =
    (eventType === 'leavePage' ? from.meta.title : to.meta.title) || '';

  const trackingData = {
    appId: 'FSCOST',
    currentPageName: pageName,
    currentUrl: getFullPath(eventType === 'leavePage' ? from.path : to.path),
    eventType,
    evt: eventType,
    operationId: uuidV7(),
    page: pageName,
    pageName,
    preUrl: eventType === 'leavePage' ? '' : getFullPath(from.path),
    startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    tenantCode: 'catl',
    tenantId: 2,
    username: userInfo.Account,
  };

  postRouteTracking(trackingData);
}
