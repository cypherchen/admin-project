/*
 * @Author: cwx
 * @Date: 2025-01-24 20:56:52
 * @LastEditTime: 2025-03-26 09:31:16
 * @LastEditors: cwx
 * @Description:
 */
import { type VbenFormSchema } from '@vben/common-ui';

export const formSchema: VbenFormSchema[] = [
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入编号',
    },
    fieldName: 'Code',
    label: '编号',
    rules: 'required',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入名称',
    },
    fieldName: 'Name',
    label: '名称',
    rules: 'required',
  },
  {
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
    },
    fieldName: 'DateRange',
    label: '计划时间',
  },
  {
    component: 'Select',
    componentProps: {
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
    fieldName: 'ResponsibleUserID',
    label: '责任人',
  },
  {
    component: 'Select',
    componentProps: {
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
    fieldName: 'ReportedUserID',
    label: '汇报人',
  },
];
