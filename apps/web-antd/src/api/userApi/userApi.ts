/*
 * @Author: cwx
 * @Date: 2025-03-23 12:14:00
 * @LastEditTime: 2025-03-27 14:49:25
 * @LastEditors: cwx
 * @Description: 用户管理api
 */
import { requestClient } from '#/api/request';
import type {
  BasicParamsType,
  BasicFetchResult,
  BasicModel,
} from '#/api/basicType';

export namespace UserApi {
  export interface SysRole extends BasicModel {
    Name: string;
    Remark: null | string;
    Menu: string[];
    Authority: string[];
  }
  export interface UserResult extends BasicModel {
    Account: string;
    Mobile: string;
    Password: string;
    Name: string;
    Code: null | string;
    Sex: string;
    Avatar: null | string;
    IdentityCard: null | string;
    Email: string;
    Address: null | string;
    Adder: string;
    AddTime: string;
    SysRole: SysRole;
    SysRole_ID: string;
    IsAdmin: boolean;
    SysDepart: null | string;
    SysDepart_ID: null | string;
    Menu: string[];
    Authority: string[];
    roleName: null | string;
    token: null | string;
    OrzName: null | string;
    Source: null | string;
  }

  export interface UserAuthResult extends BasicModel {
    ID: string;
    Name: string;
    Authority: string[];
    Menu: string[];
    Orz_ID: string;
    roleName: string;
  }
}

/**
 * @description: 添加用户
 * @param {Record<string, any>} data
 * @return {*}
 */
export function postUser(data: Record<string, any>) {
  return requestClient.post<UserApi.UserResult>(`api/SystemUserInfo`, { data });
}

/**
 * @description: 删除用户
 * @param {string[]} data
 * @return {*}
 */
export function deleteUser(data: string[]) {
  return requestClient.delete<UserApi.UserResult>(`api/SystemUserInfo`, {
    data,
  });
}

/**
 * @description: 修改用户
 * @param {Record<string, any>} data
 * @return {*}
 */
export function putUser(data: Record<string, any>) {
  return requestClient.put<UserApi.UserResult>(
    `api/SystemUserInfo/${data.ID}`,
    { data },
  );
}

/**
 * @description: 查询用户
 * @param {BasicParamsType} params
 * @return {*}
 */
export function getUser({ params }: { params?: BasicParamsType }) {
  return requestClient.get<BasicFetchResult<UserApi.UserResult>>(
    `api/SystemUserInfo/GetOrganizationMember`,
    { params },
  );
}

/**
 * @description: 查询当前用户的融合后权限信息
 * @param {string} userId 用户ID
 * @return {*}
 */
export function getUserAuth(userId: string) {
  return requestClient.get<UserApi.UserAuthResult>(
    `api/SystemUserInfo/GetUserAuthority/${userId}`,
  );
}

/**
 * @description: 根据ID查询用户
 * @param {{ userId: string }} userId 用户ID
 * @return {*}
 */
export function getUserByID(params: { userId: string }) {
  return requestClient.get<UserApi.UserResult>(
    `api/SystemUserInfo/GetUserInfo`,
    { params },
  );
}

/**
 * @description: 修改当前用户密码
 * @param {{ userId: string; newPassword: string }} data
 * @return {*}
 */
export function putUserPassword(data: { userId: string; newPassword: string }) {
  return requestClient.put<UserApi.UserResult>(
    `api/SystemUserInfo/ChangePassword`,
    data,
  );
}
