/*
 * @Author: cwx
 * @Date: 2026-01-17 15:35:00
 * @LastEditors: cwx
 * @Description: 清单编制-项目导入-表格配置
 */
import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

export const searchFormSchema: VbenFormSchema[] = [
  {
    fieldName: 'FileName',
    label: '文件名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入文件名称',
    },
  },
];

export const columns: VxeGridProps['columns'] = [
  {
    field: 'FileName',
    title: '文件名称',
    resizable: true,
    showOverflow: true,
  },
  {
    field: 'CreatedUserInfo',
    title: '创建人',
    width: 200,
    resizable: true,
    formatter: ({ cellValue }: { cellValue: string }) => {
      return cellValue ? JSON.parse(cellValue).UserName : '';
    },
  },
  {
    field: 'CreatedTime',
    title: '创建时间',
    width: 260,
    resizable: true,
  },
];
