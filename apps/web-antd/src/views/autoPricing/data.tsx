/*
 * @Author: cwx
 * @Date: 2026-01-15 11:03:01
 * @LastEditTime: 2026-01-23 17:18:52
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
    minWidth: 120,
    editRender: {
      name: 'AInput',
    },
  },
  {
    field: 'Type',
    title: '类型',
    width: 100,
    editRender: {
      name: 'ASelect',
      props: {
        placeholder: '请选择类型',
        options: [
          { label: '工程', value: '工程' },
          { label: '设备', value: '设备' },
          { label: '规费', value: '规费' },
        ],
      },
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
          option.Name.includes(input),
      },
    },
    formatter: ({ row }) => row.ResponsibleUserName || '',
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
          option.Name.includes(input),
      },
    },
    formatter: ({ row }) => row.ReportedUserName || '',
  },
  {
    field: 'RLCProjectState',
    title: '进度',
    width: 80,
    slots: { default: 'RLCProjectState' },
  },
  {
    field: 'RLCAuditStatus',
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
