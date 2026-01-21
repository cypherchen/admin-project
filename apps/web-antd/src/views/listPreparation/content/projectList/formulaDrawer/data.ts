import type { VxeGridProps } from '#/adapter/vxe-table';

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 50 },
  { title: '序号', type: 'seq', width: 50 },
  {
    field: 'Explain',
    title: '说明',
    minWidth: 150,
    editRender: { name: 'AInput' },
  },
  {
    field: 'Formula',
    title: '计算式',
    minWidth: 200,
    editRender: { name: 'AInput' },
  },
  { field: 'Result', title: '结果', width: 100 },
  {
    field: 'IsAccrual',
    title: '是否累加',
    width: 100,
    slots: {
      default: 'IsAccrual',
    },
  },
];
