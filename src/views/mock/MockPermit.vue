<template>
  <div class="wg-box-wrapper">
    <div class="wg-box-block">
      <el-button v-permit="Permit.RoleAdmin">RoleAdmin</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Permit } from '@/configs/permit';
</script>
<style scoped></style>
