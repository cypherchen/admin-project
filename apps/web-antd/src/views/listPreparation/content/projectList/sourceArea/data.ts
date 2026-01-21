/*
 * @Author: cwx
 * @Date: 2026-01-20 11:59:16
 * @LastEditTime: 2026-01-20 15:38:36
 * @LastEditors: cwx
 * @Description:
 */
import type { VxeGridProps } from '#/adapter/vxe-table';

export const columns: VxeGridProps['columns'] = [
  {
    type: 'checkbox',
    width: 50,
  },
  {
    type: 'seq',
    width: 70,
  },
  {
    field: 'Code',
    title: '项目编码',
    width: 150,
  },
  {
    field: 'Name',
    title: '项目名称',
    width: 200,
  },
  {
    field: 'Feature',
    title: '项目特征',
    showOverflow: 'tooltip',
    minWidth: 200,
  },
  {
    field: 'Unit',
    title: '单位',
    width: 100,
  },
];
