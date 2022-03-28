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
import { menus } from '@/configs/menu';
import { MenuBadge, MenuItem } from '@/components/layout/AsideMenu';

const state: CachingState = {
  views: [] as ViewData[],
  menus: menus,
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
  addMenu: function (state, payload: MenuItem) {
    state.menus.push(payload);
  },
  delMenu: function (state, payload: MenuItem | string) {
    if (state.menus.length <= 0) return;
    const path = typeof payload === 'string' ? payload : payload.index;
    const idx = state.menus.findIndex(it => it.index === path);
    if (idx >= 0) {
      state.menus.splice(idx, 1);
    }
  },
  setMenuBadge: function (state, payload: MenuBadge) {
    if (state.menus.length <= 0) return;
    const menu = recurFind(state.menus, payload.index);
    if (menu) menu.badge = payload;
  },
};

function recurFind(items: MenuItem[], index?: string): MenuItem | null {
  if (!index) return null;

  for (const it of items) {
    if (it.index === index) {
      return it;
    }
    if (it.items) {
      const fd = recurFind(it.items, index);
      if (fd) return fd;
    }
  }
  return null;
}

export const cachingModule: Module<CachingState, RootState> = {
  namespaced: true,
  state,
  mutations,
};
