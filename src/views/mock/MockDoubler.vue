<template>
  <div class="wg-box-wrapper">
    <div class="wg-box-block">
      <el-button type="primary" @click="mockDoubler(5)">Sleep5</el-button>
      <el-button type="primary" @click="mockDoubler(5)">Sleep5</el-button>
    </div>
    <div class="wg-box-block">
      <el-button type="primary" @click="debounce">Debounce500</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mockDoubler, mockStatus } from '@/apis/mock/mock-data';

function debounce() {
  console.log(mockStatus, 1);
  mockStatus(200);
  console.log(mockStatus, 2);
  mockStatus(200);
}
</script>

<style scoped></style>
