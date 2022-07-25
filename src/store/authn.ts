/**
 * @file file description
 * @author trydofor
 * @since 2021-10-04
 * @see {@link http://github.com/trydofor | trydofor}
 */
import { defineStore } from 'pinia';

export interface Captcha {
  path?: string;
  code?: string;
}

export interface AuthnState {
  token: string;
  name: string;
  captcha: Captcha;
  permits: string[];
}

export const useAuthnStore = defineStore('authn', {
  state: (): AuthnState => {
    return {
      token: '',
      name: '',
      captcha: {},
      permits: [],
    };
  },
  actions: {
    doLogout() {
      this.token = '';
      this.name = '';
      this.permits = [];
    },
  },
});
