/*
 * @Author: cwx
 * @Date: 2026-01-22 11:20:00
 * @LastEditTime: 2026-01-26 11:21:37
 * @LastEditors: cwx
 * @Description: 指标分析台账api
 */
import type { Recordable } from '@vben/types';

import type {
  BasicFetchResult,
  BasicModel,
  BasicParamsType,
} from '#/api/basicType';

import { requestClient } from '#/api/request';

export namespace IndicatorAnalyzeApi {
  export interface ProjectResult extends BasicModel {
    Code: string;
    Name: string;
    Type: string;
    Parent_ID: null | string;
    APProjectState: number;
    APProjectStateShow: number;
    PlanTime: null | string;
    PlanEndTime: null | string;
    RLCPlanTime: null | string;
    RLCPlanEndTime: null | string;
    ResponsibleUserID: null | string;
    ResponsibleUserName: null | string;
    ReportedUserID: null | string;
    ReportedUserName: null | string;
    APProjectBaseTree_ID: string;
    Version_ID: string;
    IsMergeBase: boolean | null;
    ProjectMergeState: number;
    RLCAuditStatus: number;
    RLCProjectState: number;
    RLCID: null | string;
    RLCWorkflowInstance_ID: null | string;
    CompletionDate: null | string;
    TaxRate: null | number;
    CashPaymentCoefficient: null | number;
    BondPaymentCoefficient: null | number;
    IPProject_ID: null | string;
    BudgetPrice: null | number;
    ThirdPartyId: null | string;
    BaseTreeName: string;
    DutyUserCode: null | string;
    ReportUserCode: null | string;
    IsEdit: boolean;
    BaseTreeThirdPartyId: null | string;
    BaseTreeShortName: null | string;
    WorkflowInstance_ID: null | string;
    CurrentTask: null | string;
    HistoryUsers: null | string;
    Start_SysUser_ID: null | string;
    StartUserName: null | string;
    StartingTime: null | string;
    EndingTime: null | string;
  }

  export interface VersionResult extends BasicModel {
    TreeSettingTemplate_ID: null | string;
    Name: string;
    ProjectName: string;
    Label: string;
    FeeCollectionSettingTemplateID: null | string;
    APProjectID: string;
    ParameterSettingTemplate_ID: null | string;
    MinDeviationRate: null | number;
    MaxDeviationRate: null | number;
    RLCChoiceSupplierList: null | string;
    ChoiceSupPriceType: null | number;
    DifRateBasis: null | number;
    BusinessPriceWeight: null | number;
    TechnicalBidScoreWeight: null | number;
    PerformanceScoreWeight: null | number;
  }
}

/*********************指标分析台账*********************/

/**
 * @description: 新增指标分析台账
 * @param {string} orgId
 * @param {string} treeId
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function postIndicatorAnalyze(
  orgId: string,
  treeId: string,
  data: Recordable<any>,
) {
  return requestClient.post<IndicatorAnalyzeApi.ProjectResult>(
    `api/HPProject/${orgId}/${treeId}`,
    data,
  );
}

/**
 * @description: 删除指标分析台账
 * @param {string} orgId
 * @param {string} treeId
 * @param {string[]} data
 * @return {*}
 */
export async function deleteIndicatorAnalyze(
  orgId: string,
  treeId: string,
  data: string[],
) {
  return requestClient.delete<boolean>(`api/HPProject/${orgId}/${treeId}`, {
    data,
  });
}

/**
 * @description: 修改指标分析台账
 * @param {string} orgId
 * @param {string} treeId
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function putIndicatorAnalyze(
  orgId: string,
  treeId: string,
  data: Recordable<any>,
) {
  return requestClient.put<IndicatorAnalyzeApi.ProjectResult>(
    `api/HPProject/${orgId}/${treeId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询指标分析台账
 * @param {string} orgId
 * @param {string} treeId
 * @param {BasicParamsType} params
 * @return {*}
 */
export async function getIndicatorAnalyze({
  orgId,
  treeId,
  params,
}: {
  orgId: string;
  params?: BasicParamsType;
  treeId: string;
}) {
  return requestClient.get<BasicFetchResult<IndicatorAnalyzeApi.ProjectResult>>(
    `api/HPProject/${orgId}/${treeId}`,
    { params },
  );
}

/**
 * @description: 通过项目ID查询项目详情
 * @param {string} id
 * @return {*}
 */
export async function getIndicatorAnalyzeByProjectID(id: string) {
  return requestClient.get<BasicFetchResult<IndicatorAnalyzeApi.ProjectResult>>(
    `api/HPProjectIndex/${id}`,
  );
}

/*********************指标分析版本*********************/

/**
 * @description: 新增版本
 * @param {string} orgId
 * @param {string} pId
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function postIndicatorAnalyzeVersion(
  orgId: string,
  pId: string,
  data: Recordable<any>,
) {
  return requestClient.post<IndicatorAnalyzeApi.VersionResult>(
    `api/HPProjectVersion/${orgId}/${pId}`,
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
export async function deleteIndicatorAnalyzeVersion(
  orgId: string,
  pId: string,
  id: string,
) {
  return requestClient.delete<boolean>(
    `api/HPProjectVersion/${orgId}/${pId}/${id}`,
  );
}

/**
 * @description: 修改版本
 * @param {string} orgId
 * @param {string} pId
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function putIndicatorAnalyzeVersion(
  orgId: string,
  pId: string,
  data: Recordable<any>,
) {
  return requestClient.put<IndicatorAnalyzeApi.VersionResult>(
    `api/HPProjectVersion/${orgId}/${pId}/${data.ID}`,
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
export async function getIndicatorAnalyzeVersion({
  orgId,
  pId,
  params,
}: {
  orgId: string;
  params?: BasicParamsType;
  pId: string;
}) {
  return requestClient.get<BasicFetchResult<IndicatorAnalyzeApi.VersionResult>>(
    `api/HPProjectVersion/${orgId}/${pId}`,
    { params },
  );
}
