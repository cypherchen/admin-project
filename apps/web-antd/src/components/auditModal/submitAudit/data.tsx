/*
 * @Author: cwx
 * @Date: 2025-03-21 10:47:48
 * @LastEditTime: 2025-03-24 09:18:28
 * @LastEditors: cwx
 * @Description:
 */
import { type VbenFormSchema } from '@vben/common-ui';

export const formSchema: VbenFormSchema[] = [
  {
    component: 'Select',
    componentProps: {
      placeholder: '请选择审批模板',
      fieldNames: {
        label: 'Name',
        value: 'ID',
      },
      filterOption: (input: string, option: Record<string, any>) =>
        option.Name.indexOf(input) >= 0,
      showSearch: true,
    },
    fieldName: 'WorkflowTemplate_ID',
    label: '审批模板',
    rules: 'selectRequired',
  },
  {
    component: 'Select',
    componentProps: {
      placeholder: '请选择审批人',
      mode: 'multiple',
      allowClear: true,
      fieldNames: {
        label: 'UserName',
        value: 'ID',
      },
      filterOption: (input: string, option: Record<string, any>) =>
        option.UserName.indexOf(input) >= 0,
      showSearch: true,
    },
    fieldName: 'Reviewer',
    label: '审批人',
    rules: 'selectRequired',
  },
  {
    component: 'Select',
    componentProps: {
      placeholder: '请选择抄送人',
      mode: 'multiple',
      allowClear: true,
      fieldNames: {
        label: 'UserName',
        value: 'ID',
      },
      filterOption: (input: string, option: Record<string, any>) =>
        option.UserName.indexOf(input) >= 0,
      showSearch: true,
    },
    fieldName: 'CCRecipient',
    label: '抄送人',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入审批标题',
    },
    fieldName: 'Name',
    label: '审批标题',
    rules: 'required',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入备注',
    },
    fieldName: 'Remark',
    label: '备注',
  },
];
