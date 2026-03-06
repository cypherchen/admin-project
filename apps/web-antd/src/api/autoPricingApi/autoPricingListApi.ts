/*
 * @Author: cwx
 * @Date: 2026-01-15 11:00:51
 * @LastEditTime: 2026-03-07 00:49:43
 * @LastEditors: cwx
 * @Description: 自动套价-项目清单api
 */
import type { Recordable } from '@vben/types';

import type { BasicFetchResult, BasicModel } from '#/api/basicType';

import { requestClient } from '#/api/request';

export namespace AutoPricingListApi {
  export interface ListResult extends BasicModel {
    Code: string;
    Name: string;
    Feature: string;
    Unit: string;
    Quantity: number;
    UnitPrice: number;
    TotalPrice: number;
    TaxUnitPrice: number;
    TaxTotalPrice: number;
    Rate: number;
    DeclineRate: number;
    PriceSource: null | string;
    Remark: null | string;
    ISAlone: boolean;
    Parent_ID: null | string;
    APProjectTreeID: string;
    APProjectID: string;
    SetPrice: number;
    SetInstallationFee: number;
    TreePath: null | string;
    CopperPrice: number;
    SiliconSteelPrice: number;
    AluminumPrice: number;
    NamePath: null | string;
    TreeSort: number;
    OriginTaxUnitPrice: null | number;
    AnnexFiles: any | null;
    Version_ID: string;
  }

  export interface PriceListResult extends BasicModel {
    Code: string;
    Name: string;
    Feature: string;
    Unit: string;
    Region: null | string;
    Brand: null | string;
    InquiryTime: null | string;
    UnitPrice: number;
    InstallationFee: number;
    CopperPrice: number;
    SiliconSteelPrice: number;
    AluminumPrice: number;
    APProjectListID: string;
    APProjectTreeID: string;
    APProjectID: string;
    Version_ID: string;
  }
}

/**
 * @description: 查询项目清单
 * @return {*}
 */
export async function getAutoPricingList(params: {
  params?: Recordable<any>;
  treeId: string;
  vId: string;
}) {
  const { vId, treeId, params: queryParams } = params;
  return requestClient.get<BasicFetchResult<AutoPricingListApi.ListResult>>(
    `api/APProjectList/${vId}/${treeId}`,
    {
      params: queryParams,
    },
  );
}

/**
 * @description: 查询可套价的项目
 * @param {string} vId
 * @param {string} orgId
 * @return {*}
 */
export async function getAutoPricingProject(vId: string, orgId: string) {
  return requestClient.get(
    `api/APProjectList/${vId}/GetAutomaticPricingProject/${orgId}`,
  );
}

/**
 * @description: 查询可套价的品牌
 * @param {string} rId 库ID
 * @param {Recordable<any>} params {TreeId}
 * @return {*}
 */
export async function getAutoPricingMaterialBrand(
  rId: string,
  params: Recordable<any>,
) {
  return requestClient.get<BasicFetchResult<string>>(
    `api/ProMaterislMachine/GetBrandList/${rId}`,
    {
      params,
    },
  );
}

/**
 * @description: 查询可套价的基准铜价/基准硅钢价/基准铝价
 * @param {string} rId 库ID
 * @param {Recordable<any>} params {TreeId, BrandName}
 * @return {*}
 */
export async function getAutoPricingMaterialPriceOptions(
  rId: string,
  params: Recordable<any>,
) {
  return requestClient.get(`api/ProMaterislMachine/GetPriceList/${rId}`, {
    params,
  });
}

/**
 * @description: 保存套价库
 * @param {string} vId 版本ID
 * @param {string} projectTreeId 目录树ID
 * @param {Recordable<any>} params
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function putAutoPricingList(
  vId: string,
  projectTreeId: string,
  params: Recordable<any>,
  data: Recordable<any>,
) {
  return requestClient.put(`api/APProjectList/${vId}/${projectTreeId}`, data, {
    params,
  });
}

/**
 * @description: 查询价格信息
 * @param {string} id
 * @param {Recordable<any>} params
 * @return {*}
 */
export async function getAutoPricingListPriceList(
  id: string,
  params?: Recordable<any>,
) {
  return requestClient.get<
    BasicFetchResult<AutoPricingListApi.PriceListResult>
  >(`api/APSetPriceInfo/${id}`, { params });
}

/**
 * @description: 修改清单价格
 * @param {string} id
 * @param {Recordable<any>} params {price}
 * @return {*}
 */
export async function putAutoPricingListPrice(
  id: string,
  params: Recordable<any>,
) {
  return requestClient.put(`api/APSetPriceInfo/${id}`, null, { params });
}

/**
 * @description: 下浮率调整
 * @param {string} vId 版本ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function putAutoPricingListDeclineRate(
  vId: string,
  data: Recordable<any>,
) {
  return requestClient.put(`api/APProjectList/${vId}/DownwardAdjustment`, data);
}

/**
 * @description: 导出项目清单
 * @param {string} vId
 * @param {string} templateId
 * @return {*}
 */
export async function getAutoPricingListExport(
  vId: string,
  templateId: string,
) {
  return requestClient.get(
    `api/APProjectList/${vId}/Export?quotationTemplateId=${templateId}`,
    {
      responseType: 'blob',
    },
  );
}

/** *******************系数调整*/

/**
 * @description: 查询系数调整项
 * @param {string} treeId 目录树ID
 * @return {*}
 */
export async function getAutoPricingListFactor(treeId: string) {
  return requestClient.get(`api/APSystemAdjustment/GetParameter/${treeId}`);
}

/**
 * @description: 查询系数调整内容
 * @param {string} paramId 系数项ID
 * @return {*}
 */
export async function getAutoPricingListFactorDetail(paramId: string) {
  return requestClient.get(`api/APSystemAdjustment/GetContent/${paramId}`);
}

/**
 * @description: 修改系数调整
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function putAutoPricingListFactor(data: Recordable<any>) {
  return requestClient.put(
    `api/APSystemAdjustment/UpdateContent/${data.ID}`,
    data,
  );
}

/** *******************单价组成*/

/**
 * @description: 新增单价组成
 * @param {string} listId 清单ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function postAutoPricingListFeeComposition(
  listId: string,
  data: Recordable<any>,
) {
  return requestClient.post(`api/APListFeeCollectionSet/${listId}`, data);
}

/**
 * @description: 删除单价组成
 * @param {string} listId 清单ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function deleteAutoPricingListFeeComposition(
  listId: string,
  data: Recordable<any>,
) {
  return requestClient.delete(`api/APListFeeCollectionSet/${listId}`, { data });
}

/**
 * @description: 查询单价组成
 * @param {string} listId 清单ID
 * @param {Recordable<any>} params
 * @return {*}
 */
export async function getAutoPricingListFeeComposition(
  listId: string,
  params?: Recordable<any>,
) {
  return requestClient.get(`api/APListFeeCollectionSet/${listId}`, { params });
}

/**
 * @description: 修改单价组成
 * @param {string} listId 清单ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function putAutoPricingListFeeComposition(
  listId: string,
  data: Recordable<any>,
) {
  return requestClient.put(
    `api/APListFeeCollectionSet/${listId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 取消独立取费
 * @param {string} listId 清单ID
 * @return {*}
 */
export async function cancelAutoPricingListFeeComposition(listId: string) {
  return requestClient.put(
    `/api/APListFeeCollectionSet/${listId}/CancelListAlone`,
  );
}

/**
 * @description: 运费调整
 * @param {string} vId 版本ID
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function putAutoPricingListFeeFreight(
  vId: string,
  data: Recordable<any>,
) {
  return requestClient.put(`api/APProjectList/${vId}/FreightAdjustment`, data);
}
