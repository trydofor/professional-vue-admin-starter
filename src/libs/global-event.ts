/**
 * @file global event bus
 * @author trydofor
 * @since 2021-09-17
 * @see {@link http://github.com/trydofor | trydofor}
 */

import mitt, { Emitter } from 'mitt';
import { AxiosError } from 'axios';

/**
 * 统一放置存在的事件名及类型
 */
export type Events = {
  SetLocale: string;
  Failure: Error;
  ApiError: AxiosError;
  NetError: AxiosError;
  DblError: AxiosError;
  NoAuthn: AxiosError | Error;
  NoPerms: AxiosError | Error;
  Captcha: AxiosError;
  Righter: AxiosError;
};

const globalEvent: Emitter<Events> = mitt();

export default globalEvent;
