/*
 * @Author: cwx
 * @Date: 2025-01-26
 * @LastEditTime: 2026-01-26
 * @LastEditors: cwx
 * @Description: 自动套价目录树数据
 */
import type { VxeGridProps } from '#/adapter/vxe-table';

export const monomerColumns: VxeGridProps['columns'] = [
  {
    type: 'checkbox',
    width: 50,
  },
  {
    field: 'MonomerName',
    title: '单体名称',
  },
  {
    field: 'MonomerCode',
    title: '单体编码',
  },
  {
    field: 'MonomerHierarchyCode',
    title: '单体完整编码',
  },
];

export const matColumns: VxeGridProps['columns'] = [
  {
    type: 'checkbox',
    width: 50,
  },
  {
    field: 'MatCode',
    title: '物料编码',
    width: 150,
  },
  {
    field: 'MatName',
    title: '物料名称',
    width: 150,
  },
  {
    field: 'MatFeature',
    title: '物料规格',
  },
];
