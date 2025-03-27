/*
 * @Author: cwx
 * @Date: 2024-06-23 21:46:38
 * @LastEditTime: 2024-06-23 21:50:21
 * @LastEditors: cwx
 * @Description: 工作桌面权限
 */
import type { PermissionModule } from '..';

const desktop: PermissionModule = {
  name: '工作桌面',
  key: 'desktop',
  auth: [
    {
      name: '左侧工作区',
      key: 'desktop:workspace',
    },
    {
      name: '右侧公告区',
      key: 'desktop:notice',
    },
  ],
};

desktop.tabs = [];

export default desktop;
