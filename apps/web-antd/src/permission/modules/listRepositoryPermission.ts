/*
 * @Author: cwx
 * @Date: 2024-06-23 21:47:30
 * @LastEditTime: 2025-03-27 19:02:50
 * @LastEditors: cwx
 * @Description: 清单库权限
 */

import type { PermissionModule } from '..';

const listRepository: PermissionModule = {
  name: '清单库',
  key: 'listRepository',
  auth: [
    {
      name: '清单库_新建',
      key: 'listRepository_repository:create',
    },
    {
      name: '清单库_修改',
      key: 'listRepository_repository:update',
    },
    {
      name: '清单库_删除',
      key: 'listRepository_repository:delete',
    },
    {
      name: '清单分类_新建',
      key: 'listRepository_category:create',
    },
    {
      name: '清单分类_修改',
      key: 'listRepository_category:update',
    },
    {
      name: '清单分类_删除',
      key: 'listRepository_category:delete',
    },
    {
      name: '清单_新建',
      key: 'listRepository_list:create',
    },
    {
      name: '清单_修改',
      key: 'listRepository_list:update',
    },
    {
      name: '清单_删除',
      key: 'listRepository_list:delete',
    },
    {
      name: '清单_刷新',
      key: 'listRepository_list:renew',
    },
    {
      name: '清单_批量移动',
      key: 'listRepository_list:batchMove',
    },
    {
      name: '清单_导入',
      key: 'listRepository_list:import',
    },
    {
      name: '组成_新建',
      key: 'listRepository_composition:create',
    },
    {
      name: '组成_修改',
      key: 'listRepository_composition:update',
    },
    {
      name: '组成_删除',
      key: 'listRepository_composition:delete',
    },
  ],
};

listRepository.tabs = [];

export default listRepository;
