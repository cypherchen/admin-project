/*
 * @Author: cwx
 * @Date: 2024-06-04 17:39:01
 * @LastEditTime: 2026-01-20 20:48:52
 * @LastEditors: cwx
 * @Description: 清单编制-项目清单api
 */
import type { Recordable } from '@vben/types';

import type {
  BasicFetchResult,
  BasicModel,
  BasicParamsType,
} from '#/api/basicType';

import { requestClient } from '#/api/request';

export namespace ListPreparationListApi {
  export interface ListResult extends BasicModel {
    Code: string;
    Name: string;
    Feature: string;
    Unit: string;
    Number: number;
    OldNumber: null | number;
    Source: string;
    Remark: null | string;
    IPProjectTreeID: string;
    IPProjectID: string;
    SourceType: number;
    SourceID: string;
    Parent_ID: null | string;
    Version_ID: string;
    AuditStatus: number;
    SysLevel: number;
  }

  export interface FormulaResult extends BasicModel {
    Explain: string;
    Formula: null | string;
    Result: number;
    IsAccrual: boolean;
    IPProjectListID: string;
    IPProjectTreeID: string;
    IPProjectID: string;
    Version_ID: string;
    AuditStatus: number;
    SysLevel: number;
  }
}

/**
 * @description: 新增项目清单
 * @param {string} vId 版本ID
 * @param {string} treeId 目录树ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export function postListPreparationList(
  vId: string,
  treeId: string,
  data: Recordable<any>,
) {
  return requestClient.post<ListPreparationListApi.ListResult>(
    `api/IPProjectList/${vId}/${treeId}`,
    data,
  );
}

/**
 * @description: 批量添加项目清单
 * @param {string} vId 版本ID
 * @param {string} treeId 目录树ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export function batchPostListPreparationList(
  vId: string,
  treeId: string,
  data: Recordable<any>,
) {
  return requestClient.post<boolean>(
    `api/IPProjectList/${vId}/${treeId}/BatchAddByOther`,
    data,
  );
}

/**
 * @description: 删除项目清单
 * @param {string} vId 版本ID
 * @param {string} treeId 目录树ID
 * @param {string[]} data
 * @return {*}
 */
export function deleteListPreparationList(
  vId: string,
  treeId: string,
  data: string[],
) {
  return requestClient.delete<boolean>(`api/IPProjectList/${vId}/${treeId}`, {
    data,
  });
}

/**
 * @description: 修改项目清单
 * @param {string} vId 版本ID
 * @param {string} treeId 目录树ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export function putListPreparationList(
  vId: string,
  treeId: string,
  data: Recordable<any>,
) {
  return requestClient.put<ListPreparationListApi.ListResult>(
    `api/IPProjectList/${vId}/${treeId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 替换项目清单
 * @param {string} vId 版本ID
 * @param {string} treeId 目录树ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export function putListPreparationListReplace(
  vId: string,
  treeId: string,
  data: Recordable<any>,
) {
  return requestClient.put<boolean>(
    `api/IPProjectList/${vId}/${treeId}/ReplaceData`,
    data,
  );
}

/**
 * @description: 查询项目清单
 * @param {object} options
 * @param {string} options.vId 版本ID
 * @param {string} options.treeId 目录树ID
 * @param {BasicParamsType} options.params
 * @return {*}
 */
export function getListPreparationList({
  vId,
  treeId,
  params,
}: {
  params: BasicParamsType;
  treeId: string;
  vId: string;
}) {
  return requestClient.get<BasicFetchResult<ListPreparationListApi.ListResult>>(
    `api/IPProjectList/${vId}/${treeId}`,
    {
      params,
    },
  );
}

/**
 * @description: 导出项目清单
 * @param {string} orgId 组织ID
 * @param {string} pId 项目ID
 * @param {string} vId 版本ID
 * @return {*}
 */
export function exportListPreparationList(
  orgId: string,
  pId: string,
  vId: string,
) {
  return requestClient.get<Blob>(
    `api/IPProjectVersion/${orgId}/${pId}/ExportList/${vId}`,
    {
      responseType: 'blob',
      responseReturn: 'body',
    },
  );
}

/**
 * @description: 导出报价清单
 * @param {string} orgId 组织ID
 * @param {string} pId 项目ID
 * @param {string} vId 版本ID
 * @return {*}
 */
export function exportListPreparationQuoteList(
  orgId: string,
  pId: string,
  vId: string,
) {
  return requestClient.get<Blob>(
    `api/IPProjectVersion/${orgId}/${pId}/ExportFinalList/${vId}`,
    {
      responseType: 'blob',
      responseReturn: 'body',
    },
  );
}

/** *******************计算式*/

/**
 * @description: 新增计算式
 * @param {string} listId 清单ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export function postListPreparationListFormula(
  listId: string,
  data: Recordable<any>,
) {
  return requestClient.post<ListPreparationListApi.FormulaResult>(
    `api/IPProjectFormula/${listId}`,
    data,
  );
}

/**
 * @description: 删除计算式
 * @param {string} listId 清单ID
 * @param {string[]} data
 * @return {*}
 */
export function deleteListPreparationListFormula(
  listId: string,
  data: string[],
) {
  return requestClient.delete<boolean>(`api/IPProjectFormula/${listId}`, {
    data,
  });
}

/**
 * @description: 修改计算式
 * @param {string} listId 清单ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export function putListPreparationListFormula(
  listId: string,
  data: Recordable<any>,
) {
  return requestClient.put<ListPreparationListApi.FormulaResult>(
    `api/IPProjectFormula/${listId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 获取计算式
 * @param {object} options
 * @param {string} options.listId 清单ID
 * @param {BasicParamsType} options.params
 * @return {*}
 */
export function getListPreparationListFormula({
  listId,
  params,
}: {
  listId: string;
  params: BasicParamsType;
}) {
  return requestClient.get<
    BasicFetchResult<ListPreparationListApi.FormulaResult>
  >(`api/IPProjectFormula/${listId}`, {
    params,
  });
}
