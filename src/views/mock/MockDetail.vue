<template>
  <div class="wg-box-wrapper">
    <div class="wg-box-block">
      <el-button type="primary" @click="onAddTab">AddTab</el-button>
    </div>
    <div class="wg-box-block">id={{ route.params.id }}</div>
    <div class="wg-box-block">
      <el-skeleton :rows="10" style="width: 500px" />
      <br />
      <br />
      <el-skeleton style="--el-skeleton-circle-size: 100px">
        <template #template>
          <el-skeleton-item variant="circle" />
        </template>
      </el-skeleton>
      <br />
      <br />
      <el-skeleton style="width: 500px">
        <template #template>
          <el-skeleton-item variant="image" style="width: 400px; height: 400px" />
          <div style="padding: 14px">
            <el-skeleton-item variant="p" style="width: 50%" />
            <div style="display: flex; align-items: center">
              <el-skeleton-item variant="text" style="margin-right: 16px" />
              <el-skeleton-item variant="text" style="width: 30%" />
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { RouteName } from '@/router/router';

const route = useRoute();
const router = useRouter();

function onAddTab() {
  router.push({ name: RouteName.MockDetail, params: { id: '' + new Date().getTime() } });
}
</script>

<style scoped></style>
