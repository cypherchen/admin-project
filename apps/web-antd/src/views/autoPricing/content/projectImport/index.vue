<!--
 * @Author: cwx
 * @Date: 2026-01-15 11:48:15
 * @LastEditTime: 2026-01-26 11:02:45
 * @LastEditors: cwx
 * @Description: 自动套价-项目导入
-->
<script setup lang="ts" name="ProjectImport">
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import type { WhereType } from '#/api/basicType';

import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useUserStore } from '@vben/stores';

import { QuestionCircleTwoTone } from '@ant-design/icons-vue';
import { Button, Flex, message, Modal, Tooltip } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { ConditionalType } from '#/api/basicType';
import {
  deleteAutoPricingImportFile,
  getAutoPricingImportFile,
} from '#/api/autoPricingApi/autoPricingImportApi';
import { Authority } from '#/components/authority';
import { ImportFile } from '#/components/basicUpload';
import { autoPricingPermission } from '#/permission';

import { columns, searchFormSchema } from './data';
import ProjectImportFileTree from './fileTree.vue';

defineProps<{
  currentNode: null | Record<string, any>;
}>();

const emit = defineEmits(['reloadTree']);

const permission = autoPricingPermission!.导入工程;

const route = useRoute();
const userStore = useUserStore();

const orgId = userStore.userInfo!.Orz_ID;
const pId = route.params.pId as string;
const vId = route.params.vId as string;

const disabledByAudit = computed(() =>
  [1, 2].includes(Number(route.query?.auditStatus)),
);

const currentRow = ref<null | Record<string, any>>(null);

const importAction = computed(
  () => `/api/APProjectVersion/${orgId}/${pId}/ImportList/${vId}`,
);

const importTips =
  '请导入报价清单文件，您可以从清单编制或自动套价的项目清单子模块中使用"导出报价清单"功能导出文件';

const gridOptions = computed((): VxeGridProps => {
  return {
    columns,
    height: 'auto',
    pagerConfig: {
      enabled: false,
    },
    rowConfig: {
      isCurrent: true,
    },
    proxyConfig: {
      autoLoad: true,
      ajax: {
        query: async (_params, formValues: Record<string, any>) => {
          const Where: WhereType[] = [];
          if (formValues.FileName?.trim()) {
            Where.push({
              FieldName: 'FileName',
              ConditionalType: ConditionalType.Like,
              FieldValue: formValues.FileName.trim(),
            });
          }
          const params = {
            Where,
            Order: 'CreatedTime asc',
          };
          return getAutoPricingImportFile({
            vId,
            params,
          });
        },
      },
    },
  };
});

const gridEvents: VxeGridListeners = {
  currentRowChange: ({ row }) => {
    currentRow.value = row || null;
  },
};

const [VbenVxeGrid, gridApi] = useVbenVxeGrid({
  gridOptions: gridOptions.value as VxeGridProps,
  gridEvents,
  formOptions: {
    schema: searchFormSchema,
    showCollapseButton: false,
    compact: false,
  },
  separator: false,
} as any);

async function handleDelete() {
  if (!currentRow.value) {
    message.error('未选择数据');
    return;
  }
  Modal.confirm({
    title: '提示',
    content: '是否删除该数据?',
    type: 'warning',
    async onOk() {
      const data = [currentRow.value!.ID];
      await deleteAutoPricingImportFile(vId, data);
      message.success('删除成功');
      currentRow.value = null;
      gridApi.reload();
    },
  });
}

async function handleImportSuccess() {
  message.success('导入成功');
  gridApi.reload();
  emit('reloadTree');
}
</script>

<template>
  <div class="flex h-full w-full">
    <div class="flex-1">
      <VbenVxeGrid>
        <template #toolbar-actions>
          <Flex gap="8">
            <Authority :value="permission.导入工程_一键导入">
              <ImportFile
                :action="importAction"
                :accept="['.xls', '.xlsx', '.xlsm']"
                :disabled="disabledByAudit"
                @success="handleImportSuccess"
              >
                <Button type="primary" :disabled="disabledByAudit">
                  一键导入
                  <template #icon>
                    <Tooltip :title="importTips">
                      <QuestionCircleTwoTone two-tone-color="#eb2f96" />
                    </Tooltip>
                  </template>
                </Button>
              </ImportFile>
            </Authority>
            <Authority :value="permission.导入工程_删除工程">
              <Button danger :disabled="disabledByAudit" @click="handleDelete">
                删除工程
              </Button>
            </Authority>
          </Flex>
        </template>
      </VbenVxeGrid>
    </div>
    <ProjectImportFileTree
      :current-row="currentRow"
      :current-node="currentNode"
      :disabled-by-audit="disabledByAudit"
      @reload-tree="emit('reloadTree')"
    />
  </div>
</template>
