/*
 * @Author: cwx
 * @Date: 2024-03-28 09:33:26
 * @LastEditTime: 2026-01-19 17:07:18
 * @LastEditors: cwx
 * @Description: 材料库api
 */
import type { Recordable } from '@vben/types';

import type {
  BasicFetchResult,
  BasicModel,
  BasicParamsType,
} from '#/api/basicType';

import { requestClient } from '#/api/request';

export namespace MaterialRepositoryApi {
  export interface MaterialRepositoryModel extends BasicModel {
    Name: string;
    Code: null | string;
    CreatedUserInfo?: string;
    UpdatedUserInfo?: string;
    Sort: number;
    AuditStatus: number;
    SysLevel: number;
    Orz_ID: string;
  }

  export interface MaterialTreeModel extends BasicModel {
    Name: string;
    ShowName: string;
    Code: null | string;
    ParentCode: null | string;
    Parent_ID: null | string;
    Count: number;
    IsAdd: boolean;
    IsChild: boolean;
  }

  export interface MaterialModel extends BasicModel {
    Code: string;
    Name: string;
    Specification: string;
    Unit: string;
    VatPrice: number;
    Price: number;
    VatRate: number;
    InfoPrice: number;
    Deadline: null | string;
    Region: string;
    ProjectSource: null | string;
    Source: string;
    CreatedName: string;
    Remark: null | string;
    Position: null | string;
    Property: null | string;
    Brand: string;
    Supplier: string;
    SupplierAddress: null | string;
    ContactInformation: null | string;
    Stage: null | string;
    InquiryTime: string;
    BusinessType: null | string;
    BusinessName: null | string;
    IsMove: boolean;
    LinkAddress: null | string;
    CalibrationTime: null | string;
    Picture: null | string;
    Annex: null | string;
    CopperPrice: number;
    SiliconSteelPrice: number;
    AluminumPrice: number;
    InstallationFee: number;
    Sort: number;
    OriginalCode: null | string;
    CurrencyType: null | string;
    Tariff: null | number;
    Country: null | string;
    Freight: null | number;
  }

  export interface MaterialHistoryModel extends BasicModel {
    Name: string;
    Specification: string;
    Unit: string;
    VatPrice: number;
    Price: number;
    VatRate: number;
    InfoPrice: number;
    Deadline: null | string;
    Region: string;
    ProjectSource: null | string;
    Source: string;
    CreatedName: string;
    Remark: null | string;
    Position: null | string;
    Property: null | string;
    Brand: string;
    Supplier: string;
    SupplierAddress: null | string;
    ContactInformation: null | string;
    Stage: null | string;
    InquiryTime: string;
    BusinessType: null | string;
    BusinessName: null | string;
    LinkAddress: null | string;
    CalibrationTime: null | string;
    Picture: null | string;
    Annex: null | string;
    CopperPrice: number;
    SiliconSteelPrice: number;
    AluminumPrice: number;
    InstallationFee: number;
    Code: string;
    CurrencyType: null | string;
    Tariff: null | number;
    Country: null | string;
    Freight: null | number;
  }

  export interface MaterialMinPriceModel extends BasicModel {
    Code: string;
    Name: string;
    Specification: string;
    Unit: string;
    VatPrice: number;
    VatRate: number;
    InfoPrice: number;
    Deadline: null | string;
    Region: string;
    ProjectSource: null | string;
    Source: string;
    CreatedName: string;
    Remark: null | string;
    Position: null | string;
    Property: null | string;
    Brand: string;
    Supplier: string;
    SupplierAddress: null | string;
    ContactInformation: null | string;
    Stage: null | string;
    InquiryTime: string;
    BusinessType: null | string;
    IsMove: boolean;
    LinkAddress: null | string;
    CalibrationTime: null | string;
    Picture: null | string;
    Annex: null | string;
    CopperPrice: number;
    SiliconSteelPrice: number;
    AluminumPrice: number;
    InstallationFee: number;
    Sort: number;
    Price: number;
  }
}

/** *******************材料库台账*/

/**
 * @description: 新增材料库
 * @param {string} orgId
 * @param {Recordable<any>} data
 * @return {*}
 */
export function postMaterialRepository(orgId: string, data: Recordable<any>) {
  return requestClient.post<MaterialRepositoryApi.MaterialRepositoryModel>(
    `api/ProMaterialWarehouse/${orgId}`,
    data,
  );
}

/**
 * @description: 删除材料库
 * @param {string} orgId
 * @param {string} id
 * @return {*}
 */
export function deleteMaterialRepository(orgId: string, id: string) {
  return requestClient.delete<boolean>(
    `api/ProMaterialWarehouse/${orgId}/${id}`,
  );
}

/**
 * @description: 修改材料库
 * @param {string} orgId
 * @param {Recordable<any>} data
 * @return {*}
 */
export function putMaterialRepository(orgId: string, data: Recordable<any>) {
  return requestClient.put<MaterialRepositoryApi.MaterialRepositoryModel>(
    `api/ProMaterialWarehouse/${orgId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询材料库
 * @param {object} options
 * @param {string} options.orgId
 * @param {BasicParamsType} options.params
 * @return {*}
 */
export function getMaterialRepository({
  orgId,
  params,
}: {
  orgId: string;
  params: BasicParamsType;
}) {
  return requestClient.get<
    BasicFetchResult<MaterialRepositoryApi.MaterialRepositoryModel>
  >(`api/ProMaterialWarehouse/${orgId}`, {
    params,
  });
}

/** *******************材料库目录树*/

/**
 * @description: 新增材料库目录树
 * @param {string} warehouseID 库ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export function postMaterialTree(warehouseID: string, data: Recordable<any>) {
  return requestClient.post<MaterialRepositoryApi.MaterialTreeModel>(
    `api/ProMaterislList/${warehouseID}`,
    data,
  );
}

/**
 * @description: 删除材料库目录树
 * @param {string} warehouseID
 * @param {string[]} data
 * @return {*}
 */
export function deleteMaterialTree(warehouseID: string, data: string[]) {
  return requestClient.delete<boolean>(`api/ProMaterislList/${warehouseID}`, {
    data,
  });
}

/**
 * @description: 修改材料库目录树
 * @param {string} warehouseID
 * @param {Recordable<any>} data
 * @return {*}
 */
export function putMaterialTree(warehouseID: string, data: Recordable<any>) {
  return requestClient.put<MaterialRepositoryApi.MaterialTreeModel>(
    `api/ProMaterislList/${warehouseID}/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询材料库目录树
 * @param {object} options
 * @param {string} options.warehouseID
 * @param {BasicParamsType} options.params
 * @return {*}
 */
export function getMaterialTree({
  warehouseID,
  params,
}: {
  params: BasicParamsType;
  warehouseID: string;
}) {
  return requestClient.get<
    BasicFetchResult<MaterialRepositoryApi.MaterialTreeModel>
  >(`api/ProMaterislList/${warehouseID}`, {
    params,
  });
}

/**
 * @description: 批量新增材料库目录树
 * @param {string} warehouseID
 * @param {Recordable<any>} data
 * @return {*}
 */
export function postMaterialTreeBatch(
  warehouseID: string,
  data: Recordable<any>,
) {
  return requestClient.post<boolean>(
    `api/ProMaterislList/${warehouseID}/BatchAdd`,
    data,
  );
}

/** *******************材料库*/

/**
 * @description: 新增材料
 * @param {Recordable<any>} data
 * @return {*}
 */
export function postMaterial(data: Recordable<any>) {
  return requestClient.post<MaterialRepositoryApi.MaterialModel>(
    `api/ProMaterislMachine`,
    data,
  );
}

/**
 * @description: 删除材料
 * @param {string[]} data
 * @return {*}
 */
export function deleteMaterial(data: string[]) {
  return requestClient.delete<boolean>(`api/ProMaterislMachine`, {
    data,
  });
}

/**
 * @description: 修改材料
 * @param {Recordable<any>} data
 * @return {*}
 */
export function putMaterial(data: Recordable<any>) {
  return requestClient.put<MaterialRepositoryApi.MaterialModel>(
    `api/ProMaterislMachine`,
    data,
  );
}

/**
 * @description: 批量修改材料
 * @param {Recordable<any>} data {IdList:[],Machine:{}}
 * @return {*}
 */
export function batchUpdateMaterial(data: Recordable<any>) {
  return requestClient.put<boolean>(`api/ProMaterislMachine/BatchUpdate`, data);
}

/**
 * @description: 查询材料
 * @param {object} options
 * @param {string} options.treeId
 * @param {BasicParamsType} options.params
 * @return {*}
 */
export function getMaterial({
  treeId,
  params,
}: {
  params: BasicParamsType;
  treeId: string;
}) {
  return requestClient.get<
    BasicFetchResult<MaterialRepositoryApi.MaterialModel>
  >(`api/ProMaterislMachine/GetList/${treeId}`, {
    params,
  });
}

/**
 * @description: 查询材料的最低价
 * @param {object} options
 * @param {string} options.treeId
 * @param {BasicParamsType} options.params
 * @return {*}
 */
export function getMaterialMinPrice({
  treeId,
  params,
}: {
  params: BasicParamsType;
  treeId: string;
}) {
  return requestClient.get<
    BasicFetchResult<MaterialRepositoryApi.MaterialMinPriceModel>
  >(`api/ProMaterislMachine/GetMinPriceList/${treeId}`, {
    params,
  });
}

/**
 * @description: 批量移动材料
 * @param {Recordable<any>} data
 * @return {*}
 */
export function moveMaterial(data: Recordable<any>) {
  return requestClient.put<boolean>(
    `api/ProMaterislMachine/MoveMaterisl`,
    data,
  );
}

/**
 * @description: 获取材料历史价格
 * @param {object} options
 * @param {string} options.id
 * @param {BasicParamsType} options.params
 * @return {*}
 */
export function getMaterialHistory({
  id,
  params,
}: {
  id: string;
  params: BasicParamsType;
}) {
  return requestClient.get<
    BasicFetchResult<MaterialRepositoryApi.MaterialHistoryModel>
  >(`api/ProMaterislMachine/GetHistory/${id}`, {
    params,
  });
}

/**
 * @description: 删除历史价格
 * @param {string[]} data
 * @return {*}
 */
export function deleteMaterialHistory(data: string[]) {
  return requestClient.delete<boolean>(
    `/api/ProMaterislMachine/DeleteHistory`,
    {
      data,
    },
  );
}

/**
 * @description: 导入excel数据
 * @param {object} options
 * @param {string} options.warehouseID
 * @param {Recordable<any>} options.data
 * @return {*}
 */
export function importMaterial({
  warehouseID,
  data,
}: {
  data: Recordable<any>;
  warehouseID: string;
}) {
  return requestClient.post<boolean>(
    `api/ProMaterislMachine/Insert/${warehouseID}`,
    data,
  );
}

/**
 * @description: 验证材料数据
 * @param {object} options
 * @param {string} options.warehouseID
 * @param {Recordable<any>} options.data
 * @return {*}
 */
export function validateMaterial({
  warehouseID,
  data,
}: {
  data: Recordable<any>;
  warehouseID: string;
}) {
  return requestClient.post<any>(
    `api/ProMaterislMachine/VerificationMaterials/${warehouseID}`,
    data,
  );
}

/**
 * @description: 保存材料数据
 * @param {Recordable<any>} data
 * @return {*}
 */
export function saveMaterial(data: Recordable<any>) {
  return requestClient.post<boolean>(
    `api/ProMaterislMachine/SaveMaterial`,
    data,
  );
}
/**
 * @description: 导出材料
 * @param {Recordable<any>} data
 * @return {*}
 */
export function exportMaterial(data: Recordable<any>) {
  return requestClient.post<Blob>(`api/ProMaterislMachine/Export`, data, {
    responseType: 'blob',
  });
}
