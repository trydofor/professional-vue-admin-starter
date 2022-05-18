/**
 * @file file description
 * @author trydofor
 * @since 2021-09-15
 * @see {@link http://github.com/trydofor | trydofor}
 */

import { AxiosClient, AxiosClientConfig, EjectType } from '@/libs/axios-client';
import {
  captchaCheck,
  httpBadGate,
  httpCaptcha,
  httpDoubler,
  httpNoAuthn,
  httpNoPerms,
  httpRighter,
  localeHeader,
  tokenName,
  tokenSend,
  TokenType,
  zoneidHeader,
} from '@/configs/global';
import globalEvent from '@/libs/global-event';
import { refStore } from '@/store';
import logger from '@/libs/logger';
import { matchPath } from '@/libs/captcha';
import { ciGet } from '@/libs/objects';

export interface Result<T> {
  success: boolean;
  message?: string;
  code?: string;
  data?: T;
}

export interface PageQuery {
  page: number;
  size: number;
  sort?: string;
}

export interface PageResult<T> extends Result<T>, PageQuery {
  totalPage: number;
  totalData: number;
}

export type EmptyResult = Result<unknown>;
export type StringResult = Result<string>;

export const emptySuccess: EmptyResult = { success: true };
export const emptyFailure: EmptyResult = { success: false };

const clientConfig: AxiosClientConfig = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  withCredentials: tokenSend === TokenType.Cookie,
  duplicateInterval: 500,
  interceptRequest(config) {
    const store = refStore();
    const token = store.state.authn.token;
    if (config.headers == null) config.headers = {};

    if (token && tokenName && tokenSend === TokenType.Header) {
      config.headers[tokenName] = token;
    }
    const captcha = store.state.authn.captcha;
    if (matchPath(config.url, captcha?.path) && captcha?.code) {
      logger.info('find captcha for', config.url, captcha);
      if (config.params) {
        config.params[captchaCheck] = captcha?.code;
      } else {
        config.params = { [captchaCheck]: captcha?.code };
      }
    }
    const zoneid = store.state.setting.zoneid;
    if (zoneid && zoneidHeader) {
      config.headers[zoneidHeader] = zoneid;
    }
    const locale = store.state.setting.locale;
    if (locale && localeHeader) {
      config.headers[localeHeader] = locale;
    }
    return config;
  },
  interceptResponse(response) {
    if (response.config?.params?.[captchaCheck] && response.status == 200) {
      const store = refStore();
      store.commit('authn/captcha', {});
    }
    const result = response.data;
    if (result == null) {
      return response;
    }

    if (result.success === false) {
      globalEvent.emit('Failure', new Error(result?.message || 'failure in response result'));
    }

    if (result instanceof Blob && (response.config as AxiosClientConfig).blobFailedIfJson) {
      const ct = ciGet<string>(response.headers, 'content-type', '');
      // failed
      if (ct && ct.includes('json')) {
        result.text().then(it => {
          const json = JSON.parse(it);
          globalEvent.emit('Failure', new Error(json?.message || 'failure in response result'));
        });
        response.data = null;
      }
    }

    return response;
  },
  interceptRejected(error, eject) {
    logger.debug(error, eject);
    if (eject === EjectType.Response) {
      const status = error.response?.status;
      if (status === httpNoAuthn) {
        globalEvent.emit('NoAuthn', error);
      } else if (status === httpNoPerms) {
        globalEvent.emit('NoPerms', error);
      } else if (status === httpDoubler) {
        globalEvent.emit('DblError', error);
      } else if (status === httpCaptcha) {
        globalEvent.emit('Captcha', error);
      } else if (status === httpRighter) {
        globalEvent.emit('Righter', error);
      } else if (status === httpBadGate) {
        globalEvent.emit('BadGateway', error);
      } else {
        globalEvent.emit('ApiError', error);
      }
    } else if (eject === EjectType.Request) {
      globalEvent.emit('NetError', error);
    } else {
      globalEvent.emit('DblError', error);
    }
  },
};

const apiClient = new AxiosClient(clientConfig);
export default apiClient;
