/*
 * @Author: cwx
 * @Date: 2026-01-19 17:19:04
 * @LastEditTime: 2026-01-20 11:20:55
 * @LastEditors: cwx
 * @Description:
 */
import type { VbenFormProps } from '#/adapter/form';

import { z } from '#/adapter/form';

export const formSchema: VbenFormProps['schema'] = [
  {
    fieldName: 'Code',
    label: '项目编码',
    component: 'Input',
    rules: z.string().min(1, '请输入项目编号'),
  },
  {
    fieldName: 'Name',
    label: '项目名称',
    component: 'Input',
    rules: z.string().min(1, '请输入项目名称'),
  },
  {
    fieldName: 'Feature',
    label: '项目特征',
    component: 'Input',
  },
  {
    fieldName: 'Unit',
    label: '单位',
    component: 'UnitSelector',
  },
  {
    fieldName: 'Number',
    label: '工程量',
    component: 'InputNumber',
    componentProps: {
      min: 0,
      controls: false,
    },
  },
  {
    fieldName: 'Remark',
    label: '备注',
    component: 'Input',
  },
];
