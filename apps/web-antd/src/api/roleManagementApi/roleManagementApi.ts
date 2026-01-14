/*
 * @Author: cwx
 * @Date: 2025-03-29 00:17:05
 * @LastEditTime: 2025-03-29 00:50:27
 * @LastEditors: cwx
 * @Description: 角色管理api
 */

import { requestClient } from '#/api/request';
import type {
  BasicParamsType,
  BasicFetchResult,
  BasicModel,
} from '#/api/basicType';

export namespace RoleApi {
  export interface SysRole extends BasicModel {
    Name: string;
    Remark: null | string;
    Menu: string[];
    Authority: string[];
  }
  export interface RoleResult extends BasicModel {
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

  export interface RoleAuthResult extends BasicModel {
    ID: string;
    Name: string;
    Authority: string[];
    Menu: string[];
    Orz_ID: string;
    roleName: string;
  }
}

/**
 * @description: 添加角色
 * @param {Record<string, any>} data
 * @return {*}
 */
export function postRole(data: Record<string, any>) {
  return requestClient.post<RoleApi.RoleResult>(`api/SysRole`, data);
}

/**
 * @description: 删除角色
 * @param {string[]} data
 * @return {*}
 */
export function deleteRole(data: string[]) {
  return requestClient.delete<RoleApi.RoleResult>(`api/SysRole`, {
    data,
  });
}

/**
 * @description: 修改角色
 * @param {string} orgId
 * @param {Record<string, any>} data
 * @return {*}
 */
export function putRole(orgId: string, data: Record<string, any>) {
  return requestClient.put<RoleApi.RoleResult>(
    `api/SysRole/${orgId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询角色
 * @param {string} orgId 组织ID
 * @param {BasicParamsType} params
 * @return {*}
 */
export function getRole(orgId: string, params?: BasicParamsType) {
  return requestClient.get<BasicFetchResult<RoleApi.RoleResult>>(
    `api/SysRole/${orgId}`,
    { params },
  );
}

/**
 * @description: 查询当前角色的融合后权限信息
 * @param {string} userId 角色ID
 * @return {*}
 */
export function getRoleAuth(userId: string) {
  return requestClient.get<RoleApi.RoleAuthResult>(
    `api/SysRole/GetRoleAuthority/${userId}`,
  );
}

/**
 * @description: 根据ID查询角色
 * @param {{ userId: string }} userId 角色ID
 * @return {*}
 */
export function getRoleByID(params: { userId: string }) {
  return requestClient.get<RoleApi.RoleResult>(`api/SysRole/GetRoleInfo`, {
    params,
  });
}

/**
 * @description: 修改当前角色密码
 * @param {{ userId: string; newPassword: string }} data
 * @return {*}
 */
export function putRolePassword(data: { userId: string; newPassword: string }) {
  return requestClient.put<RoleApi.RoleResult>(
    `api/SysRole/ChangePassword`,
    data,
  );
}
