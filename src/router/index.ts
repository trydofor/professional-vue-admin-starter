import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from 'vue-router';
import { pathLogin } from '@/configs/global';
import { RouteName, RouteQuery } from '@/router/router';

const paths = new Set<string>();
const modules = require.context('./modules/', true, /\.ts$/);

//
export const children = [] as RouteRecordRaw[];
for (const fn of modules.keys()) {
  const rts = modules(fn).default as RouteRecordRaw[];
  for (const rt of rts) {
    const p = rt.path;
    if (paths.has(p)) {
      throw new Error('duplicated route path:' + p + ', file:' + fn);
    } else {
      paths.add(p);
      children.push(rt);
    }
  }
}

//
export const routes: RouteRecordRaw[] = [
  {
    path: pathLogin,
    name: RouteName.Login,
    component: () => import('@/views/AppLogin.vue'),
  },
  {
    path: '/',
    name: RouteName.Main,
    redirect: pathLogin,
    component: () => import('@/views/AppMain.vue'),
    children,
  },
  {
    path: '/:catchAll(.*)',
    redirect: { path: pathLogin, query: { error: RouteQuery.NotFound } },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export function refRouter(): Router {
  return router;
}

export default router;
