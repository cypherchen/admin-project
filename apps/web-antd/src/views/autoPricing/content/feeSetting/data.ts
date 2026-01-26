/*
 * @Author: cwx
 * @Date: 2026-01-26 11:47:45
 * @LastEditTime: 2026-01-26 14:35:01
 * @LastEditors: cwx
 * @Description:
 */
import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

export const feeTypeOptions = [
  '材料费',
  '安装费',
  '运费',
  '管理费',
  '利润',
  '安全文明施工费',
  '税金',
  '综合单价',
].map((item) => ({ label: item, value: item }));

export const columns: VxeGridProps['columns'] = [
  {
    type: 'seq',
    width: 70,
    treeNode: true,
  },
  {
    field: 'Identification',
    title: '标识',
    width: 300,
  },
  {
    field: 'Name',
    title: '名称',
    editRender: {
      name: 'ASelect',
      options: feeTypeOptions,
      props: { placeholder: '请选择' },
    },
  },
  {
    field: 'Rate',
    title: '费率',
    width: 200,
    editRender: {
      name: 'AInputNumber',
      props: { min: 0, placeholder: '请输入' },
    },
  },
  {
    field: 'CalculationFormula',
    title: '计算式',
    width: 400,
    editRender: {
      name: 'AInput',
      props: { placeholder: '请输入' },
    },
  },
];

export const searchFormSchema: VbenFormSchema[] = [
  {
    fieldName: 'Name',
    label: '名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
  },
];
