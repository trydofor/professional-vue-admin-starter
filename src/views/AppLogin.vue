<template>
  <div class="login-container">
    <div class="login-wrapper">
      <img :alt="t('Common.SystemName')" src="@/assets/images/login.png" class="left-box" />
      <div class="right-box">
        <div class="wg-title-1 wg-mgb-mini">{{ t('Common.SystemName') }}</div>
        <template v-if="success">
          <el-result icon="success" :title="t('Login.Success')" :sub-title="t('Login.CloseWindow')">
            <template #extra>
              <el-button type="primary" @click="doClose">{{ t('Common.Close') }}</el-button>
            </template>
          </el-result>
        </template>
        <template v-else>
          <UserLogin label-position="top" :do-success="doSuccess" />
          <OauthLogin :pop-window="false" :do-success="doSuccess" />
        </template>
      </div>
    </div>
    <div class="wg-mgt-mini">{{ t('Login.CopyRight') }}</div>
  </div>
</template>

<script setup lang="ts">
import UserLogin from '@/components/authn/UserLogin.vue';
import OauthLogin from '@/components/authn/OauthLogin.vue';
import { useRouter } from 'vue-router';
import { oauthSuccess, pathIndex } from '@/configs/global';
import { onMounted, ref } from 'vue';
import { messageOpener } from '@/libs/popup-window';
import { useI18n } from '@/locale';

const { t } = useI18n();

const router = useRouter();
function doSuccess() {
  router.push(pathIndex);
}

const success = ref(false);
function doClose() {
  messageOpener(oauthSuccess);
}

onMounted(() => {
  if (window.location.hash.includes('success')) {
    success.value = true;
    doClose();
  }
});
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: #909090 0 0 1px;
}

.left-box {
  width: 300px;
}

.right-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 100px;
}
</style>
