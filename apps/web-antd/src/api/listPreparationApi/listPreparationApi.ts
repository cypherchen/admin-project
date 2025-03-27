/*
 * @Author: cwx
 * @Date: 2024-05-24 08:47:27
 * @LastEditTime: 2025-03-26 10:06:04
 * @LastEditors: cwx
 * @Description: 清单编制台账api
 */

import { requestClient } from '#/api/request';
import type { Recordable } from '@vben/types';
import type {
  BasicParamsType,
  BasicFetchResult,
  BasicModel,
} from '#/api/basicType';

export namespace ListPreparationApi {
  export interface ProjectResult extends BasicModel {
    APProjectBaseTree_ID: string;
    APProjectState: number;
    BaseTreeName: string;
    BaseTreeShortName: string | null;
    BaseTreeThirdPartyId: string | null;
    Code: string;
    CurrentTask: string | null;
    DutyUserCode: string | null;
    EndingTime: string | null;
    HistoryUsers: string | null;
    IPProjectState: number;
    IsEdit: boolean;
    Name: string;
    Parent_ID: string | null;
    PlanEndTime: string | null;
    PlanTime: string | null;
    ReportUserCode: string | null;
    ReportedUserID: string | null;
    ReportedUserName: string | null;
    ResponsibleUserID: string | null;
    ResponsibleUserName: string | null;
    StartUserName: string | null;
    Start_SysUser_ID: string | null;
    StartingTime: string | null;
    ThirdPartyId: string | null;
    Type: number | null;
  }

  export interface VersionResult extends BasicModel {
    IPProjectID: string;
    Label: string;
    Name: string;
    ParameterSettingTemplate_ID: string;
    ProjectName: string;
  }
}

/*********************清单编制台账*********************/

/**
 * @description: 新增清单编制台账
 * @param {string} orgId
 * @param {string} treeId
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function postListPreparation(
  orgId: string,
  treeId: string,
  data: Recordable<any>,
) {
  return requestClient.post<ListPreparationApi.ProjectResult>(
    `api/IPProject/${orgId}/${treeId}`,
    data,
  );
}

/**
 * @description: 删除清单编制台账
 * @param {string} orgId
 * @param {string} treeId
 * @param {string[]} data
 * @return {*}
 */
export async function deleteListPreparation(
  orgId: string,
  treeId: string,
  data: string[],
) {
  return requestClient.delete<boolean>(`api/IPProject/${orgId}/${treeId}`, {
    data,
  });
}

/**
 * @description: 修改清单编制台账
 * @param {string} orgId
 * @param {string} treeId
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function putListPreparation(
  orgId: string,
  treeId: string,
  data: Recordable<any>,
) {
  return requestClient.put<ListPreparationApi.ProjectResult>(
    `api/IPProject/${orgId}/${treeId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询清单编制台账
 * @param {string} orgId
 * @param {string} treeId
 * @param {BasicParamsType} params
 * @return {*}
 */
export async function getListPreparation({
  orgId,
  treeId,
  params,
}: {
  orgId: string;
  treeId: string;
  params?: BasicParamsType;
}) {
  return requestClient.get<BasicFetchResult<ListPreparationApi.ProjectResult>>(
    `api/IPProject/${orgId}/${treeId}`,
    { params },
  );
}

/**
 * @description: 通过项目ID查询项目详情
 * @param {string} orgId
 * @param {string} pId
 * @return {*}
 */
export async function getListPreparationByProjectID(
  orgId: string,
  pId: string,
) {
  return requestClient.get<BasicFetchResult<ListPreparationApi.ProjectResult>>(
    `api/IPProjectVersion/${orgId}/${pId}/GetProjectOnly`,
  );
}

/**
 * @description: 只需要Where条件的查询
 * @param {BasicParamsType} params
 * @return {*}
 */
export async function getListPreparationAll(params: BasicParamsType) {
  return requestClient.get<BasicFetchResult<ListPreparationApi.ProjectResult>>(
    `api/IPProjectIndex`,
    { params },
  );
}

/**
 * @description: 手动更新来自SSOT的数据
 * @return {*}
 */
export async function postListPreparationFromSSOT() {
  return requestClient.post<ListPreparationApi.ProjectResult>(
    `api/IPProjectIndex/UpdataSSOTData`,
  );
}

/**
 * @description: 判断是否可以提交
 * @param {string} pId
 * @return {*}
 */
export function getListPreparationCanSubmit(pId: string) {
  return requestClient.get<{ Value: boolean; Message: string }>(
    `api/IPProjectIndex/IsCanSubmit/${pId}`,
  );
}

/*********************清单编制版本*********************/

/**
 * @description: 新增版本
 * @param {string} orgId
 * @param {string} pId
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function postListPreparationVersion(
  orgId: string,
  pId: string,
  data: Recordable<any>,
) {
  return requestClient.post<ListPreparationApi.VersionResult>(
    `api/IPProjectVersion/${orgId}/${pId}`,
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
export async function deleteListPreparationVersion(
  orgId: string,
  pId: string,
  id: string,
) {
  return requestClient.delete<boolean>(
    `api/IPProjectVersion/${orgId}/${pId}/${id}`,
  );
}

/**
 * @description: 修改版本
 * @param {string} orgId
 * @param {string} pId
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function putListPreparationVersion(
  orgId: string,
  pId: string,
  data: Recordable<any>,
) {
  return requestClient.put<ListPreparationApi.VersionResult>(
    `api/IPProjectVersion/${orgId}/${pId}/${data.ID}`,
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
export async function getListPreparationVersion({
  orgId,
  pId,
  params,
}: {
  orgId: string;
  pId: string;
  params?: BasicParamsType;
}) {
  return requestClient.get<BasicFetchResult<ListPreparationApi.VersionResult>>(
    `api/IPProjectVersion/${orgId}/${pId}`,
    { params },
  );
}
