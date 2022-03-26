<template>
  <div class="wg-box-wrapper">
    <div class="wg-box-block">
      <el-button type="primary" @click="mockDoubler(5)">Sleep5</el-button>
      <el-button type="primary" @click="mockDoubler(5)">Sleep5</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mockDoubler } from '@/apis/mock/mock-data';
</script>

<style scoped></style>
