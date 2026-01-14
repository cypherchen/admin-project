/*
 * @Author: cwx
 * @Date: 2025-03-27 16:18:55
 * @LastEditTime: 2025-03-27 23:49:17
 * @LastEditors: cwx
 * @Description:
 */
import type { VxeGridProps } from '#/adapter/vxe-table';

export const columns: VxeGridProps['columns'] = [
  {
    type: 'checkbox',
    width: 60,
  },
  {
    type: 'seq',
    width: 70,
    treeNode: true,
  },
  {
    field: 'name',
    title: '菜单/页签',
    width: 150,
  },
  {
    field: 'allChecked',
    title: '控制',
    width: 100,
    slots: { default: 'allChecked', header: 'allCheckedHeader' },
  },
  {
    field: 'auth',
    title: '权限',
    minWidth: 100,
    align: 'left',
    slots: { default: 'auth' },
  },
];
