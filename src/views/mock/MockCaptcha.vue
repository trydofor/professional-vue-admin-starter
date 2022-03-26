<template>
  <div class="wg-box-wrapper">
    <div class="wg-box-block">
      <el-button type="primary" @click="doCommit">
        {{ t('Common.Commit') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mockCaptcha } from '@/apis/mock/mock-data';
import logger from '@/libs/logger';
import { useI18n } from '@/locale';

const { t } = useI18n();
function doCommit() {
  logger.info('do mock captcha', t('Common.Commit'));
  mockCaptcha();
}
</script>

<style scoped></style>
