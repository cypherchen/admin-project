/*
 * @Author: cwx
 * @Date: 2026-01-17 21:24:35
 * @LastEditTime: 2026-01-18 00:55:29
 * @LastEditors: cwx
 * @Description:
 */
import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ParamsTypeEnum } from '#/enums/paramsTypeEnum';

export const searchFormSchema: VbenFormSchema[] = [
  {
    fieldName: 'Name',
    label: '名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入参数名称',
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
    field: 'Name',
    title: '名称',
    minWidth: 300,
    resizable: true,
    showOverflow: true,
  },
  {
    field: 'Unit',
    title: '单位',
    width: 120,
    resizable: true,
    showOverflow: true,
  },
  {
    field: 'InputType',
    title: '参数类型',
    width: 150,
    resizable: true,
    showOverflow: true,
    formatter: ({ cellValue }: { cellValue: number }) => {
      return ParamsTypeEnum[cellValue] ?? '';
    },
  },
  {
    field: 'IsRequired',
    title: '是否必填',
    width: 120,
    resizable: true,
    formatter: ({ cellValue }: { cellValue: boolean }) => {
      return cellValue ? '必填' : '';
    },
  },
  {
    field: 'Value',
    title: '参数值',
    minWidth: 200,
    resizable: true,
    editRender: {
      enabled: true,
    },
    slots: {
      edit: 'ValueEdit',
    },
  },
  {
    field: 'Remark',
    title: '备注',
    minWidth: 200,
    resizable: true,
    editRender: {
      name: 'AInput',
      props: {
        placeholder: '请输入',
      },
    },
  },
];
