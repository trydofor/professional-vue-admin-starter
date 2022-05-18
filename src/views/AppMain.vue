<template>
  <div class="app-main-box">
    <login-dialog />
    <captcha-dialog />
    <div>
      <AsideMenu />
    </div>
    <div class="app-right-box">
      <div class="app-navbar">
        <AtopNavbar />
      </div>
      <el-scrollbar class="app-content-box">
        <router-view v-slot="{ Component, route }">
          <keep-alive :max="cachingView">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </router-view>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import AsideMenu from '@/components/layout/AsideMenu.vue';
import AtopNavbar from '@/components/layout/AtopNavbar.vue';
import { eventSwitch } from '@/libs/global-event';
import { ElMessage } from 'element-plus';
import LoginDialog from '@/components/dialog/LoginDialog.vue';
import logger from '@/libs/logger';
import CaptchaDialog from '@/components/dialog/CaptchaDialog.vue';
import { cachingView } from '@/configs/global';
import { useI18n } from '@/locale';
import { onMounted, onUnmounted } from 'vue';

// caching view 等待新版本支持matchBy key
const { t } = useI18n();

// global event
const eventSwitches = [
  eventSwitch('Failure', err => {
    logger.warn('Failure', err);
    ElMessage.error(err.message);
  }),
  eventSwitch('ApiError', err => {
    logger.warn('ApiError', err);
    ElMessage.error(err.response?.data?.message || err.message);
  }),
  eventSwitch('NetError', err => {
    logger.warn('NetError', err);
    ElMessage.error(err.message);
  }),
  eventSwitch('DblError', err => {
    logger.info('DblError', err);
    ElMessage.warning(err.message);
  }),
  eventSwitch('NoPerms', err => {
    logger.info('NoPerms', err);
    ElMessage.warning('permission denied');
  }),
  eventSwitch('Righter', err => {
    logger.info('Righter', err);
    ElMessage.warning('invalid editor data');
  }),
  eventSwitch('BadGateway', err => {
    logger.info('BadGateway', err);
    ElMessage.warning(t('Error.BadGateway502'));
  }),
];

onMounted(() => {
  eventSwitches.forEach(it => it.on());
});

onUnmounted(() => {
  eventSwitches.forEach(it => it.off());
});
</script>

<style scoped lang="scss">
.app-main-box {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}

.app-right-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.app-navbar {
  height: var(--wg-navbar-height);
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.app-content-box {
  width: 100%;
  height: calc(100vh - var(--wg-navbar-height) - 10px);
}
</style>
