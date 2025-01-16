import { acceptHMRUpdate, defineStore } from 'pinia';

interface BasicUserInfo {
  [key: string]: any;

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

interface AccessState {
  /**
   * 用户信息
   */
  userInfo: BasicUserInfo | null;
  /**
   * 用户角色
   */
  userRoles: string[];
}

/**
 * @zh_CN 用户信息相关
 */
export const useUserStore = defineStore('core-user', {
  actions: {
    setUserInfo(userInfo: BasicUserInfo | null) {
      // 设置用户信息
      this.userInfo = userInfo;
      // 设置角色信息
      const roles = userInfo?.roleName ? [userInfo.roleName] : [];
      this.setUserRoles(roles);
    },
    setUserRoles(roles: string[]) {
      this.userRoles = roles;
    },
  },
  state: (): AccessState => ({
    userInfo: null,
    userRoles: [],
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
