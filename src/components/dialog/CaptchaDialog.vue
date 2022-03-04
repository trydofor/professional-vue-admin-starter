<template>
  <el-dialog
    :model-value="visible"
    :close-on-click-modal="false"
    :title="t('Captcha.Message')"
    width="40%"
    @closed="doClose"
  >
    <el-row>
      <el-col :span="24">
        <img :src="imageSrc" alt="t('Captcha.VerifyCode')" @click="doRefresh" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-input v-model="verifyCode" placeholder="t('Captcha.Input')" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-button type="primary" :icon="Check" @click="doCommit">{{ t('Common.Commit') }}</el-button>
        <el-button type="primary" :icon="Refresh" @click="doRefresh">{{ t('Common.Refresh') }}</el-button>
        <el-button type="primary" :icon="Clock" @click="doClose">{{ t('Common.Close') }}</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script setup lang="ts">
import globalEvent from '@/libs/global-event';
import logger from '@/libs/logger';
import { ref, watchEffect } from 'vue';
import { onlyPath, questUrl } from '@/libs/captcha';
import apiClient from '@/apis/api-client';
import { useStore } from '@/store';
import { Check, Clock, Refresh } from '@element-plus/icons-vue';
import { useI18n } from '@/locale';

const { t } = useI18n();
const visible = ref(false);
const captchaUrl = ref('');
const verifyCode = ref('');
const imageSrc = ref('');

const store = useStore();

watchEffect(() => {
  apiClient.getBlobUrl(captchaUrl.value).then(it => {
    imageSrc.value = it;
  });
});

function doClose() {
  visible.value = false;
}

function doRefresh() {
  captchaUrl.value = questUrl(captchaUrl.value, verifyCode.value);
}

function doCommit() {
  const url = questUrl(captchaUrl.value, verifyCode.value);
  apiClient.getBlob(url).then(it => {
    if (it.size <= 0) {
      logger.info('captcha is good');
      store.commit('authn/captcha', {
        path: onlyPath(captchaUrl.value),
        code: verifyCode.value,
      });
      doClose();
    } else {
      imageSrc.value = URL.createObjectURL(it);
    }
  });
}

//
globalEvent.on('Captcha', err => {
  logger.info('Captcha', err);
  const url = err.config.url || '';
  captchaUrl.value = questUrl(url, verifyCode.value);
  visible.value = true;
});
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}
</style>
