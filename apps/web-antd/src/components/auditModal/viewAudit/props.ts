/*
 * @Author: cwx
 * @Date: 2025-03-23 00:47:10
 * @LastEditTime: 2025-03-25 11:22:25
 * @LastEditors: cwx
 * @Description:
 */
import { AuditStatusEnum } from '#/enums/auditStatusEnum';

export interface ViewAuditProps {
  [key: string]: any;
  instanceId: string;
  close?: () => void;
  submit?: (status: AuditStatusEnum) => void;
}
