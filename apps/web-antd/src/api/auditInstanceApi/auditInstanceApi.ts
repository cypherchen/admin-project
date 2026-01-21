/*
 * @Author: cwx
 * @Date: 2025-03-22 23:51:36
 * @LastEditTime: 2026-01-21 11:06:25
 * @LastEditors: cwx
 * @Description: 审核实例
 */

import type {
  BasicFetchResult,
  BasicModel,
  BasicParamsType,
} from '#/api/basicType';

import { requestClient } from '#/api/request';

export namespace AuditInstanceApi {
  export interface User {
    ID: string;
    UserName: string;
  }

  export interface WorkflowTask extends BasicModel {
    Reviewer: User[];
    EndTime: string;
    ExecutorID: string;
    Executor: string;
    Sequence: number;
    WorkflowInstance_ID: string;
    CheckOpinion: null | string;
  }

  export interface AuditInstanceResult extends BasicModel {
    Name: string;
    DataID: string[];
    TableName: string;
    Remark: null | string;
    WorkflowTemplate_ID: string;
    WorkflowTemplateName: string;
    SysUser_ID: string;
    UserName: string;
    CancelCause: null | string;
    LinkUrl: string;
    Schema: string;
    DataModel: string;
    CCRecipient: User[];
    WorkflowTasks: WorkflowTask[];
    CanAudit: boolean;
    CanCancel: boolean;
    CurrentTask: null | string;
    IsOtherTables: boolean;
    Reviewer: null | User[];
  }
}

/**
 * @description: 查询审批列表
 * @param {BasicParamsType} params
 * @return {*}
 */
export function getAuditInstanceList({ params }: { params?: BasicParamsType }) {
  return requestClient.get<
    BasicFetchResult<AuditInstanceApi.AuditInstanceResult>
  >('api/WorkflowInstance', { params });
}

/**
 * @description: 查询审批实例
 * @param {string} id
 * @return {*}
 */
export function getAuditInstance(id: string) {
  return requestClient.get<AuditInstanceApi.AuditInstanceResult>(
    `api/WorkflowInstance/${id}/GetOnly`,
  );
}

/**
 * @description: 查询我的审批
 * @param {number} searchType 搜索类型 0-待我审批 1-我审过的 2-抄送给我 3-我创建的
 * @param {BasicParamsType} params
 * @return {*}
 */
export function getMyAuditList({
  searchType,
  params,
}: {
  params?: BasicParamsType;
  searchType: number;
}) {
  return requestClient.get<
    BasicFetchResult<AuditInstanceApi.AuditInstanceResult>
  >(`api/WorkflowInstance/${searchType}/GetListByMe`, { params });
}

/**
 * @description: 发起审批
 * @param {Record<string, any>} data
 * @return {*}
 */
export function postAudit(data: Record<string, any>) {
  return requestClient.post<AuditInstanceApi.AuditInstanceResult>(
    'api/WorkflowInstance',
    data,
  );
}

/**
 * @description: 审批通过
 * @param {string} id 审批实例ID
 * @param {{TaskID: string; CheckOpinion: string}} data {TaskID: 任务ID, CheckOpinion: 审批意见}
 * @return {*}
 */
export function putAgreeAudit(
  id: string,
  data: {
    CheckOpinion: string;
    TaskID: string;
  },
) {
  return requestClient.put<AuditInstanceApi.AuditInstanceResult>(
    `api/WorkflowInstance/${id}/Agree`,
    data,
  );
}

/**
 * @description: 审批拒绝
 * @param {string} id 审批实例ID
 * @param {{TaskID: string; CheckOpinion: string}} data {TaskID: 任务ID, CheckOpinion: 审批意见}
 * @return {*}
 */
export function putRefuseAudit(
  id: string,
  data: {
    CheckOpinion: string;
    TaskID: string;
  },
) {
  return requestClient.put<AuditInstanceApi.AuditInstanceResult>(
    `api/WorkflowInstance/${id}/Refuse`,
    data,
  );
}

/**
 * @description: 撤销审批
 * @param {string} id 审批实例ID
 * @param {{ CancelCause: string }} data 撤销原因
 * @return {*}
 */
export function putCancelAudit(id: string, data: { CancelCause: string }) {
  return requestClient.put<AuditInstanceApi.AuditInstanceResult>(
    `api/WorkflowInstance/${id}/Cancel`,
    data,
  );
}

/**
 * @description: 批量审批
 * @param {{IDList: string[]; CheckOpinion: string}} data {IDList: 审批实例ID数组, CheckOpinion: 审批意见}
 * @return {*}
 */
export function putBatchApproved(data: {
  CheckOpinion: string;
  IDList: string[];
}) {
  return requestClient.put<AuditInstanceApi.AuditInstanceResult>(
    `api/WorkflowInstance/BatchTaskAgree`,
    data,
  );
}

/**
 * @description: 批量驳回
 * @param {{IDList: string[]; CheckOpinion: string}} data {IDList: 审批实例ID数组, CheckOpinion: 审批意见}
 * @return {*}
 */
export function putBatchRejected(data: {
  CheckOpinion: string;
  IDList: string[];
}) {
  return requestClient.put<AuditInstanceApi.AuditInstanceResult>(
    `api/WorkflowInstance/BatchTaskRefuse`,
    data,
  );
}
