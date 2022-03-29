/**
 * @file global config
 * @author trydofor
 * @since 2021-10-12
 * @see {@link http://github.com/trydofor | trydofor}
 */
import { MenuItem } from '@/components/layout/AsideMenu';
import { children } from '@/router';
import { MenuGroup } from '@/router/router';
import logger from '@/libs/logger';
import { Opportunity } from '@element-plus/icons-vue';
import { isProduction } from '@/configs/global';
import { markRaw } from 'vue';
// 必须定义好顶层的菜单
export const menus: MenuItem[] = [];

// must here
if (!isProduction) {
  menus.push({
    title: MenuGroup.MockFunction,
    icon: Opportunity,
    index: MenuGroup.MockFunction,
    items: [],
  });
}

// 自动根据routes添加子菜单
for (const rt of children) {
  const rgp = rt.meta?.menuGroup as string;
  const rmu = rt.meta?.menuName as string;
  const rtm = rt.meta?.permit;
  let pmt: string[] | undefined;
  if (Array.isArray(rtm)) {
    pmt = rtm;
  } else if (typeof rtm === 'string') {
    pmt = [rtm];
  }

  if (rgp && rmu) {
    const top = menus.find(it => it.title === rgp);
    if (!top) continue;

    const icn = rt.meta?.menuIcon as string;
    const sub = top.items?.find(t => t.title === rmu);
    if (sub) {
      sub.title = rmu;
      sub.icon = icn;
      sub.index = rt.path;
      sub.permit = pmt;
    } else {
      if (!top.items) {
        top.items = [];
      }
      top.items.push({ title: rmu, icon: icn, index: rt.path, permit: pmt });
    }
  }
}

export function recurRaw(menus: MenuItem[]): MenuItem[] {
  for (const menu of menus) {
    const icn = menu.icon;
    if (icn && typeof icn !== 'string') {
      menu.icon = markRaw(icn);
    }
    if (menu.items) {
      recurRaw(menu.items);
    }
  }
  return menus;
}

logger.debug('menus', menus);
