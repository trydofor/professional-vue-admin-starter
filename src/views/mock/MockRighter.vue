<template>
  <div class="wg-box-wrapper">
    <div class="wg-box-block">
      <el-descriptions title="RightEditor" :column="2">
        <el-descriptions-item label="Edit-Id"><el-input v-model="id" /></el-descriptions-item>
        <el-descriptions-item label="Right-Editor-Get"><el-input v-model="hd" /></el-descriptions-item>
        <el-descriptions-item label="Result-Message"><el-input v-model="msg" disabled /></el-descriptions-item>
        <el-descriptions-item label="Result-Data"><el-input v-model="dt" disabled /></el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="wg-box-block">
      <el-button type="primary" @click="doMockRighter()">GetRighter</el-button>
      <el-button type="primary" @click="doPostRighter()">PostRighter</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mockRighter, postRighter } from '@/apis/mock/mock-data';
import { ref } from 'vue';

const id = ref('10086');
const hd = ref('');
const msg = ref('');
const dt = ref('');

function doMockRighter() {
  mockRighter(id.value, it => {
    hd.value = it;
  });
}

function doPostRighter() {
  postRighter(hd.value, it => {
    msg.value = it.message || '';
    dt.value = it.data || '';
  });
}
</script>

<style scoped></style>
