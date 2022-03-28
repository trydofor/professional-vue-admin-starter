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
    <div class="wg-box-block"></div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { RouteName } from '@/router/router';
import { MenuItem } from '@/components/layout/AsideMenu';
import { Opportunity } from '@element-plus/icons-vue';
import { useStore } from '@/store';
import { ref } from 'vue';

const store = useStore();
const router = useRouter();

function onAddTab() {
  router.push({ name: RouteName.MockDetail, params: { id: '' + new Date().getTime() } });
}

let menuCount = 0;
function onAddMenu() {
  menuCount++;
  const items: MenuItem[] = [];
  for (let j = 1; j <= 9; j++) {
    items.push({
      title: 'Detail-' + menuCount + '-' + j,
      index: '/mock-detail/' + menuCount + '-' + j,
    });
  }

  const index = 'Menu.Test-' + menuCount;
  store.commit('caching/addMenu', {
    title: index,
    icon: Opportunity,
    index: index,
    items: items,
  });
}

function onDelMenu() {
  const index = 'Menu.Test-' + menuCount;
  store.commit('caching/delMenu', index);
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
  store.commit('caching/setMenuBadge', {
    index: '/mock-others',
    value: value,
    type: badgeType.value,
  });
}

function calcType(step: number) {
  const cur = badgeCount + step;
  return types[Math.abs(cur % types.length)];
}
</script>

<style scoped></style>
