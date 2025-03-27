/*
 * @Author: cwx
 * @Date: 2025-03-23 12:14:00
 * @LastEditTime: 2025-03-27 09:12:36
 * @LastEditors: cwx
 * @Description: 成员管理api
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
 * @description: 添加成员
 * @param {Record<string, any>} data
 * @return {*}
 */
export function postMember(data: Record<string, any>) {
  return requestClient.post<UserApi.UserResult>(`api/SystemUserInfo`, { data });
}

/**
 * @description: 删除成员
 * @param {string[]} data
 * @return {*}
 */
export function deleteMember(data: string[]) {
  return requestClient.delete<UserApi.UserResult>(`api/SystemUserInfo`, {
    data,
  });
}

/**
 * @description: 修改成员
 * @param {Record<string, any>} data
 * @return {*}
 */
export function putMember(data: Record<string, any>) {
  return requestClient.put<UserApi.UserResult>(
    `api/SystemUserInfo/${data.ID}`,
    { data },
  );
}

/**
 * @description: 查询成员
 * @param {BasicParamsType} params
 * @return {*}
 */
export function getMember({ params }: { params?: BasicParamsType }) {
  return requestClient.get<BasicFetchResult<UserApi.UserResult>>(
    `api/SystemUserInfo/GetOrganizationMember`,
    { params },
  );
}

/**
 * @description: 查询当前成员的融合后权限信息
 * @param {string} userId 用户ID
 * @return {*}
 */
export function getMemberAuth(userId: string) {
  return requestClient.get<UserApi.UserAuthResult>(
    `api/SystemUserInfo/GetUserAuthority/${userId}`,
  );
}
