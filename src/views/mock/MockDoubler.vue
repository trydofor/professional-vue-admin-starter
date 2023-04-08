<template>
  <div class="wg-box-wrapper">
    <div class="wg-box-block">
      <el-button type="primary" @click="mockDoubler(5)">Sleep5</el-button>
      <el-button type="primary" @click="mockDoubler(5)">Sleep5</el-button>
    </div>
    <div class="wg-box-block">
      <el-button type="primary" @click="debounce(500)">Debounce500</el-button>
      <el-button type="primary" @click="debounce(0)">Debounce0</el-button>
    </div>
    <div class="wg-box-block">
      <el-button v-waiting="1000" type="primary" @click="waiting">Waiting1000</el-button>
      <el-tag v-waiting="1000" style="margin: 1em" @click="waiting">Waiting1000</el-tag>
      <el-checkbox v-waiting="1000">Waiting1000</el-checkbox>
    </div>
    <div class="wg-box-block">
      <el-button type="primary" @click="concurrencyRequest">ConcurrencyRequest</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mockDoubler, mockStatus } from '@/apis/mock/mock-data';
import { ElMessage } from 'element-plus';
import { onMounted } from 'vue';
import { initUser } from '@/apis/authn/setting';

onMounted(() => {
  initUser();
  mockDoubler(500);
  initUser();
});

function debounce(w: number) {
  mockStatus(200, w);
  mockStatus(200, w);
}

function concurrencyRequest() {
  initUser();
  mockDoubler(500);
  initUser();
}

function waiting() {
  ElMessage.info('waiting');
}
</script>

<style scoped></style>
