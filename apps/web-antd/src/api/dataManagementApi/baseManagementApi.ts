/*
 * @Author: cwx
 * @Date: 2024-05-08 19:27:13
 * @LastEditTime: 2026-01-17 12:51:12
 * @LastEditors: cwx
 * @Description: 基地管理
 */
import type { Recordable } from '@vben/types';

import type { BasicFetchResult, BasicModel } from '#/api/basicType';

import { requestClient } from '#/api/request';

export namespace BaseManagementApi {
  export interface BaseResult extends BasicModel {
    Name: string;
    BackShowName: null | string;
    Parent_ID: null | string;
    Count: number;
    Amount: null | number;
    Type: number;
    MergeState: number;
    ErrorReason: null | string;
    IsThirdParty: boolean | null;
    ThirdPartyId: null | string;
    ShortName: null | string;
    CopyID: null | string;
  }

  export interface BaseMonomerResult extends BasicModel {
    MonomerName: string;
    MonomerCode: string;
    MonomerHierarchyCode: string;
    BusinessType: string;
    BusinessCode: string;
    CoverArea: number;
    BuildingArea: number;
    APProjectBaseTree_ID: string;
    APProjectBaseTreeName: string;
    ThirdPartyId: string;
    BaseTreeThirdPartyId: null | string;
    BaseTreeShortName: null | string;
  }
}

/**
 * @description: 新增基地
 * @param {*} orgId
 * @param {*} data
 * @return {Promise<BaseResult>}
 */
export async function postBase(orgId: string, data: Recordable<any>) {
  return requestClient.post<BaseManagementApi.BaseResult>(
    `api/APProjectBaseTree/${orgId}`,
    data,
  );
}

/**
 * @description: 删除基地
 * @param {*} orgId
 * @param {*} id
 * @return {Promise<boolean>}
 */
export async function deleteBase(orgId: string, id: string) {
  return requestClient.delete<boolean>(`api/APProjectBaseTree/${orgId}/${id}`);
}

/**
 * @description: 修改基地
 * @param {*} orgId
 * @param {*} data
 * @return {Promise<BaseResult>}
 */
export async function putBase(orgId: string, data: Recordable<any>) {
  return requestClient.put<BaseManagementApi.BaseResult>(
    `api/APProjectBaseTree/${orgId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询基地
 * @param {*} orgId
 * @param {*} params
 * @return {Promise<BasicFetchResult<BaseResult>>}
 */
export async function getBase({
  orgId,
  params,
}: {
  orgId: string;
  params?: Recordable<any>;
}) {
  return requestClient.get<BasicFetchResult<BaseManagementApi.BaseResult>>(
    `api/APProjectBaseTree/${orgId}`,
    { params },
  );
}

/**
 * @description: 新增基地单体
 * @param {*} data
 * @return {Promise<BaseMonomerResult>}
 */
export async function postBaseMonomer(data: Recordable<any>) {
  return requestClient.post<BaseManagementApi.BaseMonomerResult>(
    `api/IPMonomerData`,
    data,
  );
}

/**
 * @description: 删除基地单体
 * @param {*} id
 * @return {Promise<boolean>}
 */
export async function deleteBaseMonomer(id: string) {
  return requestClient.delete<boolean>(`api/IPMonomerData/${id}`);
}

/**
 * @description: 修改基地单体
 * @param {*} data
 * @return {Promise<BaseMonomerResult>}
 */
export async function putBaseMonomer(data: Recordable<any>) {
  return requestClient.put<BaseManagementApi.BaseMonomerResult>(
    `api/IPMonomerData/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询基地单体
 * @param {*} params
 * @return {Promise<BasicFetchResult<BaseMonomerResult>>}
 */
export async function getBaseMonomer(params?: Recordable<any>) {
  return requestClient.get<
    BasicFetchResult<BaseManagementApi.BaseMonomerResult>
  >(`api/IPMonomerData`, { params });
}

/**
 * @description: 手动更新基地单体
 * @return {Promise<any>}
 */
export async function postBaseManualUpdate() {
  return requestClient.post<any>(`api/IPMonomerData/UpdataSSOTMonomerData`);
}
