/**
 * @file file description
 * @author trydofor
 * @since 2022-08-11
 * @see {@link http://github.com/trydofor | trydofor}
 */

//
import { appRuntime } from '@/configs/global';

export const enum RunMode {
  Product = 'Product',
  Test = 'Test',
  Develop = 'Develop',
  Local = 'Local',
}

export interface AppRuntime {
  runMode: RunMode;
  modeUrl: string;
  element: { enabled: boolean; id: string; style: string; value: string[][] };
  rootvar: { enabled: boolean; name: string; value: string[][] };
}

export function changeRunMode(rmd: RunMode) {
  const ele = appRuntime.element;
  try {
    if (ele.enabled && ele.id) {
      for (const ve of ele.value) {
        if (rmd == ve[0] && ve[1]) {
          const it = document.getElementById(ele.id) as HTMLDivElement;
          // @ts-ignore
          it.style[ele.style] = ve[1];
          break;
        }
      }
    }
  } catch (e) {
    // ignore
  }

  const rvr = appRuntime.rootvar;
  try {
    if (rvr.enabled && rvr.name) {
      for (const ve of rvr.value) {
        if (rmd == ve[0] && ve[1]) {
          const it = document.querySelector(':root') as HTMLStyleElement;
          it.style.setProperty(rvr.name, ve[1]);
          break;
        }
      }
    }
  } catch (e) {
    // ignore
  }
}
