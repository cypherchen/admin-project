/*
 * @Author: cwx
 * @Date: 2025-03-14 23:53:02
 * @LastEditTime: 2025-03-15 00:06:06
 * @LastEditors: cwx
 * @Description: 清单编制内容api
 */
import { requestClient } from '#/api/request';
import type { Recordable } from '@vben/types';
import type {
  BasicParamsType,
  BasicFetchResult,
  BasicModel,
} from '#/api/basicType';

export namespace ListPreparationContentApi {
  export interface CatalogTreeResult extends BasicModel {}
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
  return requestClient.post<ListPreparationContentApi.CatalogTreeResult>(
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
  return requestClient.put<ListPreparationContentApi.CatalogTreeResult>(
    `api/IPProjectTree/${pId}/${vId}`,
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
  pId: string;
  vId: string;
  params?: BasicParamsType;
}) {
  return requestClient.get<
    BasicFetchResult<ListPreparationContentApi.CatalogTreeResult>
  >(`api/IPProjectTree/${pId}/${vId}`, { params });
}
