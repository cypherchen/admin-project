/*
 * @Author: cwx
 * @Date: 2024-12-17 21:39:49
 * @LastEditTime: 2024-12-19 21:10:41
 * @LastEditors: cwx
 * @Description:
 */
import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  // return requestClient.get<UserInfo>('/user/info');
  return {};
}
