/*
 * @Author: cwx
 * @Date: 2024-06-18 09:17:16
 * @LastEditTime: 2026-01-22 09:05:05
 * @LastEditors: cwx
 * @Description: 清单编制-清单核查api
 */
import type { Recordable } from '@vben/types';

import type { BasicFetchResult, BasicModel } from '#/api/basicType';

import { requestClient } from '#/api/request';

export namespace ListPreparationInspectApi {
  export interface InspectResult extends BasicModel {
    BCode: string;
    BName: string;
    BFeature: string;
    BUnit: string;
    BQuantity: number;
    BTree_ID: string;
    CCode: string;
    CName: string;
    CFeature: string;
    CUnit: string;
    CQuantity: number;
    CTree_ID: string;
    DifferenceRate: number;
    Result: string;
    IsTreePath: boolean;
    IsAddition: boolean;
    IsMissingItem: boolean;
    IsNameChange: boolean;
    IsFeatureChange: boolean;
    IsUnitChange: boolean;
    IsQuantityChange: boolean;
    IsPriceChange: boolean;
    Parent_ID: null | string;
    Sort: number;
  }

  export interface InspectSummary extends BasicModel {
    ComparedID: string;
    ComparedName: string;
    Addition: number;
    MissingItem: number;
    NameChange: number;
    FeatureChange: number;
    UnitChange: number;
    QuantityChange: number;
    PriceChange: number;
    Total: number;
    Version_ID: string;
    AuditStatus: number;
    SysLevel: number;
  }

  export interface InspectQuota {
    Code: string;
    Feature: string;
    Name: string;
  }
}

/**
 * @description: 保存清单核查历史项目
 * @param {string} vId 版本ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export function postListPreparationInspectHistory(
  vId: string,
  data: Recordable<any>,
) {
  return requestClient.post(`api/IPListCompared/${vId}`, data);
}

/**
 * @description: 查询需要核查的清单定额项
 * @param {string} vId 版本ID
 * @return {*}
 */
export function getListPreparationInspectQuota(vId: string) {
  return requestClient.get<
    BasicFetchResult<ListPreparationInspectApi.InspectQuota>
  >(`api/IPListComparedResult/${vId}/GetListQuota`);
}

/**
 * @description: 开始核查
 * @param {string} vId 版本ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export function postListPreparationInspectQuota(
  vId: string,
  data: Recordable<any>,
) {
  return requestClient.post<boolean>(`api/IPListComparedResult/${vId}`, data);
}

/**
 * @description: 统计问题数量
 * @param {string} vId 版本ID
 * @return {*}
 */
export function postListPreparationInspectQuestion(vId: string) {
  return requestClient.post<boolean>(
    `api/IPListComparedResult/${vId}/UpdateCompared`,
  );
}

/**
 * @description: 查询清单核查数据
 * @param {string} vId 版本ID
 * @param {string} compared 对比文件
 * @param {Recordable<any>} params
 * @return {*}
 */
export function getListPreparationInspect(
  vId: string,
  compared: string,
  params?: Recordable<any>,
) {
  return requestClient.post<ListPreparationInspectApi.InspectResult[]>(
    `api/IPListComparedResult/${vId}/GetInfo/${compared}`,
    {},
    {
      params,
    },
  );
}

/**
 * @description: 导出清单核查数据
 * @param {string} vId 版本ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export function exportListPreparationInspect(
  vId: string,
  data: Recordable<any>,
) {
  return requestClient.post(`api/IPListComparedResult/${vId}/Export`, data, {
    responseType: 'blob',
    responseReturn: 'body',
  });
}

/**
 * @description: 查询清单核查问题统计
 * @param {string} pId 项目ID
 * @param {string} vId 版本ID
 * @return {*}
 */
export function getListPreparationInspectSummary(pId: string, vId: string) {
  return requestClient.get<
    BasicFetchResult<ListPreparationInspectApi.InspectSummary>
  >(`api/IPListCompared/${vId}/${pId}`);
}
