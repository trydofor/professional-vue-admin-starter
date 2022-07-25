/**
 * @file file description
 * @author trydofor
 * @since 2021-10-12
 * @see {@link http://github.com/trydofor | trydofor}
 */
import { defineStore } from 'pinia';

export interface SettingState {
  zoneid: string;
  locale: string;
}

export const useSettingStore = defineStore('setting', {
  state: (): SettingState => {
    return {
      zoneid: '',
      locale: '',
    };
  },
});
