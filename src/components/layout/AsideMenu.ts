import { Component } from 'vue';

export interface MenuBadge {
  value: string | number;
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  /**
   * menu's index
   */
  index?: string;
}

export interface MenuItem {
  title: string;
  index: string;
  icon?: string | Component;
  items?: MenuItem[];
  permit?: string[];
  badge?: MenuBadge;
}
