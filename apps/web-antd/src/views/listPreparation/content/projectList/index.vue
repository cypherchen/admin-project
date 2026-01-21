<!--
 * @Author: cwx
 * @Date: 2026-01-15 09:00:26
 * @LastEditTime: 2026-01-21 10:11:35
 * @LastEditors: cwx
 * @Description: 清单编制-项目清单
-->
<script setup lang="ts">
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  useVbenDrawer,
  useVbenModal,
} from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { Button, InputSearch, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getListPreparationByProjectID,
  getListPreparationCanSubmit,
} from '#/api/listPreparationApi/listPreparationApi';
import {
  batchPostListPreparationList,
  deleteListPreparationList,
  exportListPreparationList,
  exportListPreparationQuoteList,
  getListPreparationList,
  putListPreparationList,
  putListPreparationListReplace,
} from '#/api/listPreparationApi/listPreparationListApi';
import { createSubmitAuditModal } from '#/components/auditModal';
import { Authority, hasPermission } from '#/components/authority';
import { ImportFile } from '#/components/basicUpload';
import { TableAction } from '#/components/tableAction';
import { listPreparationPermission } from '#/permission';
import { downloadByData } from '#/utils/download';

import { columns } from './data';
import FormulaDrawer from './formulaDrawer/formulaDrawer.vue';
import ProjectListForm from './projectListForm/projectListForm.vue';
import SourceArea from './sourceArea/sourceArea.vue';

const props = withDefaults(defineProps<Props>(), {
  currentNode: () => ({}),
});

const permission = listPreparationPermission!.项目清单;

interface Props {
  currentNode?: Record<string, any>;
}

const { currentRoute, resolve, push } = useRouter();
const vId = currentRoute.value.params.vId as string;
const pId = currentRoute.value.params.pId as string;
const bId = currentRoute.value.params.bId as string;

const userStore = useUserStore();
const orgId = userStore.userInfo!.Orz_ID;

const uploadAction = computed(
  () => `/api/IPProjectVersion/${orgId}/${pId}/ImportList/${vId}`,
);

const auditStatus = currentRoute.value.query.auditStatus as string;
const disabledByAudit = computed(() => [1, 2].includes(Number(auditStatus)));
const disabledByCategory = computed(
  () => props.currentNode?.treeState?.level !== 3,
);
const disabled = computed(
  () => disabledByAudit.value || disabledByCategory.value,
);

const [FormulaDrawerOuter, formulaDrawerApi] = useVbenDrawer({
  connectedComponent: FormulaDrawer,
});

const keyword = ref<string>('');
const currentRecord = ref<Record<string, any>>({});
const currentProject = ref<Record<string, any>>({});
const formTitle = ref<string>('新增');

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: ProjectListForm,
});

const gridOptions: VxeGridProps = {
  columns,
  height: 'auto',
  treeConfig: {
    expandAll: true,
  },
  pagerConfig: {
    enabled: false,
  },
  editConfig: {
    enabled: hasPermission(permission.清单_修改, 'auth'),
    beforeEditMethod: () => !disabledByAudit.value,
  },
  rowConfig: {
    isCurrent: true,
  },
  proxyConfig: {
    ajax: {
      query: async () => {
        if (!props.currentNode.ID) return { List: [] };
        const params = {
          Order: 'Sort asc',
          Obj: keyword.value,
        };
        return getListPreparationList({
          vId,
          treeId: props.currentNode.ID,
          params,
        });
      },
    },
  },
};

const gridEvents: VxeGridListeners = {
  editClosed: async ({ row, column }) => {
    if (row[column.field] === column.model?.value) {
      return;
    }
    const data: Record<string, any> = {
      ID: row.ID,
      [column.field as string]: row[column.field] ?? null,
    };
    await putListPreparationList(vId, props.currentNode.ID, data);
    message.success('修改成功');
    gridApi.reload();
  },
};

const [VbenVxeGrid, gridApi] = useVbenVxeGrid({
  gridOptions: gridOptions as VxeGridProps,
  gridEvents,
} as any);

watch(
  () => props.currentNode,
  (val) => {
    if (val.ID) {
      gridApi.reload();
      formulaDrawerApi?.close();
    }
  },
);

function createData() {
  currentRecord.value = {};
  formTitle.value = '新增';
  formModalApi.setData({
    currentNode: props.currentNode,
    currentRecord: {},
    formTitle: '新增',
  });
  formModalApi.open();
}

async function deleteData() {
  const checked = gridApi.grid?.getCheckboxRecords();
  if (!checked || checked.length === 0) {
    message.error('未勾选数据');
    return;
  }

  Modal.confirm({
    title: '提示',
    content: '是否删除选中的数据?',
    onOk: async () => {
      const data = checked.map((n: Record<string, any>) => n.ID);
      await deleteListPreparationList(vId, props.currentNode.ID, data);
      message.success('删除成功');
      gridApi.reload();
    },
  });
}

async function uploadSuccess() {
  message.success('导入成功');
  gridApi.reload();
}

async function exportExcel() {
  const res = await exportListPreparationList(orgId, pId, vId);
  downloadByData(
    res,
    `清单编制-【${currentProject.value.BaseTreeName}】-${currentProject.value.Name}-清单.xls`,
  );
}

async function exportQuote() {
  const res = await exportListPreparationQuoteList(orgId, pId, vId);
  downloadByData(
    res,
    `清单编制-【${currentProject.value.BaseTreeName}】-${currentProject.value.Name}-报价清单.xlsm`,
  );
}

async function handleAudit() {
  if (!currentProject.value.ID) {
    return message.error('未找到项目信息');
  }
  const row: Record<string, any> = currentProject.value;

  if ([1, 2].includes(row.AuditStatus)) {
    return message.error('该项目已发起审批');
  }

  const canSubmitRes = await getListPreparationCanSubmit(row.ID);

  if (!canSubmitRes.Value) {
    return message.error('请填写项目信息中的必填项');
  }

  const schema = [
    { field: 'BaseTreeName', title: '基地名称' },
    { field: 'Code', title: '编号' },
    { field: 'Name', title: '名称' },
    { field: 'Type', title: '类型' },
    { field: 'PlanTime', title: '计划开始时间' },
    { field: 'PlanEndTime', title: '计划结束时间' },
    { field: 'ResponsibleUserName', title: '责任人' },
    { field: 'ReportedUserName', title: '汇报人' },
    { field: 'IPProjectState', title: '进度' },
    { field: 'CreatedTime', title: '创建时间' },
    { field: 'UpdatedTime', title: '修改时间' },
  ];

  const data: Record<string, any> = {
    ...row,
    IPProjectState: '已完成',
    PlanTime: row.PlanTime?.slice(0, 10),
    PlanEndTime: row.PlanEndTime?.slice(0, 10),
  };

  const linkUrl = resolve({
    name: 'listPreparationDetail',
    params: { bId, pId, vId },
    query: { auditStatus: 1 },
  }).href;

  const params = {
    tableName: 'IPProject',
    auditName: `【清单编制】-【${row.BaseTreeName || ''}】-${row.Name || ''}`,
    schema,
    data,
    linkUrl,
    customizable: hasPermission(
      listPreparationPermission!.清单编制.项目_自定义审批人,
      'auth',
    ),
    submit: () => {
      setTimeout(() => {
        push({ name: 'listPreparation', params: { bId } });
      }, 500);
    },
  };

  createSubmitAuditModal(params);
}

function createdChild(record: Record<string, any>) {
  currentRecord.value = record;
  formTitle.value = '新增子项';
  formModalApi.setData({
    currentNode: props.currentNode,
    currentRecord: record,
    formTitle: '新增子项',
  });
  formModalApi.open();
}

async function deleteRow(record: Record<string, any>) {
  const data = [
    record.ID,
    ...(record.children
      ? record.children.map((n: Record<string, any>) => n.ID)
      : []),
  ];
  await deleteListPreparationList(vId, props.currentNode.ID, data);
  message.success('删除成功');
  gridApi.reload();
}

async function openFormulaDrawer(record: Record<string, any>) {
  // 不使用setData是因为抽屉内部需要响应式的record, 一般情况使用setData传递数据
  formulaDrawerApi.setState({
    sharedData: { record, disabled: disabled.value },
  });
  formulaDrawerApi.open();
}

async function handleBatchAdd(value: Record<string, any>) {
  if (value.IDList.length === 0) {
    message.error('未选择增加的数据');
    return;
  }

  const parents: Record<string, any>[] = gridApi.grid
    ?.getCheckboxRecords()
    .filter((n) => !n.Parent_ID);

  if (parents.length > 1) {
    message.error('只能勾选一个父项');
    return;
  }
  if (value.SourceType === 1 && parents.length > 0) {
    message.error('清单不能作为子项添加');
    return;
  }

  if (parents.length === 1) {
    value.Parent_ID = parents[0]!.ID;
  }

  await batchPostListPreparationList(vId, props.currentNode.ID, value);
  message.success('添加成功');
  gridApi.reload();
}

async function handleReplace(value: null | Record<string, any>) {
  if (!value) {
    message.error('未点选数据源');
    return;
  }
  const row: Record<string, any> = gridApi.grid?.getCurrentRecord();
  if (!row) {
    message.error('未点选目标数据');
    return;
  }

  if (value.SourceType === 0 && row.Parent_ID) {
    return message.error('清单不能作为子项替换');
  }

  Modal.confirm({
    title: '提示',
    content: `是否使用【${value.Code}-${value.Name}】替换【${row.Code}-${row.Name}】?`,
    onOk: async () => {
      await putListPreparationListReplace(vId, props.currentNode.ID, {
        OldID: row.ID,
        NewID: value.SourceID,
        Type: value.SourceType,
      });
      message.success('替换成功');
      gridApi.reload();
    },
  });
}

onMounted(async () => {
  const res = await getListPreparationByProjectID(orgId, pId);
  currentProject.value = res.List[0] || {};
});
</script>

<template>
  <ResizablePanelGroup direction="vertical" class="h-full w-full">
    <ResizablePanel :default-size="50" :min-size="20">
      <VbenVxeGrid>
        <template #table-title>
          <Authority :value="permission.清单_新增">
            <Button
              type="primary"
              class="mr-2"
              :disabled="disabled"
              @click="createData"
            >
              新增
            </Button>
          </Authority>
          <Authority :value="permission.清单_删除">
            <Button
              danger
              :disabled="disabled"
              @click="deleteData"
              class="mr-2"
            >
              删除
            </Button>
          </Authority>
          <Authority :value="permission.清单_导入">
            <ImportFile
              :action="uploadAction"
              :accept="['.xls', '.xlsx']"
              :show-file-list="false"
              @success="uploadSuccess"
            >
              <template #default="{ uploadFile }">
                <Button
                  class="mr-2"
                  :disabled="disabledByAudit"
                  @click="uploadFile"
                >
                  导入清单
                </Button>
              </template>
            </ImportFile>
          </Authority>
          <Authority :value="permission.清单_导出">
            <Button class="mr-2" @click="exportExcel">导出清单</Button>
          </Authority>
          <Authority :value="permission.清单_导出报价">
            <Button class="mr-2" @click="exportQuote">导出报价清单</Button>
          </Authority>
          <Authority :value="permission.清单_发起审批">
            <Button :disabled="disabledByAudit" @click="handleAudit">
              发起审批
            </Button>
          </Authority>
        </template>
        <template #toolbar-tools>
          <InputSearch
            v-model:value="keyword"
            placeholder="请输入名称或特征关键字, 多关键字以空格分隔"
            class="w-[350px]"
            @search="gridApi.reload()"
          />
        </template>
        <template #action="{ row }">
          <TableAction
            :actions="[
              {
                icon: 'PlusCircleOutlined',
                model: 'button',
                tooltip: '新增子项',
                ifShow: !row.Parent_ID,
                disabled: disabled || !hasPermission(permission.清单_新增),
                onClick: createdChild.bind(null, row),
              },
              {
                icon: 'FunctionOutlined',
                model: 'button',
                tooltip: '工程量计算式',
                onClick: openFormulaDrawer.bind(null, row),
              },
              {
                icon: 'DeleteOutlined',
                model: 'confirm',
                tooltip: '删除',
                color: 'error',
                disabled: disabled || !hasPermission(permission.清单_删除),
                popConfirm: {
                  title: '是否删除该数据?',
                  confirm: deleteRow.bind(null, row),
                },
              },
            ]"
          />
        </template>
      </VbenVxeGrid>
    </ResizablePanel>
    <ResizableHandle with-handle />
    <ResizablePanel :default-size="50" :min-size="10">
      <SourceArea
        :current-node="currentNode"
        :disabled="disabled"
        @add-data="handleBatchAdd"
        @replace-data="handleReplace"
      />
    </ResizablePanel>
  </ResizablePanelGroup>
  <FormModal @reload="gridApi.reload()" />
  <FormulaDrawerOuter @reload="gridApi.reload()" />
</template>
