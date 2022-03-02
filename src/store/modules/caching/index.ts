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

const state: CachingState = {
  views: [] as ViewData[],
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
  delView: function (state, payload: ViewData) {
    if (state.views.length <= 1) return;
    const idx = state.views.findIndex(it => it.path === payload.path);
    if (idx >= 0) {
      state.views.splice(idx, 1);
    }
  },
  setView: function (state, payload: ViewData[]) {
    state.views = payload;
  },
};

export const cachingModule: Module<CachingState, RootState> = {
  namespaced: true,
  state,
  mutations,
};
