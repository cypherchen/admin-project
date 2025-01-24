import type { AuthApi } from '#/api/core/auth';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  // return requestClient.get<UserInfo>('/user/info');
  return {} as AuthApi.LoginResult;
}
