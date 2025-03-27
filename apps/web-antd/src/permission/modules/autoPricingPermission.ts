/*
 * @Author: cwx
 * @Date: 2024-04-18 13:14:57
 * @LastEditTime: 2024-09-25 16:47:46
 * @LastEditors: cwx
 * @Description: 自动套价权限
 */
import type { PermissionModule } from '..';

const autoPricing: PermissionModule = {
  name: '自动套价',
  key: 'autoPricing',
  // 主页面
  auth: [
    // 项目列表权限
    {
      name: '项目_新建',
      key: 'autoPricing_project:create',
    },
    {
      name: '项目_导入',
      key: 'autoPricing_project:import',
    },
    {
      name: '项目_查看全部',
      key: 'autoPricing_project:queryAll',
    },
    {
      name: '项目_修改',
      key: 'autoPricing_project:update',
    },
    {
      name: '项目_删除',
      key: 'autoPricing_project:delete',
    },
    // {
    //   name: "项目_发起审批",
    //   key: "autoPricing_project:approval",
    // },
    // {
    //   name: "项目_自定义审批人",
    //   key: "autoPricing_project:customApproval",
    // },
    // 项目版本权限
    {
      name: '版本_新建',
      key: 'autoPricing_version:create',
    },
    {
      name: '版本_修改',
      key: 'autoPricing_version:update',
    },
    {
      name: '版本_删除',
      key: 'autoPricing_version:delete',
    },
  ],
};

const autoPricing_import = {
  name: '导入工程',
  key: 'autoPricing_import',
  auth: [
    {
      name: '目录树_新增',
      key: 'autoPricing_import:createTree',
    },
    {
      name: '目录树_修改',
      key: 'autoPricing_import:updateTree',
    },
    {
      name: '目录树_删除',
      key: 'autoPricing_import:deleteTree',
    },
    {
      name: '目录树_移动',
      key: 'autoPricing_import:moveTree',
    },
    {
      name: '导入工程_导入Excel',
      key: 'autoPricing_import:import',
    },
    {
      name: '导入工程_一键导入',
      key: 'autoPricing_import:quickImport',
    },
    {
      name: '导入工程_删除工程',
      key: 'autoPricing_import:delete',
    },
  ],
};

const autoPricing_fee = {
  name: '取费设置',
  key: 'autoPricing_fee',
  auth: [
    {
      name: '取费设置_新建',
      key: 'autoPricing_fee:create',
    },
    {
      name: '取费设置_修改',
      key: 'autoPricing_fee:update',
    },
    {
      name: '取费设置_删除',
      key: 'autoPricing_fee:delete',
    },
    {
      name: '取费设置_同步',
      key: 'autoPricing_fee:sync',
    },
    {
      name: '取费设置_设置模板',
      key: 'autoPricing_fee:setTemplate',
    },
  ],
};

const autoPricing_list = {
  name: '项目清单',
  key: 'autoPricing_list',
  auth: [
    {
      name: '项目清单_自动套价',
      key: 'autoPricing_list:useRepository',
    },
    {
      name: '项目清单_系数调整',
      key: 'autoPricing_list:factorAdjust',
    },
    {
      name: '项目清单_运费调整',
      key: 'autoPricing_list:freightAdjust',
    },
    {
      name: '项目清单_下浮率',
      key: 'autoPricing_list:declineRate',
    },
    {
      name: '项目清单_导出',
      key: 'autoPricing_list:export',
    },
    {
      name: '项目清单_单价组成',
      key: 'autoPricing_list:composition',
    },
    {
      name: '项目清单_查询',
      key: 'autoPricing_list:query',
    },
  ],
};

const autoPricing_summary = {
  name: '造价汇总',
  key: 'autoPricing_summary',
  auth: [
    {
      name: '造价汇总_下浮率',
      key: 'autoPricing_summary:declineRate',
    },
    {
      name: '造价汇总_同步',
      key: 'autoPricing_summary:sync',
    },
  ],
};

const autoPricing_params = {
  name: '项目信息',
  key: 'autoPricing_params',
  auth: [
    {
      name: '项目信息_设置模板',
      key: 'autoPricing_params:setTemplate',
    },
    {
      name: '项目信息_修改',
      key: 'autoPricing_params:update',
    },
  ],
};

const autoPricing_analyze = {
  name: '计算分析',
  key: 'autoPricing_analyze',
  auth: [
    {
      name: '计算分析_导出',
      key: 'autoPricing_analyze:export',
    },
    {
      name: '计算分析_计算',
      key: 'autoPricing_analyze:calculate',
    },
    {
      name: '计算分析_修改',
      key: 'autoPricing_analyze:update',
    },
  ],
};

autoPricing.tabs = [
  autoPricing_import,
  autoPricing_fee,
  autoPricing_list,
  autoPricing_summary,
  autoPricing_params,
  autoPricing_analyze,
];

export default autoPricing;
