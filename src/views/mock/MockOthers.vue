<template>
  <div class="wg-box-wrapper">
    <div class="wg-box-block">
      <el-button type="primary" @click="onAddTab">AddTab</el-button>
    </div>
    <div class="wg-box-block">
      <el-button type="primary" @click="onAddMenu">AddMenu</el-button>
      <el-button type="primary" @click="onDelMenu">DelMenu</el-button>
    </div>
    <div class="wg-box-block">
      <div>
        <el-button :type="calcType(1)" @click="onMenuBadge(1)">MenuBadge++</el-button>
        <el-button :type="calcType(-1)" @click="onMenuBadge(-1)">MenuBadge--</el-button>
        <el-button :type="calcType(7)" @click="onMenuBadge(7)">MenuBadge+7</el-button>
        <el-button :type="calcType(-7)" @click="onMenuBadge(-7)">MenuBadge-7</el-button>
      </div>
      <br />
      <div>
        <el-input v-model="badgeValue" style="width: 10em; padding-right: 1em"></el-input>
        <el-button :type="badgeType" @click="onMenuBadge(0)">MenuBadgeInput</el-button>
      </div>
    </div>
    <div class="wg-box-block">
      <p v-if="!isFranchisee()">{{ t('Common.Franchisee') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { RouteName } from '@/router/router';
import { MenuItem } from '@/components/layout/AsideMenu';
import { Opportunity } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { useCachingStore } from '@/store/caching';
import { isFranchisee } from '@/libs/franchisee';
import { useI18n } from '@/locale';

const cachingStore = useCachingStore();
const router = useRouter();
const { t } = useI18n();

function onAddTab() {
  router.push({ name: RouteName.MockDetail, params: { id: '' + new Date().getTime() } });
}

let menuCount = 0;
function onAddMenu() {
  menuCount++;
  const items: MenuItem[] = [];
  for (let j = 1; j <= 9; j++) {
    const pam = menuCount + '-' + j;
    items.push({
      title: 'Menu.MockFunction.DynamicAdd',
      param: { key: pam },
      index: '/mock-detail/' + pam,
    });
  }

  cachingStore.addMenu([
    {
      title: 'Menu.MockFunction.DynamicAdd',
      icon: Opportunity,
      param: { key: menuCount },
      index: 'Menu.Test-' + menuCount,
      items: items,
    },
  ]);
}

function onDelMenu() {
  const index = 'Menu.Test-' + menuCount;
  cachingStore.delMenu(index);
  menuCount--;
}

const badgeValue = ref('new');
const badgeType = ref('primary');
let badgeCount = 0;
const types = ['primary', 'success', 'warning', 'danger', 'info'];
function onMenuBadge(step: number) {
  badgeCount += step;
  const value = step == 0 ? badgeValue.value : badgeCount;
  badgeType.value = types[Math.abs(badgeCount % types.length)];
  cachingStore.modMenu({
    index: '/mock-others',
    badge: {
      value: value,
      // @ts-ignore
      type: badgeType.value,
    },
  });
}

function calcType(step: number) {
  const cur = badgeCount + step;
  return types[Math.abs(cur % types.length)];
}
</script>

<style scoped></style>
