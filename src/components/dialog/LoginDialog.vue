<template>
  <el-dialog
    :model-value="visible"
    :close-on-click-modal="false"
    :title="t('Login.ReLogin')"
    width="40%"
    @closed="doClose"
  >
    <UserLogin label-position="left" :do-success="doClose" />
    <OauthLogin :pop-window="true" :do-success="doClose" />
  </el-dialog>
</template>

<script setup lang="ts">
import UserLogin from '@/components/authn/UserLogin.vue';
import OauthLogin from '@/components/authn/OauthLogin.vue';
import globalEvent from '@/libs/global-event';
import { pathLogin } from '@/configs/global';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useI18n } from '@/locale';
import { useAuthnStore } from '@/store/authn';

const { t } = useI18n();
const router = useRouter();

// dialog
const visible = ref(false);
function doClose() {
  visible.value = false;
}

globalEvent.on('NoAuthn', () => {
  if (useAuthnStore().token) {
    if (!visible.value) {
      visible.value = true;
    }
  } else {
    router.push(pathLogin);
  }
});
</script>

<style lang="scss" scoped></style>
