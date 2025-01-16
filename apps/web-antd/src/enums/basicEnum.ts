/*
 * @Author: cwx
 * @Date: 2024-12-19 23:01:34
 * @LastEditTime: 2024-12-19 23:02:40
 * @LastEditors: cwx
 * @Description:
 */
export enum ConditionalType {
  /**
   * @description: 等于
   */
  Equal,
  /**
   * @description: 包含
   */
  Like,
  /**
   * @description: 大于
   */
  GreaterThan,
  /**
   * @description: 大于等于
   */
  GreaterThanOrEqual,
  /**
   * @description: 小于
   */
  LessThan,
  /**
   * @description: 小于等于
   */
  LessThanOrEqual,
  /**
   * @description: 包含 搜索条件1,搜索条件2,...
   */
  In,
  /**
   * @description: 不包含 搜索条件1,搜索条件2,...
   */
  NotIn,
  /**
   * @description: 左包含
   */
  LikeLeft,
  /**
   * @description: 右包含
   */
  LikeRight,
  /**
   * @description: 不等于
   */
  NoEqual,
  /**
   * @description: 是否为空
   */
  IsNullOrEmpty,
  IsNot,
  /**
   * @description: 不包含
   */
  NoLike,
  /**
   * @description: 等于Null
   */
  EqualNull,
  /**
   * @description: 包含 搜索条件1,搜索条件2,...
   */
  InLike,
}
