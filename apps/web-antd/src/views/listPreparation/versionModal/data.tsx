/*
 * @Author: cwx
 * @Date: 2025-03-19 22:47:57
 * @LastEditTime: 2025-03-21 17:00:07
 * @LastEditors: cwx
 * @Description:
 */
import type { VxeGridProps } from '#/adapter/vxe-table';

export const columns: VxeGridProps['columns'] = [
  {
    field: 'Name',
    title: '版本名称',
    minWidth: 200,
    editRender: {
      name: 'AInput',
    },
  },
  {
    field: 'Label',
    title: '标签',
    width: 150,
    editRender: {
      name: 'ASelect',
    },
  },
  {
    field: 'CreatedTime',
    title: '创建时间',
    width: 150,
  },
  {
    field: 'CreatedUserInfo',
    title: '创建人',
    width: 150,
    formatter: ({ cellValue }: Record<string, any>) =>
      JSON.parse(cellValue)?.UserName,
  },
  {
    field: 'action',
    title: '操作列',
    width: 100,
    fixed: 'right',
    slots: { default: 'action' },
  },
];
