// noinspection AllyPlainJsInspection

/**
 * @file file description
 * @author trydofor
 * @since 2021-09-15
 * @see {@link http://github.com/trydofor | trydofor}
 */

import client, { Result } from '@/apis/api-client';
import globalEvent from '@/libs/global-event';
import debounce from 'lodash/debounce';
import { standardLocale } from '@/locale';
import logger from '@/libs/logger';
import { useAuthnStore } from '@/store/authn';
import { useSettingStore } from '@/store/setting';

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
  const authnStore = useAuthnStore();
  const settingStore = useSettingStore();
  if (!force && authnStore.name && settingStore.locale) {
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
    if (token && authnStore.token !== token) {
      authnStore.token = token;
    }

    const nickname = data.nickname;
    if (nickname && authnStore.name !== nickname) {
      authnStore.name = nickname;
    }

    // setting state
    const locale = standardLocale(data.locale);
    if (locale && settingStore.locale !== locale) {
      settingStore.locale = locale;
      globalEvent.emit('SetLocale', locale);
    }

    const zoneid = data.zoneid;
    if (zoneid && settingStore.zoneid !== zoneid) {
      settingStore.zoneid = zoneid;
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
