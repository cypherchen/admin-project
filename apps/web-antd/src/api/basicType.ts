/*
 * @Author: cwx
 * @Date: 2024-12-19 22:59:08
 * @LastEditTime: 2024-12-19 23:28:33
 * @LastEditors: cwx
 * @Description:
 */
import { ConditionalType } from '#/enums/basicEnum';

export * from '#/enums/basicEnum';

// 基础类型
export interface BasicModel {
  ID?: string;
  CreatedBy?: string;
  CreatedUserInfo?: string;
  CreatedTime?: string;
  UpdatedBy?: string;
  UpdatedUserInfo?: string;
  UpdatedTime?: string;
  Sort?: number;
  AuditStatus?: number;
  IsDelete?: boolean;
  SysLevel?: number;
  Orz_ID?: string;
}

// 查询参数
export interface WhereType {
  FieldName: string;
  ConditionalType: ConditionalType;
  FieldValue: any;
}

// GET请求参数
export interface BasicParamsType {
  PageIndex?: number;
  PageSize?: number;
  Where?: WhereType[];
  Order?: string;
}

// 基础返回值类型
export interface BasicFetchResult<T> {
  List: (BasicModel & T)[];
  Count?: number;
}
