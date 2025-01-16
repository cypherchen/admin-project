export const searchFormSchema = [
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入名称',
    },
    defaultValue: '1',
    fieldName: 'Name',
    label: '名称',
  },
];

export const columns = [
  {
    type: 'seq',
    width: 70,
    treeNode: true,
  },
  {
    field: 'Code',
    title: '编号',
    width: 100,
    component: 'vxe-input',
    componentProps: {
      placeholder: '请输入',
    },
  },
  {
    field: 'Name',
    title: '名称',
    minWidth: 100,
    component: 'vxe-input',
    componentProps: {
      placeholder: '请输入',
    },
  },
  {
    field: 'Type',
    title: '类型',
    width: 100,
    component: 'vxe-input',
    componentProps: {
      placeholder: '请输入',
    },
  },
  {
    field: 'PlanTime',
    title: '计划开始时间',
    width: 130,
    component: 'vxe-input',
    componentProps: {
      placeholder: '请输入',
      type: 'date',
      transfer: true,
    },
    formatter: ({ cellValue }: { cellValue: string }) =>
      cellValue?.slice(0, 10),
  },
  {
    field: 'PlanEndTime',
    title: '计划完成时间',
    width: 130,
    component: 'vxe-input',
    componentProps: {
      placeholder: '请输入',
      type: 'date',
      transfer: true,
    },
    formatter: ({ cellValue }: { cellValue: string }) =>
      cellValue?.slice(0, 10),
  },
  {
    field: 'ResponsibleUserID',
    title: '责任人',
    width: 120,
    component: 'vxe-select',
    componentProps: {
      transfer: false,
      placeholder: '请输入',
      filterable: true,
      clearable: true,
      optionProps: {
        label: 'Name',
        value: 'ID',
      },
    },
  },
  {
    field: 'ReportedUserID',
    title: '汇报人',
    width: 120,
    component: 'vxe-select',
    componentProps: {
      transfer: false,
      placeholder: '请输入',
      filterable: true,
      clearable: true,
      optionProps: {
        label: 'Name',
        value: 'ID',
      },
    },
  },
  {
    field: 'IPProjectState',
    title: '进度',
    width: 85,
  },
  {
    field: 'AuditStatus',
    title: '审批状态',
    width: 100,
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
];
