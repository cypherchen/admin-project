/*
 * @Author: cwx
 * @Date: 2025-03-24 09:03:23
 * @LastEditTime: 2025-03-24 19:20:33
 * @LastEditors: cwx
 * @Description: 审批模板
 */

import type {
  BasicFetchResult,
  BasicModel,
  BasicParamsType,
} from '#/api/basicType';

import { requestClient } from '#/api/request';

export namespace AuditTemplateApi {
  export interface User {
    ID: string;
    UserName: string;
  }

  export interface TemplateNode extends BasicModel {
    Reviewer: User[];
    Sequence: number;
    WorkflowTemplate_ID: string;
  }

  export interface AuditTemplateResult extends BasicModel {
    Name: string;
    CCRecipient: User[];
    TemplateNodes: TemplateNode[];
  }
}

/**
 * @description: 新增审批模板
 * @param {Record<string, any>} data
 * @return {*}
 */
export function postAuditTemplate(data: Record<string, any>) {
  return requestClient.post<AuditTemplateApi.AuditTemplateResult>(
    'api/WorkflowTemplate',
    data,
  );
}

/**
 * @description: 删除审批模板
 * @param {{ ID: string }} data
 * @return {*}
 */
export function deleteAuditTemplate(data: { ID: string }) {
  return requestClient.delete<AuditTemplateApi.AuditTemplateResult>(
    'api/WorkflowTemplate',
    {
      data,
    },
  );
}

/**
 * @description: 修改审批模板
 * @param {Record<string, any>} data
 * @return {*}
 */
export function putAuditTemplate(data: Record<string, any>) {
  return requestClient.put<AuditTemplateApi.AuditTemplateResult>(
    `api/WorkflowTemplate/${data.ID}`,
    data,
  );
}

/**
 * @description: 查询审批模板
 * @param {BasicParamsType} params
 * @return {*}
 */
export function getAuditTemplate(params?: BasicParamsType) {
  return requestClient.get<
    BasicFetchResult<AuditTemplateApi.AuditTemplateResult>
  >('api/WorkflowTemplate', { params });
}
