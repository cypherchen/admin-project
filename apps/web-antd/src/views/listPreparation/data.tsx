/*
 * @Author: cwx
 * @Date: 2025-01-18 15:37:12
 * @LastEditTime: 2025-01-24 20:52:43
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
    editRender: { name: 'AInput' },
  },
  {
    field: 'Name',
    title: '名称',
    minWidth: 100,
    editRender: { name: 'AInput' },
  },
  {
    field: 'Type',
    title: '类型',
    width: 100,
    editRender: { name: 'AInput' },
  },
  {
    field: 'PlanTime',
    title: '计划开始时间',
    width: 130,
    editRender: {
      name: 'ADatePicker',
      props: { valueFormat: 'YYYY-MM-DD' },
    },
    formatter: ({ cellValue }: { cellValue: string }) =>
      cellValue?.slice(0, 10),
  },
  {
    field: 'PlanEndTime',
    title: '计划完成时间',
    width: 130,
    editRender: {
      name: 'ADatePicker',
      props: { valueFormat: 'YYYY-MM-DD' },
    },
    formatter: ({ cellValue }: { cellValue: string }) =>
      cellValue?.slice(0, 10),
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
    width: 85,
  },
  {
    field: 'AuditStatus',
    title: '审批状态',
    width: 100,
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
