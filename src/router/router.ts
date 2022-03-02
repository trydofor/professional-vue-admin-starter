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
    permit?: string | string[];
  }
}
