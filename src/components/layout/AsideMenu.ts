import { Component } from 'vue';

export interface MenuBadge {
  value: string | number;
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export interface MenuItem {
  title: string;
  index: string;
  icon?: string | Component;
  items?: MenuItem[];
  permit?: string[];
  badge?: MenuBadge;
  param?: Record<string, unknown>;
}
