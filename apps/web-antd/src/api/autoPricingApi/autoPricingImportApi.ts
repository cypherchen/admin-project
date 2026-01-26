/*
 * @Author: cwx
 * @Date: 2026-01-15 11:49:09
 * @LastEditTime: 2026-01-26 10:31:22
 * @LastEditors: cwx
 * @Description:
 */
import type { Recordable } from '@vben/types';

import type {
  BasicFetchResult,
  BasicModel,
  BasicParamsType,
} from '#/api/basicType';

import { requestClient } from '#/api/request';

export namespace AutoPricingImportApi {
  export interface ImportFileResult extends BasicModel {
    FileName: string;
    FileUrl: null | string;
    APProjectID: string;
    Version_ID: string;
  }

  export interface ImportFileTreeResult extends BasicModel {
    Code: null | string;
    PlanCode: null | string;
    Name: string;
    Type: number;
    Parent_ID: null | string;
    APImportFileID: string;
    APProjectID: string;
    Specification: null | string;
    NamePath: null | string;
    ExtraNamePath: null | string;
    IDPath: string;
    ExtraUnitNode: null | string;
    HighLevelExtraUnitNode: null | string;
    TZSY: null | string;
    Version_ID: string;
  }
}

/**
 * @description: 查询导入工程文件
 * @param params
 * @param params.vId 版本ID
 * @param params.params 查询参数
 * @return {*}
 */
export async function getAutoPricingImportFile(params: {
  params?: BasicParamsType;
  vId: string;
}) {
  const { vId, params: queryParams } = params;
  return requestClient.get<
    BasicFetchResult<AutoPricingImportApi.ImportFileResult>
  >(`api/APImportFile/${vId}`, {
    params: queryParams,
  });
}

/**
 * @description: 删除导入工程文件
 * @param {string} vId 版本ID
 * @param {string[]} data
 * @return {*}
 */
export async function deleteAutoPricingImportFile(
  vId: string,
  data: Recordable<any> | string[],
) {
  return requestClient.delete<boolean>(`api/APImportFile/${vId}`, {
    data,
  });
}

/**
 * @description: 查询导入文件目录树
 * @param id 文件ID
 * @param params
 */
export async function getAutoPricingImportFileTree(
  id: string,
  params?: BasicParamsType,
) {
  return requestClient.get<
    BasicFetchResult<AutoPricingImportApi.ImportFileTreeResult>
  >(`api/APImportFileTree/${id}`, {
    params,
  });
}

/**
 * @description: 移动文件目录树
 * @param {string} treeId 当前项目目录树节点
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function moveAutoPricingImportFileTree(
  treeId: string,
  data: Recordable<any> | string[],
) {
  return requestClient.post<boolean>(`api/APImportFileTree/${treeId}`, data);
}

/**
 * @description: 保存导入数据
 * @param {string} orgID 组织ID
 * @param {string} pId 项目ID
 * @param {string} vId 版本ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function saveAutoPricingImportData(
  orgID: string,
  pId: string,
  vId: string,
  data: Recordable<any> | string[],
) {
  return requestClient.post<any>(
    `api/APProjectVersion/${orgID}/${pId}/SaveImportInfo/${vId}`,
    data,
  );
}
