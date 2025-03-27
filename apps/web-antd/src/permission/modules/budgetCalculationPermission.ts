/*
 * @Author: cwx
 * @Date: 2024-04-18 13:14:57
 * @LastEditTime: 2024-06-24 14:07:55
 * @LastEditors: cwx
 * @Description: 预算测算权限
 */
import type { PermissionModule } from '..';

const budgetCalculation: PermissionModule = {
  name: '预算测算',
  key: 'budgetCalculation',
  // 主页面
  auth: [
    // 项目列表权限
    {
      name: '项目_新建',
      key: 'budgetCalculation_project:create',
    },
    {
      name: '项目_修改',
      key: 'budgetCalculation_project:update',
    },
    {
      name: '项目_删除',
      key: 'budgetCalculation_project:delete',
    },
    // 项目版本权限
    {
      name: '版本_新建',
      key: 'budgetCalculation_version:create',
    },
    {
      name: '版本_修改',
      key: 'budgetCalculation_version:update',
    },
    {
      name: '版本_删除',
      key: 'budgetCalculation_version:delete',
    },
    {
      name: '目录树_新增',
      key: 'budgetCalculation:createTree',
    },
    {
      name: '目录树_修改',
      key: 'budgetCalculation:updateTree',
    },
    {
      name: '目录树_删除',
      key: 'budgetCalculation:deleteTree',
    },
  ],
};

const budgetCalculation_params = {
  name: '项目参数',
  key: 'budgetCalculation_params',
  auth: [
    {
      name: '项目参数_设置模板',
      key: 'budgetCalculation_params:setTemplate',
    },
    {
      name: '项目参数_修改',
      key: 'budgetCalculation_params:update',
    },
  ],
};

const budgetCalculation_query = {
  name: '项目查询',
  key: 'budgetCalculation_query',
  auth: [
    {
      name: '项目查询_查询',
      key: 'budgetCalculation_query:query',
    },
    {
      name: '项目查询_启用停用',
      key: 'budgetCalculation_query:switch',
    },
    {
      name: '项目查询_删除',
      key: 'budgetCalculation_query:delete',
    },
  ],
};

const budgetCalculation_calculate = {
  name: '项目测算',
  key: 'budgetCalculation_calculate',
  auth: [
    {
      name: '项目测算_新增',
      key: 'budgetCalculation_calculate:create',
    },
    {
      name: '项目测算_修改',
      key: 'budgetCalculation_calculate:update',
    },
    {
      name: '项目测算_删除',
      key: 'budgetCalculation_calculate:delete',
    },
    {
      name: '项目测算_系数调整',
      key: 'budgetCalculation_calculate:factorAdjust',
    },
  ],
};

const budgetCalculation_report = {
  name: '报表输出',
  key: 'budgetCalculation_report',
  auth: [
    {
      name: '报表输出_导出',
      key: 'budgetCalculation_report:export',
    },
  ],
};

budgetCalculation.tabs = [
  budgetCalculation_params,
  budgetCalculation_query,
  budgetCalculation_calculate,
  budgetCalculation_report,
];

export default budgetCalculation;
