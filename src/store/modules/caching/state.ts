/**
 * @file file description
 * @author trydofor
 * @since 2021-10-12
 * @see {@link http://github.com/trydofor | trydofor}
 */
import { MenuItem } from '@/components/layout/AsideMenu';

export interface ViewData {
  path: string;
  name: string;
  tips?: string;
}

export interface CachingState {
  views: ViewData[];
  menus: MenuItem[];
}
