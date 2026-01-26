/*
 * @Author: cwx
 * @Date: 2026-01-15 11:00:51
 * @LastEditTime: 2026-01-23 17:01:41
 * @LastEditors: cwx
 * @Description: 自动套价台账api
 */
import type { Recordable } from '@vben/types';

import type {
  BasicFetchResult,
  BasicModel,
  BasicParamsType,
} from '#/api/basicType';

import { requestClient } from '#/api/request';

export namespace AutoPricingApi {
  export interface ProjectResult extends BasicModel {
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

  export interface VersionResult extends BasicModel {
    Name: string;
    ProjectName: string;
    Label: string;
    FeeCollectionSettingTemplateID: string;
    APProjectID: string;
    ParameterSettingTemplate_ID: string;
    MinDeviationRate: number;
    MaxDeviationRate: number;
    RLCChoiceSupplierList: null | string;
    ChoiceSupPriceType: null | number;
    DifRateBasis: null | number;
    BusinessPriceWeight: null | number;
    TechnicalBidScoreWeight: null | number;
    PerformanceScoreWeight: null | number;
  }
}

/** *******************自动套价台账*/

/**
 * @description: 新增自动套价台账
 * @param {string} orgId
 * @param {string} treeId
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function postAutoPricing(
  orgId: string,
  treeId: string,
  data: Recordable<any>,
) {
  return requestClient.post<AutoPricingApi.ProjectResult>(
    `api/APProject/${orgId}/${treeId}`,
    data,
  );
}

/**
 * @description: 删除自动套价台账
 * @param {string} orgId
 * @param {string} treeId
 * @param {string[]} data
 * @return {*}
 */
export async function deleteAutoPricing(
  orgId: string,
  treeId: string,
  data: string[],
) {
  return requestClient.delete<boolean>(`api/APProject/${orgId}/${treeId}`, {
    data,
  });
}

/**
 * @description: 修改自动套价台账
 * @param {string} orgId
 * @param {string} treeId
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function putAutoPricing(
  orgId: string,
  treeId: string,
  data: Recordable<any>,
) {
  return requestClient.put<AutoPricingApi.ProjectResult>(
    `api/APProject/${orgId}/${treeId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询自动套价台账
 * @param {string} orgId
 * @param {string} treeId
 * @param {BasicParamsType} params
 * @return {*}
 */
export async function getAutoPricing({
  orgId,
  treeId,
  params,
}: {
  orgId: string;
  params?: BasicParamsType;
  treeId: string;
}) {
  return requestClient.get<BasicFetchResult<AutoPricingApi.ProjectResult>>(
    `api/APProject/${orgId}/${treeId}`,
    { params },
  );
}

/**
 * @description: 通过项目ID查询项目详情
 * @param {string} id
 * @return {*}
 */
export async function getAutoPricingByProjectID(id: string) {
  return requestClient.get<BasicFetchResult<AutoPricingApi.ProjectResult>>(
    `api/APProjectIndex/${id}`,
  );
}

/**
 * @description: 查询项目来源 0：线上 1：线下
 * @param {string} id
 * @return {*}
 */
export async function getAutoPricingProjectSource(id: string) {
  return requestClient.get<number>(`api/GetSourceType/${id}`);
}

/** *******************自动套价版本*/

/**
 * @description: 新增版本
 * @param {string} orgId
 * @param {string} pId
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function postAutoPricingVersion(
  orgId: string,
  pId: string,
  data: Recordable<any>,
) {
  return requestClient.post<AutoPricingApi.VersionResult>(
    `api/APProjectVersion/${orgId}/${pId}`,
    data,
  );
}

/**
 * @description: 删除版本
 * @param {string} orgId
 * @param {string} pId
 * @param {string} id
 * @return {*}
 */
export async function deleteAutoPricingVersion(
  orgId: string,
  pId: string,
  id: string,
) {
  return requestClient.delete<boolean>(
    `api/APProjectVersion/${orgId}/${pId}/${id}`,
  );
}

/**
 * @description: 修改版本
 * @param {string} orgId
 * @param {string} pId
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function putAutoPricingVersion(
  orgId: string,
  pId: string,
  data: Recordable<any>,
) {
  return requestClient.put<AutoPricingApi.VersionResult>(
    `api/APProjectVersion/${orgId}/${pId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询版本
 * @param {string} orgId
 * @param {string} pId
 * @param {BasicParamsType} params
 * @return {*}
 */
export async function getAutoPricingVersion({
  orgId,
  pId,
  params,
}: {
  orgId: string;
  params?: BasicParamsType;
  pId: string;
}) {
  return requestClient.get<BasicFetchResult<AutoPricingApi.VersionResult>>(
    `api/APProjectVersion/${orgId}/${pId}`,
    { params },
  );
}
