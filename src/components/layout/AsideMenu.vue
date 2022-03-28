<template>
  <div :class="{ 'menu-logo-box': true, 'menu-logo-box-small': collapse }">
    <img
      src="@/assets/images/logo.png"
      :class="{ 'menu-logo-click': true, 'menu-logo-small': collapse }"
      alt=""
      @click="doIconClick()"
    />
  </div>
  <el-scrollbar ref="menuScrollBar" class="menu-scroll-bar">
    <el-menu
      :collapse="collapse"
      :default-active="active"
      @select="doMenuSelect"
      @open="doMenuOpen"
      @close="doMenuClose"
    >
      <RecurMenu :menus="store.state.caching.menus" />
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import RecurMenu from './RecurMenu.vue';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import logger from '@/libs/logger';
import globalEvent from '@/libs/global-event';
import { atopSmallMenu } from '@/configs/global';
import { useStore } from '@/store';

const router = useRouter();
const route = useRoute();
const menuScrollBar = ref();
const hwt = 50;
const tof = -400;
const store = useStore();

const active = computed(() => {
  const path = route.fullPath;
  const ttl = route.meta?.menuName || route.meta?.menuBase;
  let pthPx = tof;
  let ttlPx = tof;
  let tmd = null;

  for (const lv1 of store.state.caching.menus) {
    const opd = menuOpened.has(lv1.index);
    pthPx += hwt;
    if (tmd == null) {
      ttlPx += hwt;
    }
    const its = lv1.items;
    if (its && its.length > 0) {
      for (const lv2 of its) {
        if (opd) {
          pthPx += hwt;
          if (tmd == null) {
            ttlPx += hwt;
          }
        }
        if (lv2.index === path) {
          logger.debug('menu active by path', path, pthPx);
          menuScrollBar.value?.setScrollTop(pthPx);
          return lv2.index;
        }

        if (tmd == null && lv2.title === ttl) {
          tmd = lv2.index;
        }
      }
    }
  }
  if (tmd) {
    logger.debug('menu active by title', tmd, ttlPx);
    menuScrollBar.value?.setScrollTop(ttlPx);
    return tmd;
  }
  return '';
});

const collapse = ref(atopSmallMenu);

function doIconClick() {
  const rev = !collapse.value;
  collapse.value = rev;
  globalEvent.emit('SmallMenu', rev);
}

function doMenuSelect(index: string, indexPath: string[]): void {
  const top = indexPath[0];
  const grp = store.state.caching.menus.find(it => it.index === top);
  //logger.debug(index, indexPath, menus, top, grp);
  if (grp?.items) {
    for (const sub of grp.items) {
      if (sub.index === index) {
        logger.debug('menu select', sub);
        router.push(sub.index);
        return;
      }
    }
  }
}

const menuOpened = new Set<string>();
function doMenuOpen(index: string) {
  menuOpened.add(index);
  let pthPx = -hwt;
  for (const lv1 of store.state.caching.menus) {
    if (lv1.index === index) {
      setTimeout(() => menuScrollBar.value?.setScrollTop(pthPx), 500);
      return;
    }
    pthPx += hwt;
    const its = lv1.items;
    if (its && menuOpened.has(lv1.index)) {
      pthPx += hwt * its.length;
    }
  }
}

function doMenuClose(index: string) {
  menuOpened.delete(index);
}
</script>

<style lang="scss" scoped>
.menu-logo-box {
  position: relative;
  border-right: solid 1px var(--el-border-color);

  img {
    padding: 10px 15px 5px 15px;
    max-height: 30px;
    max-width: 200px;
  }
}

.menu-logo-box-small {
  width: 63px;
}

.menu-logo-click {
  cursor: pointer;
}

.menu-scroll-bar {
  height: calc(100vh - var(--wg-navbar-height) - 10px);
}

.menu-logo-small {
  width: 35px;
  height: 35px;
  object-fit: cover;
  object-position: left top;
}

:deep(.el-menu-item.is-active) {
  background-color: #eef0f4;
}
</style>
