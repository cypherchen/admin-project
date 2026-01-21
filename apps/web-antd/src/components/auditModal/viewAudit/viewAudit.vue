<!--
 * @Author: cwx
 * @Date: 2025-03-20 15:35:48
 * @LastEditTime: 2025-03-25 11:48:21
 * @LastEditors: cwx
 * @Description: 查看审批弹窗
-->
<script setup lang="ts" name="ViewAudit">
import type { ViewAuditProps } from './props';

import { computed, h, onMounted, ref, toRefs } from 'vue';

import { isFunction } from '@vben/utils';

import { StopOutlined } from '@ant-design/icons-vue/lib/icons';
import {
  Button,
  Descriptions,
  DescriptionsItem,
  Divider,
  Flex,
  Input,
  message,
  Modal,
  Popconfirm,
  Steps,
} from 'ant-design-vue';

import {
  getAuditInstance,
  putAgreeAudit,
  putCancelAudit,
  putRefuseAudit,
} from '#/api/auditInstanceApi/auditInstanceApi';
import { AuditStatusEnum } from '#/enums/auditStatusEnum';

import { formSchema } from './data';

const props = withDefaults(defineProps<ViewAuditProps>(), {
  instanceId: '',
});
const { instanceId, close, submit } = toRefs(props);

const open = ref<boolean>(true);
function handleOpen(isOpen: boolean) {
  open.value = isOpen;
}

async function getInstance() {
  const res = await getAuditInstance(instanceId.value);

  getAuditInfo(res);
  getSteps(res);
}

const templateType = ref<number>(0);
const computedFormSchema = computed(() => {
  return formSchema.filter((item) =>
    templateType.value === 0
      ? !['ccRecipient', 'reviewer'].includes(item.field)
      : !['templateName'].includes(item.field),
  );
});
const linkUrl = ref<string>('');
const auditForm = ref<Record<string, any>>({});
const auditData = ref<Record<string, any>>({});
const auditSchema = ref<Record<string, any>>({});
function getAuditInfo(res: Record<string, any>) {
  templateType.value = res.WorkflowTemplate_ID ? 0 : 1;

  linkUrl.value = res.LinkUrl;

  auditForm.value = {
    name: res.Name,
    remark: res.Remark,
    templateName: res.WorkflowTemplateName,
    reviewer: res.Reviewer?.map(
      (item: Record<string, any>) => `${item.Sequence + 1}.${item.UserName}`,
    ).join(' → '),
    ccRecipient: res.CCRecipient?.map(
      (item: Record<string, any>) => item.UserName,
    ).join(', '),
  };

  auditData.value = JSON.parse(res.DataModel);
  auditSchema.value = JSON.parse(res.Schema);
}

const stepsAuditStatus = ref<number>(0);
const steps = ref<Record<string, any>[]>([]);
const stepStatusMap: Record<string, any> = {
  0: {
    status: 'wait',
  },
  1: {
    status: 'process',
  },
  2: {
    status: 'finish',
  },
  3: {
    status: 'error',
  },
  4: {
    status: 'wait',
    icon: h(StopOutlined),
  },
};
const canAudit = ref<boolean>(false);
const canCancel = ref<boolean>(false);
function getSteps(res: Record<string, any>) {
  stepsAuditStatus.value = res.AuditStatus;
  const startStep = {
    title: '发起审批',
    status: 'finish',
    subTitle: res.CreatedTime,
    description: res.UserName,
  };
  steps.value = res.WorkflowTasks.map((item: Record<string, any>) => {
    return {
      ID: item.ID,
      title: AuditStatusEnum[item.AuditStatus],
      status: stepStatusMap[item.AuditStatus].status,
      icon: stepStatusMap[item.AuditStatus].icon,
      subTitle: item.EndTime,
      description: item.CheckOpinion
        ? `${item.Reviewer[0].UserName}意见: ${item.CheckOpinion}`
        : item.Reviewer[0].UserName,
    };
  });

  steps.value.unshift(startStep);

  if (stepsAuditStatus.value === AuditStatusEnum.已审批) {
    const finishStep = {
      title: '审批完成',
      status: 'finish',
      subTitle: res.EndingTime,
      description: '',
    };
    steps.value.push(finishStep);
  }

  canAudit.value = res.CanAudit;
  canCancel.value = res.CanCancel;
}

const opinion = ref<string>('');
async function handleAudit(status: AuditStatusEnum) {
  let data = {};

  switch (status) {
    case AuditStatusEnum.已审批: {
      data = {
        TaskID: steps.value.at(-1)?.ID,
        CheckOpinion: opinion.value,
      };
      await putAgreeAudit(
        instanceId.value,
        data as {
          CheckOpinion: string;
          TaskID: string;
        },
      );
      break;
    }
    case AuditStatusEnum.已驳回: {
      data = {
        TaskID: steps.value.at(-1)?.ID,
        CheckOpinion: opinion.value,
      };
      await putRefuseAudit(
        instanceId.value,
        data as {
          CheckOpinion: string;
          TaskID: string;
        },
      );
      break;
    }
    case AuditStatusEnum.撤销: {
      data = {
        CancelCause: '',
      };
      await putCancelAudit(instanceId.value, data as { CancelCause: string });
      break;
    }
  }

  const msgMap: Record<number, string> = {
    2: '审批成功',
    3: '驳回成功',
    4: '撤销成功',
  };

  message.success(msgMap[status]);
  handleOpen(false);
  isFunction(submit.value) && submit.value(status);
}

onMounted(() => {
  getInstance();
});
</script>

<template>
  <Modal
    v-bind="$attrs"
    title="查看审批"
    v-model:open="open"
    :destroy-on-close="true"
    :mask-closable="false"
    :footer="null"
    :after-close="() => isFunction(close) && close()"
    width="1500px"
  >
    <Flex gap="8" class="h-[600px] w-full rounded-md border p-2">
      <Flex vertical gap="8" class="flex-1">
        <Flex justify="space-between" class="w-full">
          <div class="title-class">审批信息</div>
          <Button type="link" size="small" :href="linkUrl" target="_blank">
            详情链接
          </Button>
        </Flex>
        <Divider class="m-0" />
        <Descriptions :column="2" size="small" :bordered="true">
          <DescriptionsItem
            v-for="item in computedFormSchema"
            :key="item.field"
            :label="item.title"
          >
            {{ auditForm[item.field] }}
          </DescriptionsItem>
        </Descriptions>
        <Descriptions :column="2" size="small" :bordered="true">
          <DescriptionsItem
            v-for="item in auditSchema"
            :key="item.field"
            :label="item.title"
          >
            {{ auditData[item.field] }}
          </DescriptionsItem>
        </Descriptions>
      </Flex>
      <Divider type="vertical" class="m-0 h-full" />
      <Flex vertical gap="8" class="h-full w-[350px]">
        <div class="title-class !h-[25px]">审批状态</div>
        <Divider class="m-0" />
        <Steps direction="vertical" size="small" :items="steps" :percent="50" />
        <Flex vertical gap="8" class="mt-auto">
          <Flex v-if="canAudit" align="center">
            <div class="w-20">审批意见:</div>
            <Input v-model:value="opinion" placeholder="请输入审批意见" />
          </Flex>
          <Flex gap="8" justify="end">
            <Popconfirm
              v-if="canCancel && stepsAuditStatus === AuditStatusEnum.审批中"
              title="确定撤销吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleAudit(AuditStatusEnum.撤销)"
            >
              <Button danger size="small">撤销</Button>
            </Popconfirm>
            <Popconfirm
              v-if="canAudit"
              title="确定驳回吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleAudit(AuditStatusEnum.已驳回)"
            >
              <Button type="primary" danger size="small">驳回</Button>
            </Popconfirm>
            <Popconfirm
              v-if="canAudit"
              title="确定通过吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleAudit(AuditStatusEnum.已审批)"
            >
              <Button type="primary" size="small">通过</Button>
            </Popconfirm>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  </Modal>
</template>

<style scoped lang="less">
.title-class {
  position: relative;
  padding-left: 20px;
  font-size: 16px;
  height: 100%;
  vertical-align: middle;
  &::before {
    content: '';
    position: absolute;
    left: 0px;
    width: 6px;
    height: 100%;
    border-radius: 3px;
    background-color: #1c7dff;
    background-image: linear-gradient(to bottom, #00b1ff, #0368ff);
  }
}

:deep(.ant-descriptions-item-label) {
  background-color: #00000005 !important;
}

:deep(.ant-steps-item-title) {
  display: flex;
  justify-content: space-between;
}

:deep(.ant-steps-item) {
  pointer-events: none !important;
  .ant-steps-item-description {
    color: unset !important;
  }
}
</style>
