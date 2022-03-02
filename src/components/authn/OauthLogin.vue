<template>
  <el-space v-if="authtype?.length > 0">
    <el-checkbox v-model="popup" :label="t('Login.PopupLabel')" :title="t('Login.PopupTitle')" border></el-checkbox>
    <template v-for="item in authtype" :key="item">
      <el-button @click="doOauthLogin(item)">{{ t('Login.AuthType.' + item) }}</el-button>
    </template>
  </el-space>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { oauth } from '@/apis/authn/login';
import { ElMessage } from 'element-plus';
import { oauthLogin, oauthSuccess, pathIndex, pathLogin } from '@/configs/global';
import { popupWindow } from '@/libs/popup-window';
import { EmptyResult, emptySuccess } from '@/apis/api-client';
import { emptyFunction } from '@/libs/empty';
import { useI18n } from '@/locale';

const { t } = useI18n();
const props = withDefaults(
  defineProps<{
    authtype?: string[];
    popWindow?: boolean;
    doSuccess?: (result: EmptyResult) => void;
  }>(),
  { authtype: () => oauthLogin, popWindow: true, doSuccess: emptyFunction },
);

const popup = ref(props.popWindow);
function doOauthLogin(type: string) {
  const orig = window.location.origin;
  const state = popup.value ? [pathLogin, orig, '?success=true'] : [pathIndex, orig, ''];

  oauth(type, state, window.location.host, it => {
    if (it.data) {
      if (popup.value) {
        popupWindow(it.data, 'OAuth Login', e => {
          if (e.data === oauthSuccess) {
            props.doSuccess?.(emptySuccess);
          }
        });
      } else {
        window.location.href = it.data;
      }
    } else {
      ElMessage.warning('bad request with oauth=' + type);
    }
  });
}
</script>
<style scoped lang="scss">
.oauth-box {
  display: flex;
}
</style>
