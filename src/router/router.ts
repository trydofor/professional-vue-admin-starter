import 'vue-router';
import { Component } from 'vue';

// noinspection AllyPlainJsInspection
export const RouteName = {
  Login: 'Login',
  Main: 'Main',
  MockPermit: 'MockPermit',
  MockDoubler: 'MockDoubler',
  MockRighter: 'MockRighter',
  MockCaptcha: 'MockCaptcha',
  MockSentry: 'MockSentry',
  MockOthers: 'MockOthers',
  MockDetail: 'MockDetail',
} as const;

export const RouteQuery = {
  Success: 'success',
  NotFound: 'NotFound404',
  BadGateway: 'BadGateway502',
} as const;

export const enum MenuGroup {
  MockFunction = 'Menu.MockFunction._',
}

export function menuItem(group: MenuGroup, name: string): string {
  return group.replace(/\._$/, '.') + name;
}

declare module 'vue-router' {
  interface RouteMeta {
    menuGroup: MenuGroup;
    menuName?: string;
    menuIcon?: string | Component;
    menuBase?: string;
    tipsFunc?: (rt: RouteLocationNormalized) => string | null;
    permit?: string | string[];
  }
}
