/**
 * @file file description
 * @author trydofor
 * @since 2021-10-12
 * @see {@link http://github.com/trydofor | trydofor}
 */
import { defineStore } from 'pinia';
import { cachingView } from '@/configs/global';
import { menus, recurRaw } from '@/configs/menu';
import { MenuItem } from '@/components/layout/AsideMenu';
import { copyTruthy } from '@/libs/objects';

export interface ViewData {
  path: string;
  name: string;
  tips?: string;
}

export interface CachingState {
  views: ViewData[];
  menus: MenuItem[];
}

export const useCachingStore = defineStore('caching', {
  state: (): CachingState => {
    return {
      views: [] as ViewData[],
      menus: recurRaw(menus),
    };
  },
  actions: {
    addView: function (payload: ViewData) {
      if (this.views.findIndex(it => it.path === payload.path) < 0) {
        this.views.push(payload);
      }
      if (this.views.length > cachingView) {
        this.views.splice(0, this.views.length - cachingView);
      }
    },
    delView: function (payload: ViewData | string) {
      if (this.views.length <= 1) return;
      const path = typeof payload === 'string' ? payload : payload.path;
      const idx = this.views.findIndex(it => it.path === path);
      if (idx >= 0) {
        this.views.splice(idx, 1);
      }
    },
    addMenu: function (payload: MenuItem[]) {
      this.menus.push(...recurRaw(payload));
    },
    delMenu: function (payload: MenuItem | string) {
      if (this.menus.length <= 0) return;
      const index = typeof payload === 'string' ? payload : payload.index;
      recurFind(this.menus, index, undefined);
    },
    modMenu: function (payload: MenuItem) {
      recurFind(this.menus, payload.index, payload);
    },
  },
});

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
