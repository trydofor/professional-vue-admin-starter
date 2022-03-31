<template>
  <div ref="atopDivElement" class="atop-navi-box">
    <div class="tagged-box">
      <el-tabs
        v-model="tabActive"
        :style="{ width: tabsWidth + 'px' }"
        type="card"
        closable
        @tab-remove="doTagClose"
        @tab-click="doTagClick"
      >
        <el-tab-pane v-for="item in tagViews" :key="item.path" :label="tabLabel(item)" :name="item.path"> </el-tab-pane>
      </el-tabs>
    </div>
    <div class="setting-box">
      <el-dropdown placement="bottom-end" popper-class="wg-top-popper" @command="doMenuCommand">
        <div class="avatar-box">
          <img :src="avatar" class="avatar-img" :alt="username" />
          <div class="avatar-txt">{{ t('Navibar.Avatar', [username]) }}</div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled>{{ t('Navibar.Username', [username]) }}</el-dropdown-item>
            <el-dropdown-item :disabled="supportLocales.length <= 1" command="locale">
              {{ t('Navibar.Language', [t('Locale.' + language)]) }}
            </el-dropdown-item>
            <el-dropdown-item disabled>{{ t('Navibar.Timezone', [timezone]) }}</el-dropdown-item>
            <el-dropdown-item divided command="logout">{{ t('Common.Logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <el-dialog :model-value="showDialogLocale" width="30%" :title="t('Navibar.SwitchLocale')" @close="doLocaleClose">
      <el-radio v-for="lang in i18n.availableLocales" :key="lang" v-model="currentLocale" :label="lang">
        {{ t(I18nKey.locale(lang)) }}
      </el-radio>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="doLocaleClose">{{ t('Common.Cancel') }}</el-button>
          <el-button type="primary" @click="doLocaleChange">{{ t('Common.Confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onBeforeRouteUpdate, RouteLocationNormalized, useRoute, useRouter } from 'vue-router';
import avatar from '@/assets/images/user.png';
import { useStore } from '@/store';
import { computed, onMounted, ref } from 'vue';
import { logout } from '@/apis/authn/login';
import { switchLocale, tryInit } from '@/apis/authn/setting';
import { atopMenuWidth, atopSettingWidth, atopTabsWidth, pathLogin } from '@/configs/global';
import { I18nKey, standardLocale, supportLocales, useI18n } from '@/locale';
import globalEvent from '@/libs/global-event';
import { ViewData } from '@/store/modules/caching/state';

const i18n = useI18n();
const t = i18n.t;
const router = useRouter();
const route = useRoute();
const store = useStore();

const atopDivElement = ref<HTMLDivElement>();
// tag view
const tabsWidth = ref(atopTabsWidth);
const tabActive = ref('');
const tagViews = computed({
  get() {
    return store.state.caching.views;
  },
  set(tbs) {
    store.commit('caching/setView', tbs);
  },
});

globalEvent.on('SmallMenu', size => {
  if (size) {
    setTimeout(() => (tabsWidth.value = tabsWidth.value + atopMenuWidth), 500);
  } else {
    tabsWidth.value = tabsWidth.value - atopMenuWidth;
  }
});

function tabLabel(item: ViewData): string {
  if (item.tips) {
    return t(I18nKey.router(item.name), [item.tips]);
  } else {
    return t(I18nKey.router(item.name));
  }
}

function calcTabs(rt?: RouteLocationNormalized) {
  const cw = atopDivElement.value?.clientWidth;
  if (cw && cw > atopTabsWidth) {
    tabsWidth.value = cw - atopSettingWidth;
  }
  if (rt) {
    const path = rt.fullPath;
    const tips = rt.meta.tipsFunc?.(rt);
    store.commit('caching/addView', { path: path, name: rt.name, tips: tips });
    tabActive.value = path;
  }
}

function doTagClick() {
  const path = tabActive.value;
  if (route.fullPath !== path) {
    router.push(path);
  }
}

function doTagClose(path: string) {
  if (route.fullPath === path) {
    const views = store.state.caching.views;
    const idx = views.findIndex(it => it.path === path);
    if (idx >= 0) {
      if (idx - 1 >= 0) {
        router.push(views[idx - 1].path);
      } else if (idx + 1 < views.length) {
        router.push(views[idx + 1].path);
      }
    }
  }
  store.commit('caching/delView', path);
}

// setting
const username = computed(() => store.state.authn.name || '-');
const language = computed(() => standardLocale(store.state.setting.locale));
const timezone = computed(() => store.state.setting.zoneid || '-');

const showDialogLocale = ref(false);
const currentLocale = ref('');

function doMenuCommand(cmd: string): void {
  if (cmd === 'logout') {
    logout();
    router.push(pathLogin);
  } else if (cmd === 'locale') {
    currentLocale.value = i18n.locale.value;
    showDialogLocale.value = true;
  }
}

function doLocaleClose(): void {
  showDialogLocale.value = false;
}
function doLocaleChange(): void {
  const lc = currentLocale.value;
  switchLocale(lc, () => {
    store.commit('setting/locale', lc);
    globalEvent.emit('SetLocale', lc);
    showDialogLocale.value = false;
  });
}

onMounted(() => {
  tryInit();
  setTimeout(() => calcTabs(route), 500);
});

onBeforeRouteUpdate(to => {
  calcTabs(to);
});
</script>

<style lang="scss" scoped>
.atop-navi-box {
  height: 100%;
  line-height: inherit;
  align-items: center;
}

.tagged-box {
  height: 100%;
  line-height: inherit;
  display: inline-block;
  div {
    display: inline-block;
  }
  span {
    margin-left: 1em;
  }
}

.setting-box {
  padding-right: 20px;
  float: right;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.avatar-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.avatar-img {
  cursor: pointer;
  border-radius: 3px;
  height: 24px;
}

.avatar-txt {
  padding-left: 10px;
}
</style>
