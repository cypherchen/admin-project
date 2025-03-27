/*
 * @Author: cwx
 * @Date: 2024-06-23 21:44:52
 * @LastEditTime: 2024-10-15 16:33:24
 * @LastEditors: cwx
 * @Description: 清单编制权限
 */
import type { PermissionModule } from '..';

const listPreparation: PermissionModule = {
  name: '清单编制',
  key: 'listPreparation',
  // 主页面
  auth: [
    // 项目列表权限
    {
      name: '项目_新建',
      key: 'listPreparation_project:create',
    },
    {
      name: '项目_导入',
      key: 'listPreparation_project:import',
    },
    {
      name: '项目_查看全部',
      key: 'listPreparation_project:queryAll',
    },
    {
      name: '项目_修改',
      key: 'listPreparation_project:update',
    },
    {
      name: '项目_删除',
      key: 'listPreparation_project:delete',
    },
    {
      name: '项目_发起审批',
      key: 'listPreparation_project:approval',
    },
    {
      name: '项目_自定义审批人',
      key: 'listPreparation_project:customApproval',
    },
    // 项目版本权限
    {
      name: '版本_新建',
      key: 'listPreparation_version:create',
    },
    {
      name: '版本_修改',
      key: 'listPreparation_version:update',
    },
    {
      name: '版本_删除',
      key: 'listPreparation_version:delete',
    },
  ],
};

const listPreparation_import = {
  name: '导入工程',
  key: 'listPreparation_import',
  auth: [
    {
      name: '目录树_新增',
      key: 'listPreparation_import:createTree',
    },
    {
      name: '目录树_修改',
      key: 'listPreparation_import:updateTree',
    },
    {
      name: '目录树_删除',
      key: 'listPreparation_import:deleteTree',
    },
    {
      name: '目录树_移动',
      key: 'listPreparation_import:moveTree',
    },
    {
      name: '导入工程_导入Excel',
      key: 'listPreparation_import:import',
    },
    {
      name: '导入工程_一键导入',
      key: 'listPreparation_import:quickImport',
    },
    {
      name: '导入工程_删除工程',
      key: 'listPreparation_import:delete',
    },
  ],
};

const listPreparation_params = {
  name: '项目信息',
  key: 'listPreparation_params',
  auth: [
    {
      name: '项目信息_设置模板',
      key: 'listPreparation_params:setTemplate',
    },
    {
      name: '项目信息_修改',
      key: 'listPreparation_params:update',
    },
  ],
};

const listPreparation_query = {
  name: '项目查询',
  key: 'listPreparation_query',
  auth: [
    {
      name: '项目查询_查询',
      key: 'listPreparation_query:query',
    },
    {
      name: '项目查询_启用停用',
      key: 'listPreparation_query:switch',
    },
    {
      name: '项目查询_删除',
      key: 'listPreparation_query:delete',
    },
  ],
};

const listPreparation_list = {
  name: '项目清单',
  key: 'listPreparation_list',
  auth: [
    {
      name: '清单_新增',
      key: 'listPreparation_list:create',
    },
    {
      name: '清单_修改',
      key: 'listPreparation_list:update',
    },
    {
      name: '清单_删除',
      key: 'listPreparation_list:delete',
    },
    {
      name: '清单_导入',
      key: 'listPreparation_list:import',
    },
    {
      name: '清单_导出',
      key: 'listPreparation_list:export',
    },
    {
      name: '清单_发起审批',
      key: 'listPreparation_list:approval',
    },
    {
      name: '清单_导出报价',
      key: 'listPreparation_list:exportQuote',
    },
    {
      name: '清单_批量增加',
      key: 'listPreparation_list:batchAdd',
    },
    {
      name: '清单_替换',
      key: 'listPreparation_list:replace',
    },
    {
      name: '计算式_新增',
      key: 'listPreparation_list:createFormula',
    },
    {
      name: '计算式_修改',
      key: 'listPreparation_list:updateFormula',
    },
    {
      name: '计算式_删除',
      key: 'listPreparation_list:deleteFormula',
    },
  ],
};

const listPreparation_inspect = {
  name: '清单核查',
  key: 'listPreparation_inspect',
  auth: [
    {
      name: '清单核查_历史项目',
      key: 'listPreparation_inspect:historyProject',
    },
    {
      name: '清单核查_一键核查',
      key: 'listPreparation_inspect:inspect',
    },
    {
      name: '清单核查_导出excel',
      key: 'listPreparation_inspect:export',
    },
  ],
};

listPreparation.tabs = [
  listPreparation_import,
  listPreparation_params,
  listPreparation_query,
  listPreparation_list,
  listPreparation_inspect,
];

export default listPreparation;
