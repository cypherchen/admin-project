<!--
 * @Author: cwx
 * @Date: 2025-03-20 15:15:19
 * @LastEditTime: 2025-03-25 15:25:26
 * @LastEditors: cwx
 * @Description: 发起审批弹窗
-->
<template>
  <Modal
    v-bind="$attrs"
    title="发起审批"
    v-model:open="open"
    :destroyOnClose="true"
    :maskClosable="false"
    cancelText="取消"
    okText="提交审批"
    width="800px"
    :afterClose="() => isFunction(close) && close()"
    @ok="handleSubmit"
    @cancel="handleOpen(false)"
  >
    <div class="mb-4" v-if="customizable">
      <RadioGroup
        v-model:value="templateType"
        :options="[
          { label: '模板', value: 0 },
          { label: '自定义', value: 1 },
        ]"
        option-type="button"
        button-style="solid"
        @change="handleTypeChange"
      ></RadioGroup>
    </div>
    <Form>
      <template #Reviewer="slotProps">
        <Flex vertical wrap="wrap" class="w-full">
          <Select v-bind="slotProps"></Select>
          <Flex>
            <div v-for="item in getReviewers(slotProps.value)" :key="item.ID">
              <span>{{ item.Sequence + 1 }}.{{ item.UserName }}</span>
              <span
                v-if="item.ID !== slotProps.value?.[slotProps.value.length - 1]"
                class="mx-1"
              >
                →
              </span>
            </div>
          </Flex>
        </Flex>
      </template>
    </Form>
    <Descriptions :column="2" size="small" :bordered="true">
      <DescriptionsItem
        v-for="item in schema"
        :key="item.field"
        :label="item.title"
      >
        {{ data[item.field] }}
      </DescriptionsItem>
    </Descriptions>
  </Modal>
</template>

<script setup lang="ts" name="SubmitAudit">
import { toRefs, ref, onMounted } from 'vue';
import {
  Modal,
  RadioGroup,
  Descriptions,
  DescriptionsItem,
  Select,
  Flex,
} from 'ant-design-vue';

import { useVbenForm } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import type { SubmitAuditProps } from './props';

import { formSchema } from './data';
import { postAudit } from '#/api/auditInstanceApi/auditInstanceApi';
import { getUser } from '#/api/userApi/userApi';
import { getAuditTemplate } from '#/api/auditTemplateApi/auditTemplateApi';

import { isFunction } from '@vben/utils';

const props = withDefaults(defineProps<SubmitAuditProps>(), {
  tableName: '',
  auditName: '',
  schema: () => [],
  data: () => ({}),
  linkUrl: '',
  customizable: false,
  isOtherTables: false,
});

const {
  tableName,
  auditName,
  schema,
  data,
  linkUrl,
  customizable,
  isOtherTables,
  close,
  submit,
} = toRefs(props);

const templateType = ref<number>(0);
async function handleTypeChange() {
  formApi.resetValidate();
  const schema = formSchema.filter((item) =>
    templateType.value === 0
      ? !['Reviewer', 'CCRecipient'].includes(item.fieldName)
      : !['WorkflowTemplate_ID'].includes(item.fieldName),
  );
  formApi.setState({ schema });
  if (templateType.value === 0) {
    await getTemplateList();

    formApi.updateSchema([
      {
        fieldName: 'WorkflowTemplate_ID',
        componentProps: { options: templateOptions.value },
      },
    ]);
  } else {
    await getUserList();

    formApi.updateSchema([
      {
        fieldName: 'Reviewer',
        componentProps: { options: userOptions.value },
      },
      {
        fieldName: 'CCRecipient',
        componentProps: { options: userOptions.value },
      },
    ]);
  }
}

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  schema: formSchema,
  showDefaultActions: false,
});

const open = ref<boolean>(true);
function handleOpen(isOpen: boolean) {
  open.value = isOpen;
}

const templateOptions = ref<Record<string, any>[]>([]);
async function getTemplateList() {
  const { List } = await getAuditTemplate();
  templateOptions.value = List.map((n: Record<string, any>) => ({
    ID: n.ID,
    Name: n.Name,
  }));
}

const userStore = useUserStore();

const userOptions = ref<Record<string, any>[]>([]);
async function getUserList() {
  const params = {
    orzId: userStore.userInfo!.Orz_ID,
  };
  const { List } = await getUser({ params });
  userOptions.value = List.map((n: Record<string, any>) => ({
    ID: n.ID,
    UserName: n.Name,
  }));
}

function getReviewers(value: string[]) {
  const list: Record<string, any>[] = [];
  value?.forEach((n) => {
    const user = userOptions.value.find((m) => m.ID === n);
    if (user) {
      list.push({
        ID: user.ID,
        UserName: user.UserName,
        Sequence: list.length,
      });
    }
  });
  return list;
}

async function handleSubmit() {
  const { valid } = await formApi.validate();
  const values = await formApi.getValues();

  if (!valid) return;

  const auditData: Record<string, any> = {
    ...values,
    DataID: [data.value.ID],
    TableName: tableName.value,
    LinkUrl: linkUrl.value,
    DataModel: JSON.stringify(data.value),
    Schema: JSON.stringify(schema.value),
    IsOtherTables: isOtherTables.value,
    Reviewer: templateType.value === 0 ? [] : getReviewers(values.Reviewer),
    CCRecipient:
      templateType.value === 0
        ? []
        : userOptions.value.filter((n) => values.CCRecipient?.includes(n.ID)),
  };

  await postAudit(auditData);

  handleOpen(false);
  isFunction(submit.value) && submit.value();
}

onMounted(() => {
  formApi.setValues({ Name: auditName.value });
  handleTypeChange();
});
</script>

<style scoped lang="less">
:deep(.ant-descriptions-item-label) {
  background-color: #00000005 !important;
}
</style>
