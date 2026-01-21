/*
 * @Author: cwx
 * @Date: 2026-01-17 00:00:00
 * @LastEditTime: 2026-01-17 00:00:00
 * @LastEditors: cwx
 * @Description: 业态管理api
 */
import type { Recordable } from '@vben/types';

import type { BasicFetchResult, BasicModel } from '#/api/basicType';

import { requestClient } from '#/api/request';

export namespace BusinessManagementApi {
  export interface BusinessResult extends BasicModel {
    Code: string;
    Name: string;
    Hierarchy: number;
    Parent_ID: string;
    NamePath: string;
    IDPath: string;
    CopyTreeID: null | string;
  }
}

/**
 * @description: 新增业态
 * @param orgId 组织ID
 * @param data
 */
export async function postBusiness(orgId: string, data: Recordable<any>) {
  return requestClient.post<BusinessManagementApi.BusinessResult>(
    `api/ProjectBusinessTree/${orgId}`,
    data,
  );
}

/**
 * @description: 复制单项
 * @param orgId 组织ID
 * @param data CopyTreeID TargetTreeID
 */
export async function copyBusiness(
  orgId: string,
  data: { CopyTreeID: string; TargetTreeID: string },
) {
  return requestClient.post<boolean>(
    `api/ProjectBusinessTree/${orgId}/CopyChild`,
    null,
    {
      params: {
        CopyTreeID: data.CopyTreeID,
        TargetTreeID: data.TargetTreeID,
      },
    },
  );
}

/**
 * @description: 删除业态
 * @param orgId 组织ID
 * @param id
 */
export async function deleteBusiness(orgId: string, id: string) {
  return requestClient.delete<boolean>(
    `api/ProjectBusinessTree/${orgId}/${id}`,
  );
}

/**
 * @description: 修改业态
 * @param orgId 组织ID
 * @param data
 */
export async function putBusiness(orgId: string, data: Recordable<any>) {
  return requestClient.put<BusinessManagementApi.BusinessResult>(
    `api/ProjectBusinessTree/${orgId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询业态
 * @param orgId 组织ID
 * @param params
 */
export async function getBusiness({
  orgId,
  params,
}: {
  orgId: string;
  params?: Recordable<any>;
}) {
  return requestClient.get<
    BasicFetchResult<BusinessManagementApi.BusinessResult>
  >(`api/ProjectBusinessTree/${orgId}`, { params });
}
