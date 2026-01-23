/*
 * @Author: cwx
 * @Date: 2026-01-22 09:07:39
 * @LastEditTime: 2026-01-22 10:47:18
 * @LastEditors: cwx
 * @Description:
 */
import type { VxeGridProps } from '#/adapter/vxe-table';

export const columns: VxeGridProps['columns'] = [
  {
    type: 'checkbox',
    width: 60,
  },
  {
    field: 'Code',
    title: '编号',
    width: 200,
  },
  {
    field: 'Name',
    title: '名称',
    minWidth: 200,
  },
  {
    field: 'Type',
    title: '类型',
    width: 200,
  },
  {
    field: 'CreatedTime',
    title: '创建时间',
    width: 200,
  },
  {
    field: 'UpdatedTime',
    title: '修改时间',
    width: 200,
  },
];

export const searchFormSchema = [
  {
    label: '名称',
    fieldName: 'Name',
    component: 'Input',
    componentProps: {
      placeholder: '请输入名称',
    },
    span: 8,
  },
];
