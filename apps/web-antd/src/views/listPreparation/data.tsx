/*
 * @Author: cwx
 * @Date: 2025-01-18 15:37:12
 * @LastEditTime: 2025-03-25 17:30:49
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
    field: 'DateRange',
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
    editRender: {
      name: 'ASelect',
      props: {
        placeholder: '请选择责任人',
        fieldNames: {
          label: 'Name',
          value: 'ID',
        },
        allowClear: true,
        showSearch: true,
        filterOption: (input: string, option: Record<string, any>) =>
          option.Name.indexOf(input) >= 0,
      },
    },
    formatter: ({ row }) => row.ResponsibleUserName,
  },
  {
    field: 'ReportedUserID',
    title: '汇报人',
    width: 120,
    editRender: {
      name: 'ASelect',
      props: {
        placeholder: '请选择汇报人',
        fieldNames: {
          label: 'Name',
          value: 'ID',
        },
        allowClear: true,
        showSearch: true,
        filterOption: (input: string, option: Record<string, any>) =>
          option.Name.indexOf(input) >= 0,
      },
    },
    formatter: ({ row }) => row.ReportedUserName,
  },
  {
    field: 'IPProjectState',
    title: '进度',
    width: 50,
    slots: { default: 'IPProjectState' },
  },
  {
    field: 'AuditStatus',
    title: '审批状态',
    width: 100,
    slots: { default: 'AuditStatus' },
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
    width: 180,
    fixed: 'right',
    slots: { default: 'action' },
  },
];
