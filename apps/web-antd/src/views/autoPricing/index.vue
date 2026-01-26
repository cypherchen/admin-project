<!--
 * @Author: cwx
 * @Date: 2026-01-15 11:03:11
 * @LastEditTime: 2026-01-23 17:17:38
 * @LastEditors: cwx
 * @Description: 自动套价台账页
-->
<script lang="tsx" setup name="AutoPricing">
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import type { WhereType } from '#/api/basicType';

import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { ColPage, useVbenModal } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { Button, Flex, message, Progress, Switch } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteAutoPricing,
  getAutoPricing,
  postAutoPricing,
  putAutoPricing,
} from '#/api/autoPricingApi/autoPricingApi';
import { ConditionalType } from '#/api/basicType';
import { getUser } from '#/api/userApi/userApi';
import { BaseTree } from '#/components/_project/baseTree';
import { AuditStatus } from '#/components/auditStatus';
import { Authority, hasPermission } from '#/components/authority';
import { ImportFile } from '#/components/basicUpload';
import { TableAction } from '#/components/tableAction';
import { autoPricingPermission } from '#/permission';

import { columns, searchFormSchema } from './data';
import FormModal from './formModal/formModal.vue';
import VersionModal from './versionModal/versionModal.vue';

const permission = autoPricingPermission!.自动套价;

const userStore = useUserStore();

const currentNode = ref<null | Record<string, any>>(null);

const importAction = computed(
  () =>
    `/api/APProject/${userStore.userInfo!.Orz_ID}/${currentNode.value?.ID}/Import`,
);

const disabledByAudit = (row: Record<string, any>): boolean => {
  return [1, 2].includes(row.RLCAuditStatus);
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
        if (!currentNode.value) return Promise.resolve([]);

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

        return getAutoPricing({
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
        data = {
          ...data,
          PlanTime: row.DateRange?.[0] ?? null,
          PlanEndTime: row.DateRange?.[1] ?? null,
          RLCPlanTime: row.DateRange?.[0] ?? null,
          RLCPlanEndTime: row.DateRange?.[1] ?? null,
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
      await putAutoPricing(
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
  connectedComponent: FormModal,
});

const [VersionModalOuter, versionModalApi] = useVbenModal({
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

const { push } = useRouter();
function handleViewDetail(row: Record<string, any>) {
  if (!row.Version_ID) {
    return message.warning('未创建版本');
  }
  push({
    name: 'autoPricingDetail',
    params: {
      bId: currentNode.value!.ID,
      pId: row.ID,
      vId: row.Version_ID,
    },
    query: {
      auditStatus: row.RLCAuditStatus,
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
    RLCPlanTime: row.PlanTime,
    RLCPlanEndTime: row.PlanEndTime,
  };
  await postAutoPricing(
    userStore.userInfo!.Orz_ID,
    currentNode.value!.ID,
    data,
  );
  message.success('添加成功');
  gridApi.reload();
}

async function handleDelete(row: Record<string, any>) {
  if (!currentNode.value) return;
  const data: string[] = [
    row.ID,
    ...(row.children ? row.children.map((n: Record<string, any>) => n.ID) : []),
  ];
  await deleteAutoPricing(
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
  const { List } = await getUser({ params });
  userOptions.value = List.map((n: Record<string, any>) => ({
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
          <Authority :value="permission.项目_查看全部">
            <Switch v-model:checked="isMine" @change="gridApi.reload()">
              <template #checkedChildren>与我相关</template>
              <template #unCheckedChildren>全部</template>
            </Switch>
          </Authority>
        </Flex>
      </template>

      <template #RLCProjectState="{ row }">
        <Progress
          type="circle"
          :percent="[0, 50, 100, 100][row.RLCProjectState]"
          :size="20"
          :status="
            [undefined, 'normal', 'normal', 'exception'][
              row.RLCProjectState
            ] as any
          "
          :format="
            () => ['未启动', '进行中', '已完成', '已延期'][row.RLCProjectState]
          "
        />
      </template>
      <template #AuditStatus="{ row }">
        <AuditStatus
          v-if="row.children.length === 0"
          :status="row.RLCAuditStatus"
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
