<!--
 * @Author: cwx
 * @Date: 2024-12-19 20:55:28
 * @LastEditTime: 2026-01-14 21:33:03
 * @LastEditors: cwx
 * @Description: 清单编制台账页
-->
<template>
  <ColPage
    auto-content-height
    :left-width="15"
    :left-max-width="15"
    :left-min-width="2"
    split-handle
  >
    <template #left>
      <BaseTree :type="0" @node-click="nodeClick" />
    </template>
    <Grid class="ml-2">
      <template #toolbar-actions>
        <Flex gap="8" align="center">
          <Authority :value="permission.项目_新建">
            <Button type="primary" @click="handleCreate"> 新建 </Button>
          </Authority>
          <Authority :value="permission.项目_导入">
            <ImportFile
              label="导入Excel"
              :action="importAction"
              :accept="['.xlsx', '.xls']"
              @success="handleSuccess"
            >
            </ImportFile>
          </Authority>
          <Authority :value="permission.项目_手动更新">
            <Button @click="updateSSOT"> 手动更新 </Button>
          </Authority>
          <Authority :value="permission.项目_查看全部">
            <Switch v-model:checked="isMine" @change="gridApi.reload()">
              <template #checkedChildren>与我相关</template>
              <template #unCheckedChildren>全部</template>
            </Switch>
          </Authority>
        </Flex>
      </template>

      <template #IPProjectState="{ row }">
        <Progress
          type="circle"
          :percent="[0, 50, 100, 100][row.IPProjectState]"
          :size="20"
          :status="
            [undefined, 'normal', 'normal', 'exception'][row.IPProjectState] as any
          "
          :format="
            () => ['未启动', '进行中', '已完成', '已延期'][row.IPProjectState]
          "
        ></Progress>
      </template>
      <template #AuditStatus="{ row }">
        <AuditStatus
          v-if="!row.children.length"
          :status="row.AuditStatus"
          :instanceId="row.WorkflowInstance_ID"
          @close="gridApi.reload()"
        ></AuditStatus>
      </template>

      <template #action="{ row }">
        <TableAction
          :actions="[
            {
              icon: 'EyeOutlined',
              model: 'button',
              tooltip: '查看详情',
              ifShow: !row.children.length,
              onClick: handleViewDetail.bind(null, row),
            },
            {
              icon: 'PlusCircleOutlined',
              model: 'button',
              tooltip: '添加子项',
              ifShow: !row.Parent_ID,
              disabled: disabledByAudit(row),
              auth: permission.项目_新建,
              onClick: handleCreateChild.bind(null, row),
            },
            {
              icon: 'BlockOutlined',
              model: 'button',
              tooltip: '查看版本',
              ifShow: !row.children.length,
              onClick: handleViewVersion.bind(null, row),
            },
            {
              icon: 'AuditOutlined',
              model: 'button',
              color: 'success',
              tooltip: '发起审批',
              ifShow: !row.children.length,
              auth: permission.项目_发起审批,
              onClick: handleAudit.bind(null, row),
            },
            {
              icon: 'DeleteOutlined',
              color: 'error',
              model: 'confirm',
              tooltip: '删除',
              disabled: disabledByAudit(row),
              auth: permission.项目_删除,
              popConfirm: {
                title: '是否确认删除?',
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        ></TableAction>
      </template>
    </Grid>
    <FormModalOuter @submit="gridApi.reload()"></FormModalOuter>
    <VersionModalOuter @close="gridApi.reload()"></VersionModalOuter>
  </ColPage>
</template>

<script lang="tsx" setup name="ListPreparation">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Flex, Button, Switch, Progress, message } from 'ant-design-vue';

import { ColPage, useVbenModal } from '@vben/common-ui';

import { useUserStore } from '@vben/stores';

import type { VxeGridProps, VxeGridListeners } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { BaseTree } from '#/components/_project/baseTree';
import { ImportFile } from '#/components/basicUpload';
import { TableAction } from '#/components/tableAction';
import { Authority, hasPermission } from '#/components/authority';

import FormModal from './formModal/formModal.vue';
import VersionModal from './versionModal/versionModal.vue';
import { AuditStatus } from '#/components/auditStatus';
import { createSubmitAuditModal } from '#/components/auditModal';

import {
  getListPreparation,
  postListPreparation,
  putListPreparation,
  deleteListPreparation,
  postListPreparationFromSSOT,
  getListPreparationCanSubmit,
} from '#/api/listPreparationApi/listPreparationApi';
import { getUser } from '#/api/userApi/userApi';

import { ConditionalType, type WhereType } from '#/api/basicType';

import { columns, searchFormSchema } from './data';

import { listPreparationPermission } from '#/permission';

const permission = listPreparationPermission!.清单编制;

const userStore = useUserStore();

const currentNode = ref<null | Record<string, any>>(null);
const importAction = computed(
  () =>
    `/api/IPProject/${userStore.userInfo!.Orz_ID}/${currentNode.value?.ID}/Import`,
);

const disabledByAudit = (row: Record<string, any>): boolean => {
  return [1, 2].includes(row.AuditStatus);
};

const isMine = ref<boolean>(true);

const gridOptions: VxeGridProps = {
  columns,
  keepSource: true,
  height: 'auto',
  pagerConfig: {
    enabled: false,
  },
  treeConfig: {
    expandAll: true,
  },
  editConfig: {
    enabled: hasPermission(permission.项目_修改, 'auth'),
    beforeEditMethod: ({ row }) => !disabledByAudit(row),
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: ({}, formValues) => {
        const Where: WhereType[] = [];
        if (formValues.Name) {
          Where.push({
            ConditionalType: ConditionalType.Like,
            FieldName: 'Name',
            FieldValue: formValues.Name,
          });
        }
        if (isMine.value) {
          Where.push({
            ConditionalList: [
              {
                Key: 0,
                Value: {
                  FieldName: 'CreatedBy',
                  ConditionalType: ConditionalType.Equal,
                  FieldValue: userStore.userInfo!.ID,
                },
              },
              {
                Key: 1,
                Value: {
                  FieldName: 'ResponsibleUserID',
                  ConditionalType: ConditionalType.Equal,
                  FieldValue: userStore.userInfo!.ID,
                },
              },
              {
                Key: 1,
                Value: {
                  FieldName: 'ReportedUserID',
                  ConditionalType: ConditionalType.Equal,
                  FieldValue: userStore.userInfo!.ID,
                },
              },
            ],
          });
        }

        const params = {
          Where,
          Order: 'Sort asc, CreatedTime asc',
          Islinkage: true,
        };

        return getListPreparation({
          orgId: userStore.userInfo!.Orz_ID,
          treeId: currentNode.value?.ID,
          params,
        });
      },
      querySuccess: ({ response }) => {
        const { List } = response;
        List.forEach((n: Record<string, any>) => {
          n.DateRange =
            n.PlanTime && n.PlanEndTime
              ? [n.PlanTime?.slice(0, 10), n.PlanEndTime?.slice(0, 10)]
              : [];
        });
      },
    },
  },
};

const gridEvents: VxeGridListeners = {
  editClosed: async ({ row, column }) => {
    if (row[column.field] == column.model.value) {
      return;
    }

    let data = {
      ID: row.ID,
      [column.field]: row[column.field] ?? null,
    };
    if (column.field === 'DateRange') {
      data = {
        ...data,
        PlanTime: row[column.field]?.[0] ?? null,
        PlanEndTime: row[column.field]?.[1] ?? null,
      };
    } else if (column.field === 'ResponsibleUserID') {
      const name = row[column.field]
        ? userOptions.value.find((n) => n.ID === row[column.field])?.Name
        : null;
      row.ResponsibleUserName = name;
      data = {
        ...data,
        ResponsibleUserName: name,
      };
    } else if (column.field === 'ReportedUserID') {
      const name = row[column.field]
        ? userOptions.value.find((n) => n.ID === row[column.field])?.Name
        : null;
      row.ReportedUserName = name;
      data = {
        ...data,
        ReportedUserName: name,
      };
    }

    await putListPreparation(
      userStore.userInfo!.Orz_ID,
      currentNode.value!.ID,
      data,
    );
    message.success('修改成功');
    gridApi.reload();
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions: {
    schema: searchFormSchema,
    showCollapseButton: false,
  },
  gridEvents,
});

function nodeClick(node: Record<string, any>) {
  currentNode.value = node;
  gridApi.reload();
}

const [FormModalOuter, formModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: FormModal,
});

const [VersionModalOuter, versionModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: VersionModal,
});

function handleCreate() {
  formModalApi.setData({ currentNode: currentNode.value }).open();
}

function handleSuccess() {
  gridApi.reload();
}

async function updateSSOT() {
  try {
    await postListPreparationFromSSOT();
  } finally {
    gridApi.reload();
  }
}

const { push, resolve } = useRouter();
function handleViewDetail(row: Record<string, any>) {
  push({
    name: 'listPreparationDetail',
    params: {
      bId: currentNode.value!.ID,
      pId: row.ID,
      vId: row.Version_ID,
    },
    query: {
      auditStatus: row.AuditStatus,
    },
  });
}

function handleViewVersion(row: Record<string, any>) {
  versionModalApi
    .setState({ title: `版本-${row.Name}` })
    .setData({ currentRecord: row })
    .open();
}

async function handleCreateChild(row: Record<string, any>) {
  const data: Record<string, any> = {
    ...row,
    ID: undefined,
    Parent_ID: row.ID,
  };
  await postListPreparation(
    userStore.userInfo!.Orz_ID,
    currentNode.value!.ID,
    data,
  );
  message.success('添加成功');
  gridApi.reload();
}

async function handleAudit(row: Record<string, any>) {
  if ([1, 2].includes(row.AuditStatus)) {
    return message.error('该项目已发起审批');
  }

  const isCanSubmit = (await getListPreparationCanSubmit(row.ID)).Value;
  if (!isCanSubmit) {
    return message.error('请填写项目信息中的必填项');
  }

  // 审批字段
  const schema = columns!
    .filter((n) => !['AuditStatus', 'action', undefined].includes(n.field!))
    .map((n) => {
      if (n.field === 'ResponsibleUserID') {
        return {
          field: 'ResponsibleUserName',
          title: n.title,
        };
      }
      if (n.field === 'ReportedUserID') {
        return {
          field: 'ReportedUserName',
          title: n.title,
        };
      }

      return {
        field: n.field,
        title: n.title,
      };
    });
  schema.unshift({
    field: 'BaseTreeName',
    title: '基地名称',
  });

  // 审批数据
  const data = {
    ...row,
    IPProjectState: '已完成',
    DateRange:
      row.PlanTime && row.PlanEndTime
        ? [row.PlanTime.slice(0, 10), row.PlanEndTime.slice(0, 10)].join(' ~ ')
        : '',
  };

  // 详情链接
  const linkUrl = resolve({
    name: 'listPreparationDetail',
    params: {
      bId: row.APProjectBaseTree_ID,
      pId: row.ID,
      vId: row.Version_ID,
    },
    query: { auditStatus: 1 },
  }).href;

  const params = {
    tableName: 'IPProject', // 审批数据的控制器
    auditName: `【清单编制】-【${row.BaseTreeName}】-${row.Name}`,
    schema,
    data,
    linkUrl,
    customizable: true,
    isOtherTables: false,
    submit: () => {
      gridApi.reload();
    },
  };
  createSubmitAuditModal(params);
}

async function handleDelete(row: Record<string, any>) {
  const data: string[] = [row.ID].concat(
    row.children ? row.children.map((n: Record<string, any>) => n.ID) : [],
  );
  await deleteListPreparation(
    userStore.userInfo!.Orz_ID,
    currentNode.value!.ID,
    data,
  );
  message.success('删除成功');
  gridApi.reload();
}

const userOptions = ref<Record<string, any>[]>([]);
async function getUserList() {
  const params = {
    orzId: userStore.userInfo!.Orz_ID,
  };
  const { List } = await getUser({ params });
  userOptions.value = List.map((n: Record<string, any>) => ({
    ID: n.ID,
    Name: n.Name,
  }));
}

onMounted(async () => {
  await getUserList();
  columns?.forEach((n) => {
    if (n.field === 'ResponsibleUserID') {
      n.editRender!.props = {
        ...n.editRender!.props,
        options: userOptions.value,
      };
    }
    if (n.field === 'ReportedUserID') {
      n.editRender!.props = {
        ...n.editRender!.props,
        options: userOptions.value,
      };
    }
  });
  gridApi.setGridOptions({
    columns,
  });
});
</script>
