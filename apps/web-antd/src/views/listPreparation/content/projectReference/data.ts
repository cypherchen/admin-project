/*
 * @Author: cwx
 * @Date: 2026-01-18 16:51:22
 * @LastEditTime: 2026-01-19 16:12:59
 * @LastEditors: cwx
 * @Description:
 */
import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

export const searchFormSchema: VbenFormSchema[] = [
  {
    fieldName: 'Name',
    label: '名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入项目名称',
    },
  },
];

export const columns: VxeGridProps['columns'] = [
  {
    type: 'seq',
    width: 70,
  },
  {
    field: 'Name',
    title: '项目名称',
    resizable: true,
    showOverflow: true,
  },
  {
    field: 'IsUse',
    title: '使用状态',
    width: 200,
    resizable: true,
    slots: { default: 'IsUse' },
  },
  {
    title: '操作',
    field: 'action',
    fixed: 'right',
    width: 140,
    slots: { default: 'action' },
  },
];
