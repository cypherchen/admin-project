/*
 * @Author: cwx
 * @Date: 2026-01-26 11:43:44
 * @LastEditTime: 2026-01-26 11:48:53
 * @LastEditors: cwx
 * @Description: 自动套价-取费设置api
 */
import type { Recordable } from '@vben/types';

import type {
  BasicFetchResult,
  BasicModel,
  BasicParamsType,
} from '#/api/basicType';

import { requestClient } from '#/api/request';

export namespace AutoPricingFeeApi {
  export interface FeeResult extends BasicModel {
    Identification: string;
    Code: null | string;
    Name: string;
    Path: string;
    Rate: number;
    CalculationFormula: string;
    Parent_ID: null | string;
    APProjectTreeID: string;
    APProjectID: string;
    FeeCollectionSettingTemplateID: string;
    OldID: string;
    Version_ID: string;
  }
}

/**
 * @description: 新增取费设置
 * @param vId 版本ID
 * @param tId 模板ID
 * @param treeId 目录树ID
 * @param data
 */
export async function postAutoPricingFee(
  vId: string,
  tId: string,
  treeId: string,
  data: Recordable<any>,
) {
  return requestClient.post<boolean>(
    `api/APFeeCollectionSetting/${vId}/${tId}/${treeId}`,
    data,
  );
}

/**
 * @description: 删除取费设置
 * @param vId 版本ID
 * @param data
 */
export async function deleteAutoPricingFee(
  vId: string,
  data: Recordable<any> | string[],
) {
  return requestClient.delete<boolean>(`api/APFeeCollectionSetting/${vId}`, {
    data,
  });
}

/**
 * @description: 修改取费设置
 * @param vId 版本ID
 * @param data
 */
export async function putAutoPricingFee(vId: string, data: Recordable<any>) {
  return requestClient.put<boolean>(
    `api/APFeeCollectionSetting/${vId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询取费设置
 * @param params
 * @param params.vId 版本ID
 * @param params.tId 模板ID
 * @param params.treeId 目录树ID
 * @param params.params 查询参数
 */
export async function getAutoPricingFee(params: {
  params?: BasicParamsType;
  tId: string;
  treeId: string;
  vId: string;
}) {
  const { vId, tId, treeId, params: queryParams } = params;
  return requestClient.get<BasicFetchResult<AutoPricingFeeApi.FeeResult>>(
    `api/APFeeCollectionSetting/${vId}/${tId}/${treeId}`,
    {
      params: queryParams,
    },
  );
}

/**
 * @description: 获取当前版本使用取费模板
 * @param vId 版本ID
 */
export async function getAutoPricingFeeTemplate(vId: string) {
  return requestClient.get<Record<string, any>>(
    `api/APFeeCollectionSetting/${vId}/GetTemplateInfo`,
  );
}

/**
 * @description: 设置取费模板
 * @param vId 版本ID
 * @param params
 * @param params.templateId 模板ID
 */
export async function setAutoPricingFeeTemplate(
  vId: string,
  params: { templateId: string },
) {
  return requestClient.put<boolean>(
    `api/APFeeCollectionSetting/${vId}/SwitchTemplate`,
    null,
    {
      params,
    },
  );
}

/**
 * @description: 移动取费设置顺序
 * @param vId 版本ID
 * @param id
 * @param params
 * @param params.type 移动方向（0-置于首位；1-上移；2-下移；3-置于末位）
 */
export async function moveAutoPricingFee(
  vId: string,
  id: string,
  params: { type: number },
) {
  return requestClient.put<boolean>(
    `api/APFeeCollectionSetting/${vId}/Mobile/${id}`,
    null,
    {
      params,
    },
  );
}

/**
 * @description: 同步取费设置
 * @param vId 版本ID
 * @param treeId 目录树ID
 * @param data
 */
export async function syncAutoPricingFee(
  vId: string,
  treeId: string,
  data: Recordable<any> | string[],
) {
  return requestClient.put<boolean>(
    `api/APFeeCollectionSetting/${vId}/Synchronization/${treeId}`,
    data,
  );
}
