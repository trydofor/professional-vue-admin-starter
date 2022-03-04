// noinspection AllyPlainJsInspection

/**
 * @file file description
 * @author trydofor
 * @since 2021-09-15
 * @see {@link http://github.com/trydofor | trydofor}
 */

import client, { Result } from '@/apis/api-client';
import md5 from 'js-md5';
import { refStore } from '@/store';
import { tokenName } from '@/configs/global';
import Cookies from 'js-cookie';
import { emptyFunction } from '@/libs/empty';
import { Permit, Required } from '@/configs/permit';
import { setPermit } from '@/libs/permit-helper';
import logger from '@/libs/logger';
import { ciGet } from '@/libs/objects';

export interface LoginForm {
  authType: string;
  username: string;
  password: string;
}

export interface LoginData {
  userName: string;
  [tokenName]: string;
}

export function login(data: LoginForm, doSuccess: (result: Result<LoginData>) => void): void {
  const url = `/auth/${data.authType}/login.json`;
  const form = { username: data.username, password: md5(data.password) };
  const store = refStore();
  client.postForm<Result<LoginData>>(url, form).then(response => {
    const result = response.data;
    if (!result.success) {
      doSuccess(result);
      return;
    }

    const token =
      ciGet<string>(response.headers, tokenName, '') ||
      ciGet<string>(result.data, tokenName, '') ||
      Cookies.get(tokenName) ||
      Cookies.get(tokenName.toLowerCase());

    if (token) {
      store.commit('authn/token', token);
    }
    initPerm(err => {
      if (err) {
        result.success = false;
        result.message = err;
      }
      doSuccess(result);
    });
  });
}

export function initPerm(doResult: (err: string) => void): void {
  const url = '/user/authed-perm.json';
  client
    .dataJson<Result<string[]>>(url, {
      perms: Object.values(Permit),
      check: Required,
    })
    .then(result => {
      if (result.success) {
        setPermit(result.data);
      } else {
        logger.log('check failed, perms=', result.data);
      }
      doResult(result.success ? '' : 'Login.NoPermit');
    });
}

export function oauth(type: string, state: string[], host: string, doSuccess: (result: Result<string>) => void): void {
  const url = '/auth/' + type + '/login-page.json';
  client.handForm<Result<string>>(url, doSuccess, { state, host });
}

export function logout(): void {
  client.postForm('/auth/logout.json').then(emptyFunction);
  const store = refStore();
  store.commit('authn/logout');
}
