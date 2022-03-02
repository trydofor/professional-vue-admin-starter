<template>
  <el-config-provider :locale="localeMessage" />
  <router-view />
</template>
<script setup lang="ts">
import { getLocaleMessage, useI18n } from '@/locale';
import { ref } from 'vue';
import globalEvent from '@/libs/global-event';
import logger from '@/libs/logger';

const localeMessage = ref(getLocaleMessage());
const i18n = useI18n();

globalEvent.on('SetLocale', it => {
  logger.log('SetLocale', it);
  localeMessage.value = getLocaleMessage(it);
  i18n.locale.value = it;
});
</script>
