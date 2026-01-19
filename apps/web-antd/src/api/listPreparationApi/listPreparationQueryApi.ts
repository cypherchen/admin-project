/*
 * @Author: cwx
 * @Date: 2026-01-18 00:00:00
 * @LastEditTime: 2026-01-18 00:00:00
 * @LastEditors: cwx
 * @Description: 清单编制-项目查询api
 */
import type { Recordable } from '@vben/types';

import type {
  BasicFetchResult,
  BasicModel,
  BasicParamsType,
} from '#/api/basicType';

import { requestClient } from '#/api/request';

export namespace ListPreparationQueryApi {
  export interface QueryResult extends BasicModel {
    Name: string;
    IsUse: boolean;
    APProjectTreeMergeID: string;
    IPProjectTreeID: string;
    IPProjectID: string;
    Version_ID: string;
  }
}

/**
 * @description: 新增项目查询
 * @param {string} treeId 目录树ID
 * @param {string} vId 版本ID
 * @param {Recordable<any>} data 提交数据
 * @return {*}
 */
export async function postListPreparationQuery(
  treeId: string,
  vId: string,
  data: Recordable<any>,
) {
  return requestClient.post<ListPreparationQueryApi.QueryResult>(
    `api/IPProjectQuery/${treeId}/Add/${vId}`,
    data,
  );
}

/**
 * @description: 删除项目查询
 * @param {string} treeId 目录树ID
 * @param {string} id 项目查询ID
 * @return {*}
 */
export async function deleteListPreparationQuery(treeId: string, id: string) {
  return requestClient.delete<boolean>(`api/IPProjectQuery/${treeId}/${id}`);
}

/**
 * @description: 修改项目查询
 * @param {string} treeId 目录树ID
 * @param {Recordable<any>} data 提交数据（包含项目查询ID）
 * @return {*}
 */
export async function putListPreparationQuery(
  treeId: string,
  data: Recordable<any>,
) {
  return requestClient.put<ListPreparationQueryApi.QueryResult>(
    `api/IPProjectQuery/${treeId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 获取项目查询
 * @param {object} options
 * @param {string} options.treeId 目录树ID
 * @param {BasicParamsType} options.params 查询参数
 * @return {*}
 */
export async function getListPreparationQuery(options: {
  params?: BasicParamsType;
  treeId: string;
}) {
  const { treeId, params } = options;
  return requestClient.get<
    BasicFetchResult<ListPreparationQueryApi.QueryResult>
  >(`api/IPProjectQuery/${treeId}`, { params });
}
