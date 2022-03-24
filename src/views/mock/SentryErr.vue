<template>
  <el-button type="primary" @click="throwError">TestError</el-button>
</template>

<script setup lang="ts">
function throwError() {
  throw new Error('Test Error ' + new Date());
}
</script>

<style scoped></style>
