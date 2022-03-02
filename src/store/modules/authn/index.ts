/**
 * @file file description
 * @author trydofor
 * @since 2021-10-04
 * @see {@link http://github.com/trydofor | trydofor}
 */
import { Module, MutationTree } from 'vuex';
import type { RootState } from '@/store/state';
import { AuthnState, Captcha } from './state';

const state: AuthnState = {
  token: '',
  name: '',
  captcha: {},
  permits: [],
};

const mutations: MutationTree<AuthnState> = {
  token(state, payload) {
    state.token = payload;
  },
  name(state, payload) {
    state.name = payload;
  },
  captcha(state, payload: Captcha) {
    state.captcha = payload;
  },
  permits(state, payload: string[]) {
    state.permits = payload;
  },
  logout(state) {
    state.token = '';
    state.name = '';
    state.permits = [];
  },
};
// const getters: GetterTree<AuthnState, RootState> = {
//   isAuthed(state) {
//     return state.token !== '';
//   },
// };

export const authnModule: Module<AuthnState, RootState> = {
  namespaced: true,
  state,
  mutations,
  // getters,
};
