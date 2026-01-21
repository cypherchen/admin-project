/*
 * @Author: cwx
 * @Date: 2026-01-19 17:18:52
 * @LastEditTime: 2026-01-20 16:41:42
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
    treeNode: true,
  },
  {
    field: 'Code',
    title: '项目编码',
    width: 150,
    editRender: { name: 'AInput' },
  },
  {
    field: 'Name',
    title: '项目名称',
    width: 200,
    editRender: { name: 'AInput' },
  },
  {
    field: 'Feature',
    title: '项目特征',
    minWidth: 200,
    editRender: { name: 'AInput' },
  },
  {
    field: 'Unit',
    title: '单位',
    width: 100,
    editRender: { name: 'UnitSelector' },
  },
  {
    field: 'Number',
    title: '工程量',
    width: 120,
    editRender: { name: 'AInputNumber', props: { controls: false, min: 0 } },
  },
  {
    field: 'Source',
    title: '清单来源',
    width: 150,
  },
  {
    field: 'Remark',
    title: '备注',
    width: 150,
    editRender: { name: 'AInput' },
  },
  {
    title: '操作',
    width: 100,
    fixed: 'right',
    slots: { default: 'action' },
  },
];
