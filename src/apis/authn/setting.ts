// noinspection AllyPlainJsInspection

/**
 * @file file description
 * @author trydofor
 * @since 2021-09-15
 * @see {@link http://github.com/trydofor | trydofor}
 */

import client, { Result } from '@/apis/api-client';
import { refStore } from '@/store';
import globalEvent from '@/libs/global-event';
import debounce from 'lodash/debounce';
import { standardLocale } from '@/locale';
import logger from '@/libs/logger';

export const tryInit = debounce(() => {
  initUser();
}, 500);

//
interface InfoData {
  nickname: string;
  locale: string;
  zoneid: string;
  offset: number;
  authtype: string;
  token: string;
}

export function initUser(force = false): void {
  const store = refStore();
  if (!force && store.state.authn.name && store.state.setting.locale) {
    return;
  }

  const url = '/user/authed-user.json';
  client.dataJson<Result<InfoData>>(url).then(result => {
    const data = result.data;
    if (!result.success || !data) {
      globalEvent.emit('NoAuthn', new Error(result.message || 'failed to check authed-user'));
      return;
    }

    // authn state
    const token = data.token;
    if (token && store.state.authn.token !== token) {
      store.commit('authn/token', token);
    }

    const nickname = data.nickname;
    if (nickname && store.state.authn.name !== nickname) {
      store.commit('authn/name', nickname);
    }

    // setting state
    const locale = standardLocale(data.locale);
    if (locale && store.state.setting.locale !== locale) {
      store.commit('setting/locale', locale);
      globalEvent.emit('SetLocale', locale);
    }

    const zoneid = data.zoneid;
    if (zoneid && store.state.setting.zoneid !== zoneid) {
      store.commit('setting/zoneid', zoneid);
    }
  });
}

//
export function switchLocale(locale: string, doSuccess: () => void): void {
  logger.info('switchLocale', locale);
  doSuccess?.();
}
export function switchZoneid(zoneid: string, doSuccess: () => void): void {
  logger.info('switchZoneid', zoneid);
  doSuccess?.();
}
