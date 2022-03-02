/* eslint-disable no-console */

/**
 * 在升级了chrome到95.0.4638.54后，以下lib出现了问题，暂时简单包装
 * js-logger 不能bing caller，无法正确显示代码位置。
 * loglevel 控制台无任何输出，尽管level设置正确。
 *
 * @file file description
 * @author trydofor
 * @since 2021-10-19
 * @see {@link http://github.com/trydofor | trydofor}
 */

import { logLevel } from '@/configs/global';

export const enum Level {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

function nothing(): void {
  // do nothing
}

// function timestamp(): string {
//   return new Date().toTimeString().substr(0, 8);
// }

function toLevel(str: string): Level {
  if (str === 'trace') return Level.TRACE;
  if (str === 'debug') return Level.DEBUG;
  if (str === 'info') return Level.INFO;
  if (str === 'warn') return Level.WARN;
  if (str === 'error') return Level.ERROR;
  return Level.INFO;
}

function wrapConsole(method: string, config: Level): (...data: unknown[]) => void {
  const level = toLevel(method);
  if (level < config) {
    return nothing;
  } else {
    let handler: (...data: unknown[]) => void;
    if (level === Level.TRACE) {
      handler = console.trace;
    } else if (level === Level.DEBUG) {
      handler = console.debug;
    } else if (level === Level.INFO) {
      handler = console.info;
    } else if (level === Level.WARN) {
      handler = console.warn;
    } else if (level === Level.ERROR) {
      handler = console.error;
    } else {
      throw new Error('bad level');
    }

    return handler;
    // 更新chrome 后，无法bind caller
    /*
    const log = handler.bind(console.log);
    return (...args) => {
      log(timestamp(), method.toUpperCase(), ...args);
    };
    */
  }
}

// const level: Level = Level.WARN;
const level = toLevel(logLevel.toLowerCase());
console.info('default log-level', level, logLevel);

const logger: Console = {
  ...console,
  trace: wrapConsole('trace', level),
  debug: wrapConsole('debug', level),
  info: wrapConsole('info', level),
  log: wrapConsole('info', level),
  warn: wrapConsole('warn', level),
  error: wrapConsole('error', level),
};

// export default console;
export default logger;
