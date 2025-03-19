/*
 * @Author: cwx
 * @Date: 2025-01-24 20:56:52
 * @LastEditTime: 2025-03-19 11:24:39
 * @LastEditors: cwx
 * @Description:
 */
import { type VbenFormSchema } from '@vben/common-ui';

export const formSchema: VbenFormSchema[] = [
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
    component: 'BasicUpload',
    componentProps: {
      maxCount: 2,
      action: '/api/SysFile',
      accept: ['.png', '.jpg', '.jpeg', '.tif'],
      listType: 'picture-card',
      disabled: false,
      multiple: true,
    },
    fieldName: 'Files',
    label: '附件',
    rules: 'selectRequired',
  },
];
