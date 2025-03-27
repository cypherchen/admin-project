/*
 * @Author: cwx
 * @Date: 2024-06-23 21:47:49
 * @LastEditTime: 2025-03-27 19:01:08
 * @LastEditors: cwx
 * @Description: 项目库权限
 */

import type { PermissionModule } from '..';

const projectRepository: PermissionModule = {
  name: '项目库',
  key: 'projectRepository',
  auth: [],
};

const projectRepository_merge = {
  name: '合并项目',
  key: 'projectRepository_merge',
  auth: [
    {
      name: '一键合并',
      key: 'projectRepository_merge:quickMerge',
    },
    {
      name: '手动合并',
      key: 'projectRepository_merge:manualMerge',
    },
  ],
};

const projectRepository_list = {
  name: '项目清单',
  key: 'projectRepository_list',
  auth: [],
};

const projectRepository_params = {
  name: '项目信息',
  key: 'projectRepository_params',
  auth: [],
};

const projectRepository_calculate = {
  name: '计算分析',
  key: 'projectRepository_calculate',
  auth: [
    {
      name: '计算分析_导出excel',
      key: 'projectRepository_calculate:export',
    },
    {
      name: '计算分析_计算分析',
      key: 'projectRepository_calculate:calculate',
    },
    {
      name: '计算分析_修改',
      key: 'projectRepository_calculate:update',
    },
  ],
};

projectRepository.tabs = [
  projectRepository_merge,
  projectRepository_list,
  projectRepository_params,
  projectRepository_calculate,
];

export default projectRepository;
