/*
 * @Author: cwx
 * @Date: 2024-12-19 22:59:08
 * @LastEditTime: 2025-03-25 15:27:40
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
export type BasicWhereType = {
  FieldName: string;
  ConditionalType: ConditionalType;
  FieldValue: any;
};
export interface ConditionalListEntry {
  Key: 0 | 1; // 0:and 1:or
  Value: BasicWhereType;
}
export interface ComplexWhereType {
  ConditionalList: ConditionalListEntry[];
}
export type WhereType = BasicWhereType | ComplexWhereType;

// GET请求参数
export interface BasicParamsType {
  [key: string]: any;
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
