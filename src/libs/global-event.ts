/**
 * @file global event bus
 * @author trydofor
 * @since 2021-09-17
 * @see {@link http://github.com/trydofor | trydofor}
 */

import mitt, { Emitter, Handler } from 'mitt';
import { AxiosError } from 'axios';

/**
 * 统一放置存在的事件名及类型
 */
export type Events = {
  SetLocale: string;
  SmallMenu: boolean;
  Failure: Error;
  BadGateway: Error;
  ApiError: AxiosError;
  NetError: AxiosError;
  DblError: AxiosError;
  NoAuthn: AxiosError | Error;
  NoPerms: AxiosError | Error;
  Captcha: AxiosError;
  Righter: AxiosError;
};

const globalEvent: Emitter<Events> = mitt();

export function eventSwitch<K extends keyof Events>(type: K, handler: Handler<Events[K]>) {
  return {
    on: () => {
      globalEvent.on(type, handler);
    },
    off: () => {
      globalEvent.off(type, handler);
    },
  };
}

export default globalEvent;
