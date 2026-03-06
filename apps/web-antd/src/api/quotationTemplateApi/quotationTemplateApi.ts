/*
 * @Author: cwx
 * @Date: 2026-01-27
 * @Description: 报价模板api
 */
import type { Recordable } from '@vben/types';

import type {
  BasicFetchResult,
  BasicModel,
  BasicParamsType,
} from '#/api/basicType';

import { requestClient } from '#/api/request';

export namespace QuotationTemplateApi {
  export interface QuotationTemplateResult extends BasicModel {
    Name: string;
  }

  export interface AnnexFile {
    FileID: string;
    FileName: string;
    MD5Code: string;
    FileUrl: string;
    Suffix: string;
    ContentType: string;
    Length: string;
  }

  export interface QuotationTemplateContentResult extends BasicModel {
    Name: string;
    AnnexFiles: AnnexFile[];
    QuotationTemplate_ID: string;
  }
}

/**
 * @description: 新增报价模板
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function postQuotationTemplate(data: Recordable<any>) {
  return requestClient.post<QuotationTemplateApi.QuotationTemplateResult>(
    'api/QuotationTemplate',
    data,
  );
}

/**
 * @description: 删除报价模板
 * @param {string} id
 * @return {*}
 */
export async function deleteQuotationTemplate(id: string) {
  return requestClient.delete<boolean>(`api/QuotationTemplate/${id}`);
}

/**
 * @description: 修改报价模板
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function putQuotationTemplate(data: Recordable<any>) {
  return requestClient.put<QuotationTemplateApi.QuotationTemplateResult>(
    `api/QuotationTemplate/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询报价模板
 * @param {BasicParamsType} params
 * @return {*}
 */
export async function getQuotationTemplate(params: BasicParamsType) {
  return requestClient.get<
    BasicFetchResult<QuotationTemplateApi.QuotationTemplateResult>
  >('api/QuotationTemplate', { params });
}

/**
 * @description: 新增报价模板详情
 * @param {Recordable<any>} data
 * @return {*}
 */
export async function postQuotationTemplateContent(data: Recordable<any>) {
  return requestClient.post<QuotationTemplateApi.QuotationTemplateContentResult>(
    `api/QuotationAnnex/${data.QuotationTemplate_ID}`,
    data,
  );
}

/**
 * @description: 删除报价模板详情
 * @param {string} tId 模板ID
 * @param {string} id
 * @return {*}
 */
export async function deleteQuotationTemplateContent(tId: string, id: string) {
  return requestClient.delete<boolean>(`api/QuotationAnnex/${tId}/${id}`);
}

/**
 * @description: 查询报价模板详情
 * @return {*}
 */
export async function getQuotationTemplateContent({
  params,
  tId,
}: {
  params?: BasicParamsType;
  tId: string;
}) {
  return requestClient.get<
    BasicFetchResult<QuotationTemplateApi.QuotationTemplateContentResult>
  >(`api/QuotationAnnex/${tId}`, { params });
}
