/*
 * @Author: cwx
 * @Date: 2026-01-17 00:00:00
 * @LastEditTime: 2026-01-17 21:53:58
 * @LastEditors: cwx
 * @Description: 参数模板api
 */
import type {
  BasicFetchResult,
  BasicModel,
  BasicParamsType,
} from '#/api/basicType';
import { requestClient } from '#/api/request';

export namespace ParamsTemplateApi {
  export interface ParamsTemplateResult extends BasicModel {
    Name: string;
  }

  export interface ParamsTemplateContentResult extends BasicModel {
    Name: string;
    Unit: string;
    InputType: number;
    Options: null | string;
    IsRequired: boolean;
    Remark: string;
    Parent_ID: null | string;
    ParameterSettingTemplate_ID: string;
  }
}

/**
 * @description: 新增参数模板
 * @param {string} orgId 组织ID
 * @param {Record<string, any>} data 提交数据
 */
export async function postParamsTemplate(
  orgId: string,
  data: Record<string, any>,
) {
  return requestClient.post<ParamsTemplateApi.ParamsTemplateResult>(
    `api/ParameterSettingTemplate/${orgId}`,
    data,
  );
}

/**
 * @description: 删除参数模板
 * @param {string} orgId 组织ID
 * @param {string} id 模板ID
 */
export async function deleteParamsTemplate(orgId: string, id: string) {
  return requestClient.delete<boolean>(
    `api/ParameterSettingTemplate/${orgId}/${id}`,
  );
}

/**
 * @description: 修改参数模板
 * @param {string} orgId 组织ID
 * @param {Record<string, any>} data 提交数据（包含ID）
 */
export async function putParamsTemplate(
  orgId: string,
  data: Record<string, any>,
) {
  return requestClient.put<ParamsTemplateApi.ParamsTemplateResult>(
    `api/ParameterSettingTemplate/${orgId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询参数模板列表
 * @param {object} options
 * @param {string} options.orgId 组织ID
 * @param {BasicParamsType} options.params 查询参数
 */
export async function getParamsTemplate(options: {
  orgId: string;
  params?: BasicParamsType;
}) {
  const { orgId, params } = options;
  return requestClient.get<
    BasicFetchResult<ParamsTemplateApi.ParamsTemplateResult>
  >(`api/ParameterSettingTemplate/${orgId}`, { params });
}

/**
 * @description: 新增参数模板详情参数
 * @param {string} templateId 模板ID
 * @param {Record<string, any>} data 提交数据
 */
export async function postParamsTemplateContent(
  templateId: string,
  data: Record<string, any>,
) {
  return requestClient.post<ParamsTemplateApi.ParamsTemplateContentResult>(
    `api/ParameterSettingContent/${templateId}`,
    data,
  );
}

/**
 * @description: 删除参数模板详情参数
 * @param {string} templateId 模板ID
 * @param {string[]} data 要删除的参数ID集合
 */
export async function deleteParamsTemplateContent(
  templateId: string,
  data: string[],
) {
  return requestClient.delete<boolean>(
    `api/ParameterSettingContent/${templateId}`,
    { data },
  );
}

/**
 * @description: 修改参数模板详情参数
 * @param {string} templateId 模板ID
 * @param {Record<string, any>} data 提交数据（包含ID）
 */
export async function putParamsTemplateContent(
  templateId: string,
  data: Record<string, any>,
) {
  return requestClient.put<ParamsTemplateApi.ParamsTemplateContentResult>(
    `api/ParameterSettingContent/${templateId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询参数模板内容列表
 * @param {string} templateId 模板ID
 * @param {BasicParamsType} params 查询参数
 */
export async function getParamsTemplateContent(
  templateId: string,
  params?: BasicParamsType,
) {
  return requestClient.get<
    BasicFetchResult<ParamsTemplateApi.ParamsTemplateContentResult>
  >(`api/ParameterSettingContent/${templateId}`, { params });
}
