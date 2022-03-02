import { Component } from 'vue';

export interface MenuItem {
  title: string;
  index: string;
  icon?: string | Component;
  items?: MenuItem[];
  permit?: string[];
}
