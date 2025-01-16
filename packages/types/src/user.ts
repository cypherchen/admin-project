import type { BasicUserInfo } from '@vben-core/typings';

/** 用户信息 */
interface UserInfo {
  /**
   * 头像
   */
  avatar?: string;

  /**
   * 用户id
   */
  ID: string;

  /**
   * 用户昵称
   */
  Name: string;

  /**
   * 账号
   */
  Account: string;

  /**
   * 用户角色
   */
  roleName: string;

  /**
   * 是否超管
   */
  IsAdmin: boolean;

  /**
   * 组织ID
   */
  Orz_ID: string;
}

export type { UserInfo };
