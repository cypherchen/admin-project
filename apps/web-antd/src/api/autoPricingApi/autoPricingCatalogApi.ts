/*
 * @Author: cwx
 * @Date: 2026-01-15 11:46:34
 * @LastEditTime: 2026-01-26 10:02:58
 * @LastEditors: cwx
 * @Description:
 */
import type { Recordable } from '@vben/types';

import type { BasicFetchResult } from '#/api/basicType';

import { requestClient } from '#/api/request';

export namespace AutoPricingCatalogApi {
  export interface CatalogResult {
    ID: string;
    Code: null | string;
    Name: string;
    Hierarchy: number;
    Parent_ID: null | string;
    NamePath: null | string;
    IDPath: string;
    APProjectID: string;
    IsUserDeclineRate: boolean;
    DeclineRate: number;
    IsApplyOnly: boolean;
    Specification: null | string;
    Version_ID: string;
    CreatedBy: string;
    CreatedUserInfo: string;
    CreatedTime: string;
    UpdatedBy: string;
    UpdatedUserInfo: string;
    UpdatedTime: string;
    Sort: number;
    AuditStatus: number;
    IsDelete: boolean;
    SysLevel: number;
  }
}

/**
 * @description: 新增自动套价项目树
 * @param {string} pId 项目ID
 * @param {string} vId 版本ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function postAutoPricingCatalog(
  pId: string,
  vId: string,
  data: Recordable<any>,
) {
  return requestClient.post<AutoPricingCatalogApi.CatalogResult>(
    `api/APProjectTree/${pId}/${vId}`,
    data,
  );
}

/**
 * @description: 删除自动套价项目树
 * @param {string} pId 项目ID
 * @param {string} vId 版本ID
 * @param {string} id
 * @return {*}
 */
export async function deleteAutoPricingCatalog(
  pId: string,
  vId: string,
  id: string,
) {
  return requestClient.delete<boolean>(`api/APProjectTree/${pId}/${vId}/${id}`);
}

/**
 * @description: 修改自动套价项目树
 * @param {string} pId 项目ID
 * @param {string} vId 版本ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function putAutoPricingCatalog(
  pId: string,
  vId: string,
  data: Recordable<any>,
) {
  return requestClient.put<AutoPricingCatalogApi.CatalogResult>(
    `api/APProjectTree/${pId}/${vId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询自动套价项目树
 * @param {object} params
 * @return {*}
 */
export async function getAutoPricingCatalog(params: {
  params?: Recordable<any>;
  pId: string;
  vId: string;
}) {
  const { pId, vId, params: queryParams } = params;
  return requestClient.get<
    BasicFetchResult<AutoPricingCatalogApi.CatalogResult>
  >(`api/APProjectTree/${pId}/${vId}`, {
    params: queryParams,
  });
}
