/**
 * @file file description
 * @author trydofor
 * @since 2021-09-15
 * @see {@link http://github.com/trydofor | trydofor}
 */

import client, { Result } from '@/apis/api-client';
import logger from '@/libs/logger';
import { ciGet } from '@/libs/objects';

export function mockRighter(id: string, doSuccess: (hd: string) => void): void {
  const url = '/mock/righter.json';
  client.getJson(url, { data: id }).then(it => {
    logger.debug('mock righter', id, it);
    doSuccess(ciGet<string>(it.headers, 'right-editor', ''));
  });
}

export function postRighter(hd: string, doSuccess: (it: Result<string>) => void): void {
  const url = '/mock/righter.json';
  client.postJson<Result<string>>(url, null, { headers: { 'Right-Editor': hd } }).then(it => {
    logger.debug('post righter', hd, it);
    doSuccess(it.data);
  });
}

export function mockDoubler(sleep: number): void {
  const url = '/mock/doubler.json';
  client.dataForm(url, { sleep }).then(it => {
    logger.debug('mock doubler', sleep, it);
  });
}

export function mockStatus(status: number): void {
  const url = '/mock/echo0o0.json?status=' + status;
  client.dataForm(url).then(it => {
    logger.debug('mock status', status, it);
  });
}

export function mockCaptcha(): void {
  const url = '/mock/captcha.json?data=mock-captcha';
  client.dataForm(url).then(it => {
    logger.debug('mock captcha', it);
  });
}
