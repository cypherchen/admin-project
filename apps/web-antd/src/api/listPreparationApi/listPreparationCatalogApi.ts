/*
 * @Author: cwx
 * @Date: 2025-03-14 23:53:02
 * @LastEditTime: 2026-01-21 11:56:18
 * @LastEditors: cwx
 * @Description: 清单编制内容api
 */
import type { Recordable } from '@vben/types';

import type {
  BasicFetchResult,
  BasicModel,
  BasicParamsType,
} from '#/api/basicType';

import { requestClient } from '#/api/request';

export namespace ListPreparationCatalogApi {
  export interface CatalogTreeResult extends BasicModel {
    Code: null | string;
    Name: string;
    Hierarchy: number;
    Parent_ID: null | string;
    NamePath: null | string;
    IDPath: string;
    IPProjectID: string;
    CopyTreeID: null | string;
    Specification: null | string;
    Version_ID: string;
  }
}

/**
 * @description: 新增目录树
 * @param {string} pId
 * @param {string} vId
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function postListPreparationCatalog(
  pId: string,
  vId: string,
  data: Recordable<any>,
) {
  return requestClient.post<ListPreparationCatalogApi.CatalogTreeResult>(
    `api/IPProjectTree/${pId}/${vId}`,
    data,
  );
}

/**
 * @description: 删除目录树
 * @param {string} pId
 * @param {string} vId
 * @param {string} id
 * @return {*}
 */
export async function deleteListPreparationCatalog(
  pId: string,
  vId: string,
  id: string,
) {
  return requestClient.delete<boolean>(`api/IPProjectTree/${pId}/${vId}/${id}`);
}

/**
 * @description: 修改目录树
 * @param {string} pId
 * @param {string} vId
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function putListPreparationCatalog(
  pId: string,
  vId: string,
  data: Recordable<any>,
) {
  return requestClient.put<ListPreparationCatalogApi.CatalogTreeResult>(
    `api/IPProjectTree/${pId}/${vId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询目录树
 * @param {string} pId
 * @param {string} vId
 * @param {BasicParamsType} params
 * @return {*}
 */
export async function getListPreparationCatalog({
  pId,
  vId,
  params,
}: {
  params?: BasicParamsType;
  pId: string;
  vId: string;
}) {
  return requestClient.get<
    BasicFetchResult<ListPreparationCatalogApi.CatalogTreeResult>
  >(`api/IPProjectTree/${pId}/${vId}`, { params });
}
