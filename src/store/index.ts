import { InjectionKey } from 'vue';
import { createLogger, createStore, Store, useStore as baseUseStore } from 'vuex';
import { RootState } from '@/store/state';
import { isProduction } from '@/configs/global';
import { authnModule } from '@/store/modules/authn';
import { settingModule } from '@/store/modules/setting';
import { cachingModule } from '@/store/modules/caching';

const modules = {
  authn: authnModule,
  setting: settingModule,
  caching: cachingModule,
};

export type RootStore = Store<RootState>;
export const key: InjectionKey<RootStore> = Symbol();

const plugins = !isProduction ? [createLogger({})] : [];

export const store = createStore({
  plugins,
  modules,
});

/**
 * 采用vue官方 inject方式，仅在setup中使用
 */
export function useStore(): RootStore {
  const rs = baseUseStore<RootState>(key);
  if (rs == null) {
    throw new Error('must use in setup of composition api');
  }
  return rs;
}

/**
 * 采用常量方式，可非vue环境，全局使用
 */
export function refStore(): RootStore {
  return store;
}
