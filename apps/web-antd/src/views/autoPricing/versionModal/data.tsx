/*
 * @Author: cwx
 * @Date: 2026-01-15 11:53:19
 * @LastEditTime: 2026-01-15 17:01:15
 * @LastEditors: cwx
 * @Description:
 */
import type { VxeGridProps } from '#/adapter/vxe-table';

export const columns: VxeGridProps['columns'] = [
  {
    type: 'seq',
    width: 60,
  },
  {
    field: 'Name',
    title: '版本名称',
    minWidth: 120,
    editRender: {
      name: 'AInput',
    },
  },
  {
    field: 'Label',
    title: '标签',
    minWidth: 120,
    editRender: {
      name: 'ASelect',
      props: {
        options: [
          {
            label: '初稿',
            value: '初稿',
          },
          {
            label: '过程稿',
            value: '过程稿',
          },
          {
            label: '终稿',
            value: '终稿',
          },
        ],
      },
    },
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
    title: '操作列',
    width: 100,
    fixed: 'right',
    slots: { default: 'action' },
  },
];
