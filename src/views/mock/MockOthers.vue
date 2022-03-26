<template>
  <div class="wg-box-wrapper">
    <div class="wg-box-block">
      <el-button type="primary" @click="onAddTab">AddTab</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { RouteName } from '@/router/router';

const router = useRouter();

function onAddTab() {
  router.push({ name: RouteName.MockDetail, params: { id: '' + new Date().getTime() } });
}
</script>

<style scoped></style>
