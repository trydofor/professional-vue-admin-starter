<template>
  <el-menu :collapse="collapse" :default-active="active" @select="doMenuSelect">
    <div class="menu-logo-box">
      <img
        src="@/assets/images/logo.png"
        :class="{ 'menu-logo-click': true, 'menu-logo-small': collapse }"
        alt=""
        @click="doIconClick()"
      />
    </div>
    <RecurMenu :menus="menus" />
  </el-menu>
</template>

<script setup lang="ts">
import RecurMenu from './RecurMenu.vue';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { menus } from '@/configs/menu';
import logger from '@/libs/logger';
import globalEvent from '@/libs/global-event';
import { atopSmallMenu } from '@/configs/global';

const router = useRouter();
const route = useRoute();

const active = computed(() => {
  const top = route.meta.menuGroup as string;
  const grp = menus.find(it => it.title === top);
  if (grp?.items) {
    const til = route.meta?.menuName || route.meta?.menuBase;
    for (const s of grp.items) {
      if (s.title === til) {
        logger.debug('menu active', s);
        return s.index;
      }
    }
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
  const grp = menus.find(it => it.index === top);
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
</script>

<style lang="scss" scoped>
.menu-logo-box {
  position: relative;
  padding: 10px 15px 5px 15px;

  img {
    max-height: 30px;
    max-width: 200px;
  }
}
.menu-logo-click {
  cursor: pointer;
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
