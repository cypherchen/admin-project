<script lang="ts" setup>
import { useRouter } from 'vue-router';

import { Fallback } from '@vben/common-ui';

import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';

import { hasPermission } from '#/components/authority';
import { accessRoutes } from '#/router/routes';

defineOptions({ name: 'Fallback403Demo' });

const filteredRoutes = accessRoutes
  .filter((route) => {
    return (
      hasPermission(route.name as string, 'menu') &&
      route.meta?.belongTo === 'user'
    );
  })
  .toSorted((a, b) => {
    return (a.meta?.order || 0) - (b.meta?.order || 0);
  });

const { push } = useRouter();
function goHome() {
  const route = filteredRoutes[0];
  push({
    name: route ? route.name : 'Authentication',
  });
}
</script>

<template>
  <Fallback status="403">
    <template #action>
      <Button type="primary" @click="goHome">
        返回首页
        <template #icon><ArrowLeftOutlined /></template>
      </Button>
    </template>
  </Fallback>
</template>
