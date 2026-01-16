<!--
 * @Author: cwx
 * @Date: 2024-12-19 20:55:28
 * @LastEditTime: 2026-01-16 11:25:11
 * @LastEditors: cwx
 * @Description: 清单编制台账页
-->
<script lang="tsx" setup name="ListPreparation">
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import type { WhereType } from '#/api/basicType';

import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { ColPage, useVbenModal } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { Button, Flex, message, Progress, Switch } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { ConditionalType } from '#/api/basicType';
import {
  deleteListPreparation,
  getListPreparation,
  getListPreparationCanSubmit,
  postListPreparation,
  postListPreparationFromSSOT,
  putListPreparation,
} from '#/api/listPreparationApi/listPreparationApi';
import { getUser } from '#/api/userApi/userApi';
import { BaseTree } from '#/components/_project/baseTree';
import { createSubmitAuditModal } from '#/components/auditModal';
import { AuditStatus } from '#/components/auditStatus';
import { Authority, hasPermission } from '#/components/authority';
import { ImportFile } from '#/components/basicUpload';
import { TableAction } from '#/components/tableAction';
import { listPreparationPermission } from '#/permission';

import { columns, searchFormSchema } from './data';
import FormModal from './formModal/formModal.vue';
import VersionModal from './versionModal/versionModal.vue';

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
      query: (_params, formValues) => {
        if (!currentNode.value) return Promise.resolve({ Count: 0, List: [] });

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
    if (row[column.field] === column.model.value) {
      return;
    }

    let data: Record<string, any> = {
      ID: row.ID,
      [column.field]: row[column.field] ?? null,
    };

    switch (column.field) {
      case 'DateRange': {
        const start = row[column.field]?.[0];
        const end = row[column.field]?.[1];

        if (start && end && new Date(start) > new Date(end)) {
          gridApi.reload();
          return message.error('计划结束时间不能小于计划开始时间');
        }

        data = {
          ...data,
          PlanTime: row[column.field]?.[0] ?? null,
          PlanEndTime: row[column.field]?.[1] ?? null,
        };

        break;
      }
      case 'ReportedUserID': {
        const name = row[column.field]
          ? userOptions.value.find((n) => n.ID === row[column.field])?.Name
          : null;
        row.ReportedUserName = name;
        data = {
          ...data,
          ReportedUserName: name,
        };

        break;
      }
      case 'ResponsibleUserID': {
        const name = row[column.field]
          ? userOptions.value.find((n) => n.ID === row[column.field])?.Name
          : null;
        row.ResponsibleUserName = name;
        data = {
          ...data,
          ResponsibleUserName: name,
        };

        break;
      }
      // No default
    }

    try {
      await putListPreparation(
        userStore.userInfo!.Orz_ID,
        currentNode.value!.ID,
        data,
      );
      message.success('修改成功');
    } finally {
      gridApi.reload();
    }
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: gridOptions as VxeGridProps,
  gridEvents,
  formOptions: {
    schema: searchFormSchema,
    showCollapseButton: false,
  },
} as any);

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
  if (!currentNode.value) return message.warning('请选择左侧目录');
  formModalApi
    .setData({
      currentNode: currentNode.value,
    })
    .open();
}

function handleImportSuccess() {
  message.success('导入成功');
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
  if (!row.Version_ID) {
    return message.warning('未创建版本');
  }
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

  const canSubmitResult = await getListPreparationCanSubmit(row.ID);
  const isCanSubmit = canSubmitResult.Value;
  if (!isCanSubmit) {
    return message.error('请填写项目信息中的必填项');
  }

  // 审批字段
  const schema = columns!
    .filter((n) => !['action', 'AuditStatus', undefined].includes(n.field!))
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
    customizable: hasPermission(permission.项目_自定义审批人, 'auth'),
    isOtherTables: false,
    submit: () => {
      gridApi.reload();
    },
  };
  createSubmitAuditModal(params);
}

async function handleDelete(row: Record<string, any>) {
  if (!currentNode.value) return;
  const data: string[] = [
    row.ID,
    ...(row.children ? row.children.map((n: Record<string, any>) => n.ID) : []),
  ];
  await deleteListPreparation(
    userStore.userInfo!.Orz_ID,
    currentNode.value.ID,
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
  const res = await getUser({ params });
  userOptions.value = res.List.map((n: Record<string, any>) => ({
    ID: n.ID,
    Name: n.Name,
  }));
}

onMounted(async () => {
  await getUserList();
  columns?.forEach((n) => {
    if (n.field === 'ResponsibleUserID' && n.editRender) {
      n.editRender.props = {
        ...n.editRender.props,
        options: userOptions.value,
      };
    }
    if (n.field === 'ReportedUserID' && n.editRender) {
      n.editRender.props = {
        ...n.editRender.props,
        options: userOptions.value,
      };
    }
  });
  gridApi.setGridOptions({
    columns,
  });
});
</script>

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
              @success="handleImportSuccess"
            />
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
        />
      </template>
      <template #AuditStatus="{ row }">
        <AuditStatus
          v-if="row.children.length === 0"
          :status="row.AuditStatus"
          :instance-id="row.WorkflowInstance_ID"
          @close="gridApi.reload()"
        />
      </template>

      <template #action="{ row }">
        <TableAction
          :actions="[
            {
              icon: 'EyeOutlined',
              model: 'button',
              tooltip: '查看详情',
              ifShow: !row.children?.length,
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
              ifShow: !row.children?.length,
              onClick: handleViewVersion.bind(null, row),
            },
            {
              icon: 'AuditOutlined',
              model: 'button',
              color: 'success',
              tooltip: '发起审批',
              ifShow: row.children.length === 0,
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
        />
      </template>
    </Grid>
    <FormModalOuter @submit="gridApi.reload()" />
    <VersionModalOuter @close="gridApi.reload()" />
  </ColPage>
</template>
