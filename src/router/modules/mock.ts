import { RouteRecordRaw } from 'vue-router';
import { MenuGroup, menuItem, RouteName } from '@/router/router';
import { Permit } from '@/configs/permit';

/**
 * @file file description
 * @author trydofor
 * @since 2021-10-13
 * @see {@link http://github.com/trydofor | trydofor}
 */

const routes: RouteRecordRaw[] = [
  {
    path: '/mock-captcha',
    name: RouteName.MockCaptcha,
    component: () => import('@/views/mock/MockCaptcha.vue'),
    meta: {
      menuGroup: MenuGroup.MockFunction,
      menuName: menuItem(MenuGroup.MockFunction, 'NeedCaptcha'),
    },
  },
  {
    path: '/mock-doubler',
    name: RouteName.MockDoubler,
    component: () => import('@/views/mock/MockDoubler.vue'),
    meta: {
      menuGroup: MenuGroup.MockFunction,
      menuName: menuItem(MenuGroup.MockFunction, 'DoubleKill'),
    },
  },
  {
    path: '/mock-righter',
    name: RouteName.MockRighter,
    component: () => import('@/views/mock/MockRighter.vue'),
    meta: {
      menuGroup: MenuGroup.MockFunction,
      menuName: menuItem(MenuGroup.MockFunction, 'RightEditor'),
    },
  },
  {
    path: '/mock-permit',
    name: RouteName.MockPermit,
    component: () => import('@/views/mock/MockPermit.vue'),
    meta: {
      menuGroup: MenuGroup.MockFunction,
      menuName: menuItem(MenuGroup.MockFunction, 'AdminPermit'),
      permit: Permit.RoleAdmin,
    },
  },
];

export default routes;
