/*
 * @Author: cwx
 * @Date: 2026-01-22 09:07:10
 * @LastEditTime: 2026-01-22 10:12:35
 * @LastEditors: cwx
 * @Description:
 */
import type { VxeGridProps } from '#/adapter/vxe-table';

export const columns: VxeGridProps['columns'] = [
  { type: 'seq', width: 50 },
  {
    field: 'ComparedName',
    title: '对比项名称',
  },
  {
    field: 'QuestionType',
    title: '问题类型(条)',
    children: [
      {
        field: 'Addition',
        title: '增项',
        width: 80,
      },
      {
        field: 'MissingItem',
        title: '缺项',
        width: 80,
      },
      {
        field: 'NameChange',
        title: '名称修改',
        width: 80,
      },
      {
        field: 'FeatureChange',
        title: '特征修改',
        width: 80,
      },
      {
        field: 'UnitChange',
        title: '单位修改',
        width: 80,
      },
      {
        field: 'QuantityChange',
        title: '工程量修改',
        width: 80,
      },
    ],
  },
  {
    field: 'Total',
    title: '问题合计',
    width: 80,
  },
];
