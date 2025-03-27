/**
 * @Author: dyy
 * @Date: 2024-05-29 15:40:03
 * @LastEditTime: 2024-05-30 09:24:35
 * @LastEditors: dyy update
 * @Description: 指标分析权限
 */

import type { PermissionModule } from '..';

const indicatorAnalyze: PermissionModule = {
  name: '指标分析',
  key: 'indicatorAnalyze',
  // 主页面
  auth: [
    // 项目列表权限
    {
      name: '项目_新建',
      key: 'indicatorAnalyze_project:create',
    },
    {
      name: '项目_导入excel',
      key: 'indicatorAnalyze_project:import',
    },
    {
      name: '项目_查看全部',
      key: 'indicatorAnalyze_project:queryAll',
    },
    {
      name: '项目_修改',
      key: 'indicatorAnalyze_project:update',
    },
    {
      name: '项目_删除',
      key: 'indicatorAnalyze_project:delete',
    },
    {
      name: '项目_发起审批',
      key: 'indicatorAnalyze_project:approval',
    },
    {
      name: '项目_自定义审批人',
      key: 'indicatorAnalyze_project:customApproval',
    },
    // 项目版本权限
    {
      name: '版本_新建',
      key: 'indicatorAnalyze_version:create',
    },
    {
      name: '版本_修改',
      key: 'indicatorAnalyze_version:update',
    },
    {
      name: '版本_删除',
      key: 'indicatorAnalyze_version:delete',
    },
  ],
};

const indicatorAnalyze_import = {
  name: '导入工程',
  key: 'indicatorAnalyze_import',
  auth: [
    {
      name: '目录树_新增',
      key: 'indicatorAnalyze_import:createTree',
    },
    {
      name: '目录树_修改',
      key: 'indicatorAnalyze_import:updateTree',
    },
    {
      name: '目录树_删除',
      key: 'indicatorAnalyze_import:deleteTree',
    },
    {
      name: '目录树_移动',
      key: 'indicatorAnalyze_import:moveTree',
    },
    {
      name: '导入工程_导入Excel',
      key: 'indicatorAnalyze_import:import',
    },
    {
      name: '导入工程_一键导入',
      key: 'indicatorAnalyze_import:quickImport',
    },
    {
      name: '导入工程_导入广联达',
      key: 'indicatorAnalyze_import:GLDImport',
    },
    {
      name: '导入工程_删除工程',
      key: 'indicatorAnalyze_import:delete',
    },
  ],
};

const indicatorAnalyze_params = {
  name: '项目信息',
  key: 'indicatorAnalyze_params',
  auth: [
    {
      name: '项目信息_设置模板',
      key: 'indicatorAnalyze_params:setTemplate',
    },
    {
      name: '项目信息_修改',
      key: 'indicatorAnalyze_params:update',
    },
  ],
};

const indicatorAnalyze_list = {
  name: '项目清单',
  key: 'indicatorAnalyze_list',
  auth: [],
};

const indicatorAnalyze_calculate = {
  name: '计算分析',
  key: 'indicatorAnalyze_calculate',
  auth: [
    {
      name: '计算分析_导出Excel',
      key: 'indicatorAnalyze_calculate:export',
    },
    {
      name: '计算分析_计算分析',
      key: 'indicatorAnalyze_calculate:calculate',
    },
    {
      name: '计算分析_修改',
      key: 'indicatorAnalyze_calculate:update',
    },
  ],
};

indicatorAnalyze.tabs = [
  indicatorAnalyze_import,
  indicatorAnalyze_params,
  indicatorAnalyze_list,
  indicatorAnalyze_calculate,
];

export default indicatorAnalyze;
