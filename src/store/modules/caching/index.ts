/**
 * @file file description
 * @author trydofor
 * @since 2021-10-12
 * @see {@link http://github.com/trydofor | trydofor}
 */
import { Module, MutationTree } from 'vuex';
import type { RootState } from '@/store/state';
import { CachingState, ViewData } from './state';
import { cachingView } from '@/configs/global';
import { menus, recurRaw } from '@/configs/menu';
import { MenuItem } from '@/components/layout/AsideMenu';
import { copyTruthy } from '@/libs/objects';

const state: CachingState = {
  views: [] as ViewData[],
  menus: recurRaw(menus),
};

const mutations: MutationTree<CachingState> = {
  addView: function (state, payload: ViewData) {
    if (state.views.findIndex(it => it.path === payload.path) < 0) {
      state.views.push(payload);
    }
    if (state.views.length > cachingView) {
      state.views.splice(0, state.views.length - cachingView);
    }
  },
  delView: function (state, payload: ViewData | string) {
    if (state.views.length <= 1) return;
    const path = typeof payload === 'string' ? payload : payload.path;
    const idx = state.views.findIndex(it => it.path === path);
    if (idx >= 0) {
      state.views.splice(idx, 1);
    }
  },
  setView: function (state, payload: ViewData[]) {
    state.views = payload;
  },
  addMenu: function (state, payload: MenuItem[]) {
    state.menus.push(...recurRaw(payload));
  },
  delMenu: function (state, payload: MenuItem | string) {
    if (state.menus.length <= 0) return;
    const index = typeof payload === 'string' ? payload : payload.index;
    recurFind(state.menus, index, undefined);
  },
  setMenu: function (state, payload: MenuItem) {
    recurFind(state.menus, payload.index, payload);
  },
};

function recurFind(items: MenuItem[], index?: string, rep?: MenuItem): MenuItem | null {
  if (!index) return null;

  let idx = -1;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (it.index === index) {
      idx = i;
      break;
    }
    if (it.items) {
      const fd = recurFind(it.items, index, rep);
      if (fd) return fd;
    }
  }

  if (idx < 0) return null;
  const it = items[idx];
  if (rep == null) {
    items.splice(idx, 1);
    return it;
  }
  copyTruthy(rep, it);
  return it;
}

export const cachingModule: Module<CachingState, RootState> = {
  namespaced: true,
  state,
  mutations,
};
