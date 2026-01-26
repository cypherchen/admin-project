/*
 * @Author: cwx
 * @Date: 2026-01-26 11:37:07
 * @LastEditTime: 2026-01-26 11:39:31
 * @LastEditors: cwx
 * @Description: 取费模板api
 */

import type { Recordable } from '@vben/types';

import type {
  BasicFetchResult,
  BasicModel,
  BasicParamsType,
} from '#/api/basicType';

import { requestClient } from '#/api/request';

export namespace FeeTemplateApi {
  export interface FeeTemplateResult extends BasicModel {
    Name: string;
  }

  export interface FeeTemplateContentResult extends BasicModel {
    Identification: string;
    Code: string;
    Name: string;
    Path: string;
    Rate: number;
    CalculationFormula: string;
    Parent_ID: null | string;
    FeeCollectionSettingTemplateID: string;
  }
}

/*********************取费模板台账*********************/

/**
 * @description: 新增取费模板
 * @param orgId 组织ID
 * @param data
 */
export async function postFeeTemplate(orgId: string, data: Recordable<any>) {
  return requestClient.post<boolean>(
    `api/FeeCollectionSettingTemplate/${orgId}`,
    data,
  );
}

/**
 * @description: 删除取费模板
 * @param orgId 组织ID
 * @param id
 */
export async function deleteFeeTemplate(orgId: string, id: string) {
  return requestClient.delete<boolean>(
    `api/FeeCollectionSettingTemplate/${orgId}/${id}`,
  );
}

/**
 * @description: 修改取费模板
 * @param orgId 组织ID
 * @param data
 */
export async function putFeeTemplate(orgId: string, data: Recordable<any>) {
  return requestClient.put<boolean>(
    `api/FeeCollectionSettingTemplate/${orgId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询取费模板
 * @param orgId 组织ID
 * @param params
 */
export async function getFeeTemplate(orgId: string, params?: BasicParamsType) {
  return requestClient.get<BasicFetchResult<FeeTemplateApi.FeeTemplateResult>>(
    `api/FeeCollectionSettingTemplate/${orgId}`,
    { params },
  );
}

/*********************取费模板详情*********************/

/**
 * @description: 新增费用
 * @param tId 模板ID
 * @param data
 */
export async function postFeeTemplateContent(
  tId: string,
  data: Recordable<any>,
) {
  return requestClient.post<boolean>(
    `api/FeeCollectionSettingContent/${tId}`,
    data,
  );
}

/**
 * @description: 删除费用
 * @param tId 模板ID
 * @param data
 */
export async function deleteFeeTemplateContent(
  tId: string,
  data: Recordable<any> | string[],
) {
  return requestClient.delete<boolean>(
    `api/FeeCollectionSettingContent/${tId}`,
    {
      data,
    },
  );
}

/**
 * @description: 修改费用
 * @param tId 模板ID
 * @param data
 */
export async function putFeeTemplateContent(
  tId: string,
  data: Recordable<any>,
) {
  return requestClient.put<boolean>(
    `api/FeeCollectionSettingContent/${tId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询费用
 * @param tId 模板ID
 * @param params
 */
export async function getFeeTemplateContent(
  tId: string,
  params?: BasicParamsType,
) {
  return requestClient.get<
    BasicFetchResult<FeeTemplateApi.FeeTemplateContentResult>
  >(`api/FeeCollectionSettingContent/${tId}`, {
    params,
  });
}
