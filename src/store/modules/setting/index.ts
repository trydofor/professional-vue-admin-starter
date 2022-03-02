/**
 * @file file description
 * @author trydofor
 * @since 2021-10-12
 * @see {@link http://github.com/trydofor | trydofor}
 */
import { Module, MutationTree } from 'vuex';
import type { RootState } from '@/store/state';
import { SettingState } from './state';

const state: SettingState = {
  zoneid: '',
  locale: '',
};

const mutations: MutationTree<SettingState> = {
  zoneid: function (state, payload) {
    state.zoneid = payload;
  },
  locale: function (state, payload) {
    state.locale = payload;
  },
};

export const settingModule: Module<SettingState, RootState> = {
  namespaced: true,
  state,
  mutations,
};
