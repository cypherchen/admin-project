/*
 * @Author: cwx
 * @Date: 2026-01-18 17:30:00
 * @LastEditTime: 2026-01-18 19:35:50
 * @LastEditors: cwx
 * @Description: 项目库-项目查询 api
 */

import type { Recordable } from '@vben/types';

import type {
  BasicFetchResult,
  BasicModel,
  BasicParamsType,
} from '#/api/basicType';
import { requestClient } from '#/api/request';

export namespace ProjectRepositoryApi {
  export interface ProjectResult extends BasicModel {
    Name: string;
    Amount: number | null;
    Area: number | null;
    EconomicIndicators: number | null;
    APProjectBaseTree_ID: string;
  }

  export interface ProjectQueryParam {
    Name: string;
    InputType: number;
    Options?: string[] | null;
  }
}

/**
 * @description: 按条件查询项目库数据
 * @param {string} orgId 组织ID
 * @param {Recordable<any>} data 查询条件（基地、层级、参数等）
 * @param {BasicParamsType} params 额外查询参数（排序、分页等）
 * @return {Promise<BasicFetchResult<ProjectRepositoryApi.ProjectResult>>}
 */
export async function getProjectByFilter({
  orgId,
  data,
  params,
}: {
  orgId: string;
  data: Recordable<any>;
  params?: BasicParamsType;
}) {
  return requestClient.post<
    BasicFetchResult<ProjectRepositoryApi.ProjectResult>
  >(`api/APProjectBaseTree/${orgId}/GetProjectMergeData`, data, {
    params,
  });
}

/**
 * @description: 获取项目查询可用的参数配置列表
 * @param {string} baseId 基地ID
 * @param {Recordable<any>} params 额外查询参数
 * @return {Promise<BasicFetchResult<ProjectRepositoryApi.ProjectQueryParam>>}
 */
export async function getProjectQueryParams({
  baseId,
  params,
}: {
  baseId: string;
  params?: Recordable<any>;
}) {
  return requestClient.get<
    BasicFetchResult<ProjectRepositoryApi.ProjectQueryParam>
  >(`api/APParameterSettingMerge/${baseId}/GetCommon`, { params });
}
