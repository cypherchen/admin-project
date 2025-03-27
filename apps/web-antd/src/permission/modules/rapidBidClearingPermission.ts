/*
 * @Author: cwx
 * @Date: 2024-05-07 11:40:03
 * @LastEditTime: 2025-03-27 19:02:46
 * @LastEditors: cwx
 * @Description: 快速清单权限
 */

import type { PermissionModule } from '..';

const rapidBidClearing: PermissionModule = {
  name: '快速清标',
  key: 'rapidBidClearing',
  // 主页面
  auth: [
    // 项目列表权限
    {
      name: '项目_查看全部',
      key: 'rapidBidClearing_project:queryAll',
    },
    // {
    //   name: "项目_修改",
    //   key: "rapidBidClearing_project:update",
    // },
    {
      name: '项目_发起审批',
      key: 'rapidBidClearing_project:approval',
    },
    {
      name: '项目_自定义审批人',
      key: 'rapidBidClearing_project:customApproval',
    },
  ],
};

const rapidBidClearing_import = {
  name: '导入工程',
  key: 'rapidBidClearing_import',
  auth: [
    {
      name: '导入工程_导入Excel',
      key: 'rapidBidClearing_import:import',
    },
    {
      name: '导入工程_一键导入',
      key: 'rapidBidClearing_import:quickImport',
    },
    {
      name: '导入工程_删除工程',
      key: 'rapidBidClearing_import:delete',
    },
  ],
};
const rapidBidClearing_composition = {
  name: '成本组成',
  key: 'rapidBidClearing_composition',
  auth: [],
};

const rapidBidClearing_inspect = {
  name: '清单核查',
  key: 'rapidBidClearing_inspect',
  auth: [
    {
      name: '清单核查_一键核查',
      key: 'rapidBidClearing_inspect:inspect',
    },
    {
      name: '清单核查_导出excel',
      key: 'rapidBidClearing_inspect:export',
    },
  ],
};

const rapidBidClearing_analyze = {
  name: '价格分析',
  key: 'rapidBidClearing_analyze',
  auth: [
    {
      name: '价格分析_导出Excel',
      key: 'rapidBidClearing_analyze:export',
    },
    {
      name: '价格分析_计算分析',
      key: 'rapidBidClearing_analyze:calculate',
    },
    {
      name: '价格分析_修改',
      key: 'rapidBidClearing_analyze:update',
    },
    {
      name: '价格分析_合理价设置',
      key: 'rapidBidClearing_analyze:petitPrix',
    },
    {
      name: '价格分析_对比基准',
      key: 'rapidBidClearing_analyze:compareBase',
    },
  ],
};

const rapidBidClearing_regularity = {
  name: '规律性分析',
  key: 'rapidBidClearing_regularity',
  auth: [
    {
      name: '规律性分析_条件设置',
      key: 'rapidBidClearing_regularity:condition',
    },
    {
      name: '规律性分析_计算分析',
      key: 'rapidBidClearing_regularity:calculate',
    },
  ],
};

const rapidBidClearing_params = {
  name: '项目信息',
  key: 'rapidBidClearing_params',
  auth: [],
};

const rapidBidClearing_calculate = {
  name: '计算分析',
  key: 'rapidBidClearing_calculate',
  auth: [
    {
      name: '计算分析_导出Excel',
      key: 'rapidBidClearing_calculate:export',
    },
    {
      name: '计算分析_计算分析',
      key: 'rapidBidClearing_calculate:calculate',
    },
    {
      name: '计算分析_修改',
      key: 'rapidBidClearing_calculate:update',
    },
  ],
};

const rapidBidClearing_indicator = {
  name: '指标对比',
  key: 'rapidBidClearing_indicator',
  auth: [
    {
      name: '指标对比_条件设置',
      key: 'rapidBidClearing_indicator:condition',
    },
    {
      name: '指标对比_修改',
      key: 'rapidBidClearing_indicator:update',
    },
  ],
};

const rapidBidClearing_report = {
  name: '成果汇报',
  key: 'rapidBidClearing_report',
  auth: [
    {
      name: '导出excel',
      key: 'rapidBidClearing_report:update',
    },
    {
      name: '商务条款_修改',
      key: 'rapidBidClearing_report:updateCommerceClause',
    },
    {
      name: '报价汇总_计算分析',
      key: 'rapidBidClearing_report:calculateQuotationSummary',
    },
    {
      name: '报价汇总_修改',
      key: 'rapidBidClearing_report:updateQuotationSummary',
    },
    {
      name: '指标汇总_选择中标供应商',
      key: 'rapidBidClearing_report:setWinningSupplier',
    },
    {
      name: '综合评价表_修改',
      key: 'rapidBidClearing_report:updateComprehensiveEvaluationTable',
    },
  ],
};

const rapidBidClearing_reflux = {
  name: '数据回流',
  key: 'rapidBidClearing_reflux',
  auth: [
    {
      name: '数据回流_选择回流数据',
      key: 'rapidBidClearing_reflux:setRefluxData',
    },
    {
      name: '数据回流_删除',
      key: 'rapidBidClearing_reflux:delete',
    },
  ],
};

rapidBidClearing.tabs = [
  rapidBidClearing_import,
  rapidBidClearing_composition,
  rapidBidClearing_inspect,
  rapidBidClearing_analyze,
  rapidBidClearing_regularity,
  rapidBidClearing_params,
  rapidBidClearing_calculate,
  rapidBidClearing_indicator,
  rapidBidClearing_report,
  rapidBidClearing_reflux,
];

export default rapidBidClearing;
