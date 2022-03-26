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
      <el-button type="success" class="wg-wid-full" @click="props.doSuccess">ForTest</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { login, LoginForm } from '@/apis/authn/login';
import { tryInit } from '@/apis/authn/setting';
import { EmptyResult } from '@/apis/api-client';
import { emptyFunction } from '@/libs/empty';
import { useI18n } from '@/locale';
import { isProduction, passLenMin } from '@/configs/global';

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
</script>
