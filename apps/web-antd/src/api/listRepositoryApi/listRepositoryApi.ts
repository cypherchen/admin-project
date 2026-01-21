/*
 * @Author: cwx
 * @Date: 2024-04-03 15:06:41
 * @LastEditTime: 2026-01-19 16:53:25
 * @LastEditors: cwx
 * @Description: 清单库api
 */
import type { Recordable } from '@vben/types';

import type {
  BasicFetchResult,
  BasicModel,
  BasicParamsType,
} from '#/api/basicType';

import { requestClient } from '#/api/request';

export namespace ListRepositoryApi {
  export interface ListRepositoryModel extends BasicModel {
    Name: string;
    Type: string;
    Sort: number;
    AuditStatus: number;
    SysLevel: number;
    Orz_ID: string;
    CreatedUserInfo?: string;
    UpdatedUserInfo?: string;
  }

  export interface ListTreeModel extends BasicModel {
    Name: string;
    ShowName: string;
    Code: null | string;
    ParentCode: null | string;
    Parent_ID: null | string;
    Count: number;
    IsChild: boolean;
  }

  export interface ListModel extends BasicModel {
    Code: null | string;
    Name: string;
    Feature: null | string;
    Unit: string;
    UnitPrice: number;
    TaxUnitPrice: null | number;
    Number: null | number;
    CalculationRules: string;
    AdjustExplain: string;
    Remark: string;
    InventoryClass_ID: string;
    InventoryLibraryInfo_ID: string;
    InventoryMaterislDetailList: any | null;
    Xuhao: null | number;
    Sort: number;
    AuditStatus: number;
    SysLevel: number;
    Orz_ID: string;
    CreatedUserInfo?: string;
    UpdatedUserInfo?: string;
  }

  export interface MaterialCompositionModel extends BasicModel {
    Code: string;
    Name: string;
    Specification: string;
    Unit: string;
    Price: number;
    Number: number;
    Remark: null | string;
    InventoryList_ID: string;
    ProMaterislMachine_ID: string;
    Source: string;
    Sort: number;
    AuditStatus: number;
    SysLevel: number;
    Orz_ID: string;
    CreatedUserInfo?: string;
    UpdatedUserInfo?: string;
  }
}

/** *******************清单库台账*/

/**
 * @description: 新增清单库
 * @param {string} orgId
 * @param {Recordable<any>} data
 * @return {*}
 */
export function postListRepository(orgId: string, data: Recordable<any>) {
  return requestClient.post<ListRepositoryApi.ListRepositoryModel>(
    `api/${orgId}/InventoryLibraryInfo`,
    data,
  );
}

/**
 * @description: 删除清单库
 * @param {string} orgId
 * @param {string} id
 * @return {*}
 */
export function deleteListRepository(orgId: string, id: string) {
  return requestClient.delete<boolean>(
    `api/${orgId}/InventoryLibraryInfo/${id}`,
  );
}

/**
 * @description: 修改清单库
 * @param {string} orgId
 * @param {Recordable<any>} data
 * @return {*}
 */
export function putListRepository(orgId: string, data: Recordable<any>) {
  return requestClient.put<ListRepositoryApi.ListRepositoryModel>(
    `api/${orgId}/InventoryLibraryInfo/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询清单库
 * @param {object} options
 * @param {string} options.orgId
 * @param {BasicParamsType} options.params
 * @return {*}
 */
export function getListRepository({
  orgId,
  params,
}: {
  orgId: string;
  params: BasicParamsType;
}) {
  return requestClient.get<
    BasicFetchResult<ListRepositoryApi.ListRepositoryModel>
  >(`api/${orgId}/InventoryLibraryInfo`, {
    params,
  });
}

/** *******************清单库目录树*/

/**
 * @description: 新增清单库目录树
 * @param {string} orgId 组织ID
 * @param {string} warehouseID 库ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export function postListTree(
  orgId: string,
  warehouseID: string,
  data: Recordable<any>,
) {
  return requestClient.post<ListRepositoryApi.ListTreeModel>(
    `api/${orgId}/InventoryClass/${warehouseID}`,
    data,
  );
}

/**
 * @description: 删除清单库目录树
 * @param {string} orgId 组织ID
 * @param {string} warehouseID
 * @param {string[]} data
 * @return {*}
 */
export function deleteListTree(
  orgId: string,
  warehouseID: string,
  data: string[],
) {
  return requestClient.delete<boolean>(
    `api/${orgId}/InventoryClass/${warehouseID}`,
    {
      data,
    },
  );
}

/**
 * @description: 修改清单库目录树
 * @param {string} orgId
 * @param {string} warehouseID
 * @param {Recordable<any>} data
 * @return {*}
 */
export function putListTree(
  orgId: string,
  warehouseID: string,
  data: Recordable<any>,
) {
  return requestClient.put<ListRepositoryApi.ListTreeModel>(
    `api/${orgId}/InventoryClass/${warehouseID}/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询清单库目录树
 * @param {object} options
 * @param {string} options.orgId
 * @param {string} options.warehouseID
 * @param {BasicParamsType} options.params
 * @return {*}
 */
export function getListTree({
  orgId,
  warehouseID,
  params,
}: {
  orgId: string;
  params: BasicParamsType;
  warehouseID: string;
}) {
  return requestClient.get<BasicFetchResult<ListRepositoryApi.ListTreeModel>>(
    `api/${orgId}/InventoryClass/${warehouseID}`,
    {
      params,
    },
  );
}

/** *******************清单库*/

/**
 * @description: 新增清单
 * @param {string} orgId
 * @param {string} treeId
 * @param {Recordable<any>} data
 * @return {*}
 */
export function postList(orgId: string, treeId: string, data: Recordable<any>) {
  return requestClient.post<ListRepositoryApi.ListModel>(
    `api/${orgId}/InventoryList/${treeId}`,
    data,
  );
}

/**
 * @description: 删除清单
 * @param {string} orgId
 * @param {string} treeId
 * @param {string[]} data
 * @return {*}
 */
export function deleteList(orgId: string, treeId: string, data: string[]) {
  return requestClient.delete<boolean>(`api/${orgId}/InventoryList/${treeId}`, {
    data,
  });
}

/**
 * @description: 修改清单
 * @param {string} orgId
 * @param {string} treeId
 * @param {Recordable<any>} data
 * @return {*}
 */
export function putList(orgId: string, treeId: string, data: Recordable<any>) {
  return requestClient.put<ListRepositoryApi.ListModel>(
    `api/${orgId}/InventoryList/${treeId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询清单
 * @param {object} options
 * @param {string} options.orgId
 * @param {string} options.treeId
 * @param {BasicParamsType} options.params
 * @return {*}
 */
export function getList({
  orgId,
  treeId,
  params,
}: {
  orgId: string;
  params: BasicParamsType;
  treeId: string;
}) {
  return requestClient.get<BasicFetchResult<ListRepositoryApi.ListModel>>(
    `api/${orgId}/InventoryList/${treeId}`,
    {
      params,
    },
  );
}

/**
 * @description: 移动清单
 * @param {string} orgId 组织ID
 * @param {string} treeId 目录树ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export function moveList(orgId: string, treeId: string, data: Recordable<any>) {
  return requestClient.put<boolean>(
    `api/${orgId}/InventoryList/${treeId}/MoveData`,
    data,
  );
}

/**
 * @description: 导出清单
 * @param {string} orgId
 * @param {string} rId
 * @param {Recordable<any>} data
 * @return {*}
 */
export function exportList(orgId: string, rId: string, data: Recordable<any>) {
  return requestClient.post<Blob>(
    `api/${orgId}/InventoryClass/${rId}/Export`,
    data,
    {
      responseType: 'blob',
    },
  );
}

/**
 * @description: 刷新材料组成
 * @param {string} orgId 组织ID
 * @param {string} rId 清单库ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export function renewMaterialComposition(
  orgId: string,
  rId: string,
  data: Recordable<any>,
) {
  return requestClient.put<boolean>(
    `api/${orgId}/InventoryClass/${rId}/Renew`,
    data,
  );
}

/** *******************清单的材料组成*/

/**
 * @description: 新增材料组成
 * @param {string} orgId 组织ID
 * @param {string} listId 清单ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export function postMaterialComposition(
  orgId: string,
  listId: string,
  data: Recordable<any>,
) {
  return requestClient.post<ListRepositoryApi.MaterialCompositionModel>(
    `api/${orgId}/InventoryMaterislDetail/${listId}/BatchAdd`,
    data,
  );
}

/**
 * @description: 删除材料组成
 * @param {string} orgId 组织ID
 * @param {string} listId 清单ID
 * @param {string[]} data
 * @return {*}
 */
export function deleteMaterialComposition(
  orgId: string,
  listId: string,
  data: string[],
) {
  return requestClient.delete<boolean>(
    `api/${orgId}/InventoryMaterislDetail/${listId}`,
    {
      data,
    },
  );
}

/**
 * @description: 修改材料组成
 * @param {string} orgId 组织ID
 * @param {string} listId 清单ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export function putMaterialComposition(
  orgId: string,
  listId: string,
  data: Recordable<any>,
) {
  return requestClient.put<ListRepositoryApi.MaterialCompositionModel>(
    `api/${orgId}/InventoryMaterislDetail/${listId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 获取材料组成
 * @param {object} options
 * @param {string} options.orgId 组织ID
 * @param {string} options.listId 清单ID
 * @param {BasicParamsType} options.params
 * @return {*}
 */
export function getMaterialComposition({
  orgId,
  listId,
  params,
}: {
  listId: string;
  orgId: string;
  params: BasicParamsType;
}) {
  return requestClient.get<
    BasicFetchResult<ListRepositoryApi.MaterialCompositionModel>
  >(`api/${orgId}/InventoryMaterislDetail/${listId}`, {
    params,
  });
}
