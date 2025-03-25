/*
 * @Author: cwx
 * @Date: 2025-03-20 16:28:54
 * @LastEditTime: 2025-03-22 23:12:08
 * @LastEditors: cwx
 * @Description:
 */
export interface SubmitAuditProps {
  [key: string]: any;
  tableName: string;
  auditName: string;
  schema: Record<string, any>[];
  data: Record<string, any>;
  linkUrl: string;
  customizable?: boolean;
  isOtherTables?: boolean;
  close?: () => void;
  submit?: () => void;
}
