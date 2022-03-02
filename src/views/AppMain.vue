<template>
  <div class="app-main-box">
    <login-dialog />
    <captcha-dialog />
    <div>
      <AsideMenu :small="isCollapse" :do-icon-click="doIconClick" />
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
import { ref } from 'vue';
import AsideMenu from '@/components/layout/AsideMenu.vue';
import AtopNavbar from '@/components/layout/AtopNavbar.vue';
import globalEvent from '@/libs/global-event';
import { ElMessage } from 'element-plus';
import LoginDialog from '@/components/dialog/LoginDialog.vue';
import logger from '@/libs/logger';
import CaptchaDialog from '@/components/dialog/CaptchaDialog.vue';
import { cachingView } from '@/configs/global';

// menu
const isCollapse = ref(false);

function doIconClick(small: boolean) {
  isCollapse.value = !small;
}

// caching view 等待新版本支持matchBy key

// global event
globalEvent.on('Failure', err => {
  logger.warn('Failure', err);
  ElMessage.error(err.message);
});
globalEvent.on('ApiError', err => {
  logger.warn('ApiError', err);
  ElMessage.error(err.response?.data?.message || err.message);
});
globalEvent.on('NetError', err => {
  logger.warn('NetError', err);
  ElMessage.error(err.message);
});
globalEvent.on('DblError', err => {
  logger.info('DblError', err);
  ElMessage.warning(err.message);
});
globalEvent.on('NoPerms', err => {
  logger.info('NoPerms', err);
  ElMessage.warning('permission denied');
});
globalEvent.on('Righter', err => {
  logger.info('Righter', err);
  ElMessage.warning('invalid editor data');
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
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  line-height: 50px;
}
.app-content-box {
  width: 100%;
  height: calc(100vh - 50px);
}
</style>
