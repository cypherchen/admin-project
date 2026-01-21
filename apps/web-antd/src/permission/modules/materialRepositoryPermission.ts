/*
 * @Author: cwx
 * @Date: 2024-06-23 21:47:06
 * @LastEditTime: 2024-06-23 22:33:37
 * @LastEditors: cwx
 * @Description: 材料库权限
 */

import type { PermissionModule } from '..';

const materialRepository: PermissionModule = {
  name: '材料库',
  key: 'materialRepository',
  auth: [
    {
      name: '材料库_新建',
      key: 'materialRepository_repository:create',
    },
    {
      name: '材料库_修改',
      key: 'materialRepository_repository:update',
    },
    {
      name: '材料库_删除',
      key: 'materialRepository_repository:delete',
    },
    {
      name: '材料分类_新建',
      key: 'materialRepository_category:create',
    },
    {
      name: '材料分类_修改',
      key: 'materialRepository_category:update',
    },
    {
      name: '材料分类_删除',
      key: 'materialRepository_category:delete',
    },
    {
      name: '材料_新建',
      key: 'materialRepository_material:create',
    },
    {
      name: '材料_修改',
      key: 'materialRepository_material:update',
    },
    {
      name: '材料_删除',
      key: 'materialRepository_material:delete',
    },
    {
      name: '材料_导入',
      key: 'materialRepository_material:import',
    },
    {
      name: '材料_导出',
      key: 'materialRepository_material:export',
    },
    {
      name: '材料_批量移动',
      key: 'materialRepository_material:batchMove',
    },
    {
      name: '材料_删除历史',
      key: 'materialRepository_material:deleteHistory',
    },
  ],
  tabs: [],
};

export default materialRepository;
