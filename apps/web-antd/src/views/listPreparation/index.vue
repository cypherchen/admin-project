<!--
 * @Author: cwx
 * @Date: 2024-12-19 20:55:28
 * @LastEditTime: 2025-03-19 20:50:13
 * @LastEditors: cwx
 * @Description: 清单编制台账页
-->
<template>
  <ColPage
    auto-content-height
    :left-width="10"
    :left-max-width="10"
    :left-min-width="2"
    split-handle
  >
    <template #left>
      <BaseTree :type="0" @node-click="nodeClick" />
    </template>
    <Grid class="ml-2">
      <template #toolbar-actions>
        <Flex gap="8" align="center">
          <Authority value="listPreparation_project:create">
            <Button type="primary" @click="handleCreate"> 新建 </Button>
          </Authority>
          <Authority value="listPreparation_project:import">
            <ImportFile
              label="导入Excel"
              :action="importAction"
              :accept="['.xlsx', '.xls']"
              @success="handleSuccess"
            >
            </ImportFile>
          </Authority>
          <Authority value="listPreparation_project:updateSSOT">
            <Button @click="updateSSOT"> 手动更新 </Button>
          </Authority>
          <Authority value="listPreparation_project:import">
            <Switch v-model:checked="isMine" @change="() => reload()">
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

      <template #action="{ row }">
        <Button type="link" @click="handleView(row)" class="px-1">
          查看
        </Button>
        <Popconfirm
          title="是否确认删除?"
          ok-text="确认"
          cancel-text="取消"
          @confirm="handleDelete(row)"
        >
          <Button type="link" danger class="px-1"> 删除 </Button>
        </Popconfirm>
      </template>
    </Grid>
    <Modal></Modal>
  </ColPage>
</template>

<script lang="tsx" setup name="ListPreparation">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  Flex,
  Button,
  Switch,
  Popconfirm,
  Progress,
  message,
} from 'ant-design-vue';

import type { Recordable } from '@vben/types';
import { ColPage, useVbenModal } from '@vben/common-ui';

import { useUserStore } from '@vben/stores';

import type { VxeGridProps, VxeGridListeners } from '#/adapter/vxe-table';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { ImportFile } from '#/components/basicUpload';
import { BaseTree } from '#/components/baseTree';
import { Authority } from '#/components/authority';

import FormModal from './formModal/formModal.vue';

import {
  getListPreparation,
  putListPreparation,
  deleteListPreparation,
  postListPreparationFromSSOT,
} from '#/api/listPreparationApi/listPreparationApi';
import { ConditionalType, type WhereType } from '#/api/basicType';

import { columns, searchFormSchema } from './data';

const userStore = useUserStore();

const currentNode = ref<null | Recordable<any>>(null);
const importAction = computed(
  () =>
    `/api/IPProject/${userStore.userInfo!.Orz_ID}/${currentNode.value?.ID}/Import`,
);

const isMine = ref<boolean>(true);

const gridOptions: VxeGridProps<Recordable<any>> = {
  columns,
  keepSource: true,
  height: 'auto',
  pagerConfig: {
    enabled: false,
  },
  treeConfig: {
    transform: true,
    expandAll: true,
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: ({ page }, formValues) => {
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
          PageSize: page.pageSize,
          PageIndex: page.currentPage,
        };

        return getListPreparation({
          orgId: userStore.userInfo!.Orz_ID,
          treeId: currentNode.value?.ID,
          params,
        });
      },
      querySuccess: ({ response }) => {
        const { List } = response;
        List.forEach((n: Recordable<any>) => {
          n.Time =
            n.PlanTime && n.PlanEndTime
              ? [n.PlanTime?.slice(0, 10), n.PlanEndTime?.slice(0, 10)]
              : [];
        });
      },
    },
  },
  editConfig: {
    mode: 'cell',
    trigger: 'click',
  },
};

const gridEvents: VxeGridListeners = {
  editClosed: async ({ row, column }) => {
    if (row[column.field] == column.model.value) {
      return;
    }

    let data = {};
    if (column.field === 'Time') {
      data = {
        ID: row.ID,
        PlanTime: row[column.field]?.[0] ?? null,
        PlanEndTime: row[column.field]?.[1] ?? null,
      };
    } else {
      data = {
        ID: row.ID,
        [column.field]: row[column.field],
      };
    }

    await putListPreparation(
      userStore.userInfo!.Orz_ID,
      currentNode.value!.ID,
      data,
    );
    message.success('修改成功');
    reload();
  },
};

const [Grid, { reload }] = useVbenVxeGrid({
  gridOptions,
  formOptions: {
    schema: searchFormSchema,
    showCollapseButton: false,
  },
  gridEvents,
});

const nodeClick = (node: Recordable<any>) => {
  currentNode.value = node;
  reload();
};

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: FormModal,
});
const handleCreate = () => {
  modalApi.open();
};

const handleSuccess = () => {
  reload();
};

const updateSSOT = async () => {
  try {
    await postListPreparationFromSSOT();
  } finally {
    reload();
  }
};

const { push } = useRouter();
function handleView(row: Recordable<any>) {
  push({
    name: 'ListPreparationDetail',
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
  reload();
}
</script>
