import { captchaQuest } from '@/configs/global';

/**
 * @file file description
 * @author trydofor
 * @since 2021-10-21
 * @see {@link http://github.com/trydofor | trydofor}
 */

export function questUrl(url: string, code: string): string {
  const idx = url.indexOf('?');
  if (idx > 0) url = url.substring(0, idx);
  return url + '?' + captchaQuest + '=' + (code ? code : Date.now());
}

export function onlyPath(url: string): string {
  const idx = url.indexOf('?');
  return idx > 0 ? url.substring(0, idx) : url;
}

export function matchPath(url?: string, path?: string): boolean {
  if (url && path) {
    return url.startsWith(path);
  }
  return false;
}
