<template>
  <div class="wg-box-wrapper">
    <div class="wg-box-block">
      <el-button type="primary" @click="throwError">TestError</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
function throwError() {
  throw new Error('Test Error ' + new Date());
}
</script>

<style scoped></style>
