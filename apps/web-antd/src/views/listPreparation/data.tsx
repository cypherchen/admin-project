/*
 * @Author: cwx
 * @Date: 2025-01-18 15:37:12
 * @LastEditTime: 2025-03-19 19:04:03
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
      placeholder: '请输入名称',
    },
  },
];

export const columns: VxeGridProps['columns'] = [
  {
    type: 'seq',
    width: 70,
    treeNode: true,
  },
  {
    field: 'Code',
    title: '编号',
    width: 100,
    editRender: {
      name: 'AInput',
    },
  },
  {
    field: 'Name',
    title: '名称',
    minWidth: 100,
    editRender: {
      name: 'AInput',
    },
  },
  {
    field: 'Time',
    title: '计划时间',
    width: 250,
    editRender: {
      name: 'ARangePicker',
      props: {
        valueFormat: 'YYYY-MM-DD',
      },
    },
    formatter: ({ cellValue }: Record<string, any>) =>
      cellValue?.length > 0 ? cellValue.join(' ~ ') : '',
  },
  {
    field: 'ResponsibleUserID',
    title: '责任人',
    width: 120,
    editRender: { name: 'ASelect' },
  },
  {
    field: 'ReportedUserID',
    title: '汇报人',
    width: 120,
    editRender: { name: 'ASelect' },
  },
  {
    field: 'IPProjectState',
    title: '进度',
    width: 100,
    slots: { default: 'IPProjectState' },
  },
  {
    field: 'AuditStatus',
    title: '审批状态',
    width: 100,
    cellRender: { name: 'AuditStatus' },
  },
  {
    field: 'CreatedTime',
    title: '创建时间',
    width: 165,
  },
  {
    field: 'UpdatedTime',
    title: '修改时间',
    width: 165,
  },
  {
    field: 'action',
    title: '操作',
    width: 100,
    fixed: 'right',
    slots: { default: 'action' },
  },
];
