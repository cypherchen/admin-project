/*
 * @Author: cwx
 * @Date: 2026-01-17 13:00:00
 * @LastEditTime: 2026-01-17 19:11:06
 * @LastEditors: cwx
 * @Description: 清单编制-导入工程api
 */
import type { Recordable } from '@vben/types';

import type {
  BasicFetchResult,
  BasicModel,
  BasicParamsType,
} from '#/api/basicType';

import { requestClient } from '#/api/request';

export namespace ListPreparationImportApi {
  export interface ImportFileResult extends BasicModel {
    FileName: string;
    FileUrl: null | string;
    APProjectID: string;
    Version_ID: string;
  }

  export interface ImportFileTreeResult extends BasicModel {
    TaxTotalPrice: null | number;
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
 * @param options
 * @param options.vId 版本ID
 * @param options.params 查询参数
 */
export async function getListPreparationImportFile(
  options: {
    vId: string;
    params?: BasicParamsType;
  },
) {
  const { vId, params } = options;
  return requestClient.get<
    BasicFetchResult<ListPreparationImportApi.ImportFileResult>
  >(`api/IPImportFile/${vId}`, { params });
}

/**
 * @description: 删除导入工程文件
 * @param vId 版本ID
 * @param data
 */
export async function deleteListPreparationImportFile(
  vId: string,
  data: Recordable<any> | string[],
) {
  return requestClient.delete<boolean>(`api/IPImportFile/${vId}`, {
    data,
  });
}

/**
 * @description: 查询导入文件目录树
 * @param id 文件ID
 * @param params
 */
export async function getListPreparationImportFileTree(
  id: string,
  params?: BasicParamsType,
) {
  return requestClient.get<
    BasicFetchResult<ListPreparationImportApi.ImportFileTreeResult>
  >(`api/IPImportFileTree/${id}`, { params });
}

/**
 * @description: 移动文件目录树
 * @param treeId 当前项目目录树节点
 * @param data
 */
export async function moveListPreparationImportFileTree(
  treeId: string,
  data: Recordable<any> | string[],
) {
  return requestClient.post<boolean>(`api/IPImportFileTree/${treeId}`, data);
}

/**
 * @description: 保存导入数据
 * @param orgId 组织ID
 * @param pId 项目ID
 * @param vId 版本ID
 * @param data
 */
export async function saveListPreparationImportData(
  orgId: string,
  pId: string,
  vId: string,
  data: Recordable<any> | string[],
) {
  return requestClient.post<any>(
    `api/IPProjectVersion/${orgId}/${pId}/SaveImportInfo/${vId}`,
    data,
  );
}
