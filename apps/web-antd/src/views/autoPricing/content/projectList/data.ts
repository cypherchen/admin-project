/*
 * @Author: cwx
 * @Date: 2026-01-26 19:26:01
 * @LastEditTime: 2026-01-26 19:53:15
 * @LastEditors: cwx
 * @Description:
 */
import type { VxeGridProps } from '#/adapter/vxe-table';

import { formatPrice } from '#/utils/number';

export const columns: VxeGridProps['columns'] = [
  { type: 'seq', width: 70, treeNode: true },
  {
    field: 'Code',
    title: '项目编码',
    width: 150,
  },
  {
    field: 'Name',
    title: '名称',
    width: 200,
    slots: { default: 'Name' },
  },
  {
    field: 'Feature',
    title: '项目特征',
    width: 300,
  },
  {
    field: 'Unit',
    title: '单位',
    width: 80,
  },
  {
    field: 'Quantity',
    title: '数量',
    width: 100,
    formatter: ({ cellValue }) =>
      cellValue ? Number(cellValue).toFixed(3) : '',
  },
  {
    field: 'UnitPrice',
    title: '除税价',
    width: 100,
    formatter: ({ cellValue }) =>
      formatPrice(cellValue ? Number(cellValue).toFixed(2) : ''),
  },
  {
    field: 'TaxUnitPrice',
    title: '含税价',
    width: 100,
    formatter: ({ cellValue }) =>
      formatPrice(cellValue ? Number(cellValue).toFixed(2) : ''),
  },
  {
    field: 'TotalPrice',
    title: '除税合价',
    width: 150,
    formatter: ({ cellValue }) =>
      formatPrice(cellValue ? Number(cellValue).toFixed(2) : ''),
  },
  {
    field: 'TaxTotalPrice',
    title: '含税合价',
    width: 150,
    formatter: ({ cellValue }) =>
      formatPrice(cellValue ? Number(cellValue).toFixed(2) : ''),
  },
  {
    field: 'Rate',
    title: '税率',
    width: 80,
    formatter: ({ cellValue }) =>
      formatPrice(cellValue ? Number(cellValue).toFixed(2) : ''),
  },
  {
    field: 'DeclineRate',
    title: '下浮率',
    width: 80,
    formatter: ({ cellValue }) =>
      formatPrice(cellValue ? Number(cellValue).toFixed(2) : ''),
  },
  {
    field: 'PriceSource',
    title: '价格来源',
    width: 250,
  },
  {
    field: 'Remark',
    title: '备注',
    width: 150,
  },
  {
    field: 'action',
    title: '操作',
    width: 80,
    fixed: 'right',
    slots: { default: 'action' },
  },
];

export const searchFormSchema = [
  {
    label: '名称',
    fieldName: 'Name',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    colProps: { span: 6 },
  },
];
