/*
 * @Author: cwx
 * @Date: 2024-10-23 16:23:51
 * @LastEditTime: 2026-01-17 12:30:00
 * @LastEditors: cwx
 * @Description: 物料管理api
 */
import type { Recordable } from '@vben/types';

import type { BasicFetchResult, BasicModel } from '#/api/basicType';
import { requestClient } from '#/api/request';

export namespace MaterialManagementApi {
  export interface MaterialResult extends BasicModel {
    MatCode: string;
    MatName: string;
    MatFeature: string;
  }
}

/**
 * @description: 查询物料
 * @param {*} params
 * @return {*}
 */
export async function getMaterial(params?: Recordable<any>) {
  return requestClient.get<
    BasicFetchResult<MaterialManagementApi.MaterialResult>
  >(`api/IPMaterialData`, { params });
}

/**
 * @description: 手动更新物料
 * @return {*}
 */
export async function postMaterialManualUpdate() {
  return requestClient.post<any>(`api/IPMaterialData/UpdataSSOTMaterialData`);
}
