<template>
  <template v-for="menu in menus">
    <template v-if="hasPermit(menu.permit, true)">
      <el-sub-menu v-if="menu.items" :key="menu.index" :index="menu.index">
        <!--suppress HtmlUnknownAttribute -->
        <template #title>
          <i v-if="menu.icon" class="el-icon">
            <img v-if="isImgIcon(menu.icon)" class="menu-image-icon" :src="menu.icon" alt="" />
            <el-icon v-else>
              <component :is="menu.icon" />
            </el-icon>
          </i>
          <span>{{ t(menu.title, menu.param) }}</span>
          <el-badge class="menu-badge" :value="badgeValue(menu)" :hidden="badgeHidden(menu)" :type="badgeType(menu)" />
        </template>
        <RecurMenu :menus="menu.items"></RecurMenu>
      </el-sub-menu>
      <el-menu-item v-else :key="menu.index" :index="menu.index">
        <i v-if="menu.icon" class="el-icon">
          <img v-if="isImgIcon(menu.icon)" class="menu-image-icon" :src="menu.icon" alt="" />
          <el-icon v-else>
            <component :is="menu.icon" />
          </el-icon>
        </i>
        <!--suppress HtmlUnknownAttribute -->
        <template #title>
          <span>{{ t(menu.title, menu.param) }}</span>
          <el-badge class="menu-badge" :value="badgeValue(menu)" :hidden="badgeHidden(menu)" :type="badgeType(menu)" />
        </template>
      </el-menu-item>
    </template>
  </template>
</template>

<script setup lang="ts">
import { MenuItem } from '@/components/layout/AsideMenu';
import { hasPermit } from '@/libs/permit-helper';
import { useI18n } from '@/locale';

defineProps<{
  menus: MenuItem[];
}>();

const { t } = useI18n();
function isImgIcon(icon?: unknown) {
  return typeof icon === 'string';
}

function badgeValue(menu: MenuItem): string | number {
  if (menu.badge && menu.badge.value) {
    return menu.badge.value;
  }
  return 0;
}
function badgeType(menu: MenuItem): string {
  return menu.badge?.type || 'info';
}
function badgeHidden(menu: MenuItem) {
  return !(menu.badge && menu.badge.value);
}
</script>

<style lang="scss">
.menu-image-icon {
  width: 1em;
}
.menu-badge {
  top: -1em;
  left: 0.2em;
}
</style>
