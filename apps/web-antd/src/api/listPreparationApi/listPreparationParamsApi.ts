/*
 * @Author: cwx
 * @Date: 2026-01-17 00:00:00
 * @LastEditTime: 2026-01-17 22:01:31
 * @LastEditors: cwx
 * @Description: 清单编制-项目信息参数api
 */
import type { Recordable } from '@vben/types';

import type {
  BasicFetchResult,
  BasicModel,
  BasicParamsType,
} from '#/api/basicType';
import { requestClient } from '#/api/request';

export namespace ListPreparationParamsApi {
  export interface ParamsResult extends BasicModel {
    Name: string;
    Unit: string;
    InputType: number;
    Options: null | string;
    IsRequired: boolean;
    Value: string | null;
    Remark: string | null;
    Parent_ID: null | string;
    IPProjectTreeID: string;
    IPProjectID: string;
    ParameterSettingTemplate_ID: string;
    ParameterSettingContent_ID: string;
    Version_ID: string;
  }
}

/**
 * @description: 查询清单编制项目信息参数
 * @param {object} options
 * @param {string} options.vId 版本ID
 * @param {string} options.treeId 目录树ID
 * @param {string} options.tId 参数模板ID
 * @param {BasicParamsType} options.params 查询参数
 */
export async function getListPreparationParams(options: {
  vId: string;
  treeId: string;
  tId: string;
  params?: BasicParamsType;
}) {
  const { vId, treeId, tId, params } = options;
  return requestClient.get<
    BasicFetchResult<ListPreparationParamsApi.ParamsResult>
  >(`api/IPParameterSetting/${vId}/${treeId}/${tId}`, { params });
}

/**
 * @description: 修改清单编制项目信息参数
 * @param {string} vId 版本ID
 * @param {string} treeId 目录树ID
 * @param {Recordable<any>} data 提交数据（包含参数ID）
 */
export async function putListPreparationParams(
  vId: string,
  treeId: string,
  data: Recordable<any>,
) {
  return requestClient.put<ListPreparationParamsApi.ParamsResult>(
    `api/IPParameterSetting/${vId}/${treeId}/${data.ID}`,
    data,
  );
}

/**
 * @description: 切换清单编制项目信息参数模板
 * @param {string} vId 版本ID
 * @param {string} treeId 目录树ID
 * @param {Recordable<any>} params 选择模板的参数
 */
export async function setListPreparationParamsTemplate(
  vId: string,
  treeId: string,
  params: Recordable<any>,
) {
  return requestClient.post<boolean>(
    `api/IPParameterSetting/${vId}/${treeId}/SelectTemplate?TemplateID=${params.TemplateID}`,
  );
}
