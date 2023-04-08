<template>
  <el-form ref="formRef" :model="loginForm" :label-position="labelPosition" :rules="formRules">
    <el-form-item prop="username" :label="t('Login.Username')">
      <el-input v-model="loginForm.username" clearable @change="cleanError" @keyup.enter="focusPassword"></el-input>
    </el-form-item>
    <el-form-item prop="password" :label="t('Login.Password')">
      <el-input
        ref="passRef"
        v-model="loginForm.password"
        clearable
        show-password
        @change="cleanError"
        @keyup.enter="submitLogin"
      ></el-input>
    </el-form-item>
    <el-form-item :error="loginErr">
      <el-button type="primary" class="wg-wid-full" @click="submitLogin">{{ t('Login.Submit') }}</el-button>
    </el-form-item>
    <el-form-item v-if="!isProduction">
      <el-select v-model="runModeTest" placeholder="runMode" @change="onRunMode">
        <el-option v-for="item in runModeOpts" :key="item" :value="item" />
      </el-select>
      <el-button type="success" @click="loginTest">ForTest</el-button>
      <el-button type="primary" @click="franchiseeLogin">FranchiseeLogin</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { login, LoginForm } from '@/apis/authn/login';
import { tryInit } from '@/apis/authn/setting';
import { EmptyResult, emptySuccess } from '@/apis/api-client';
import { emptyFunction } from '@/libs/empty';
import { useI18n } from '@/locale';
import { isProduction, localeDefault, passLenMin } from '@/configs/global';
import { useAuthnStore } from '@/store/authn';
import { useSettingStore } from '@/store/setting';
import { changeRunMode, RunMode } from '@/libs/runmode';

const props = withDefaults(
  defineProps<{
    labelPosition?: 'right' | 'left' | 'top';
    doSuccess?: (result: EmptyResult) => void;
  }>(),
  {
    labelPosition: 'left',
    doSuccess: emptyFunction,
  },
);

const loginForm = reactive<LoginForm>({
  authType: 'email',
  username: '',
  password: '',
});

const { t } = useI18n();
const formRules = {
  username: [
    { required: true, message: t('Validator.RequireEmail'), trigger: 'blur' },
    { type: 'email', message: t('Validator.BadEmail'), trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: t('Validator.RequirePassword'), trigger: 'blur' },
    { type: 'string', min: passLenMin, message: t('Validator.LeastNChars', [passLenMin]), trigger: 'blur' },
  ],
};

const formRef = ref();
const passRef = ref();
const loginErr = ref('');

function cleanError() {
  loginErr.value = '';
}

function focusPassword() {
  passRef.value?.focus();
}

function submitLogin() {
  formRef.value.validate((valid: unknown) => {
    if (valid) {
      login(loginForm, result => {
        if (result.success) {
          props.doSuccess(result);
          tryInit();
        } else {
          if (result.message && result.message.startsWith('Login.')) {
            loginErr.value = t(result.message);
          } else {
            loginErr.value = result.message || t('Login.Failure');
          }
        }
      });
      return true;
    } else {
      return false;
    }
  });
}

// test
const runModeTest = ref(RunMode.Product);
const runModeOpts = [RunMode.Product, RunMode.Test, RunMode.Develop, RunMode.Local];
function onRunMode() {
  changeRunMode(runModeTest.value);
}
function loginTest() {
  useAuthnStore().name = 'test-only';
  useSettingStore().locale = localeDefault;
  props?.doSuccess(emptySuccess);
}
function franchiseeLogin() {
  sessionStorage.setItem('franchisee', 'true');
  useAuthnStore().name = 'test-only';
  useSettingStore().locale = localeDefault;
  props?.doSuccess(emptySuccess);
}
</script>
