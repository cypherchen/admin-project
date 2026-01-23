/*
 * @Author: cwx
 * @Date: 2026-01-21 17:22:59
 * @LastEditTime: 2026-01-23 16:16:14
 * @LastEditors: cwx
 * @Description:
 */
import { round } from 'lodash';

import type { VxeGridProps } from '#/adapter/vxe-table';

function formatPrice({ cellValue }: Record<string, any>) {
  return cellValue ? round(cellValue, 2) : '';
}

function formatQuantity({ cellValue }: Record<string, any>) {
  return cellValue ? round(cellValue, 3) : '';
}

export const columns: VxeGridProps['columns'] = [
  { type: 'seq', width: 80, treeNode: true },
  {
    field: 'BenchMarkFile',
    title: '基准文件',
    children: [
      {
        field: 'BCode',
        title: '清单编号',
        width: 120,
      },
    ],
  },
  {
    field: 'BenchMarkFile_Name',
    title: '基准文件名',
    slots: {
      header: 'BenchMarkFile_Name_header',
    },
    children: [
      {
        field: 'BName',
        title: '清单名称',
        width: 150,
      },
      {
        field: 'BFeature',
        title: '清单特征',
        minWidth: 150,
      },
      {
        field: 'BUnit',
        title: '单位',
        width: 80,
      },
      {
        field: 'BQuantity',
        title: '工程量',
        width: 100,
        formatter: formatQuantity,
      },
    ],
  },
  {
    field: 'ContrastFile',
    title: '对比文件',
    children: [
      {
        field: 'CCode',
        title: '清单编号',
        width: 120,
      },
    ],
  },
  {
    field: 'ContrastFile_Name',
    title: '对比文件名',
    slots: {
      header: 'ContrastFile_Name_header',
    },
    children: [
      {
        field: 'CName',
        title: '清单名称',
        width: 150,
      },
      {
        field: 'CFeature',
        title: '清单特征',
        minWidth: 150,
      },
      {
        field: 'CUnit',
        title: '单位',
        width: 80,
      },
      {
        field: 'CQuantity',
        title: '工程量',
        width: 100,
        formatter: formatQuantity,
      },
    ],
  },
  {
    field: 'DifferenceRate',
    title: '差异率(%)',
    width: 70,
    formatter: formatPrice,
  },
  {
    field: 'Result',
    title: '核查结果',
    width: 100,
  },
];
