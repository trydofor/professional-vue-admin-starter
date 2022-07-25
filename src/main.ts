import { createApp } from 'vue';
import router from './router';
import 'normalize.css';
import '@/styles/main.scss';
import '@/styles/element.scss';
import ElementPlus from 'element-plus';
import App from './App.vue';
import permit from '@/directives/permit';
import waiting from '@/directives/waiting';
import VueI18n from '@/locale';
import * as Sentry from '@sentry/vue';
import { appRuntime, RunMode, runModeStyle, sentryDsn, sentryRate } from '@/configs/global';
import axios from 'axios';
import { createPinia } from 'pinia';

const appId = 'app';
const Vue = createApp(App);
// use `Vue` for IDE compatible with Vue2
Vue.use(createPinia());
Vue.use(router);
Vue.use(ElementPlus);
Vue.use(VueI18n);
Vue.directive('permit', permit);
Vue.directive('waiting', waiting);

// BGN sentry
if (sentryDsn) {
  Sentry.init({
    Vue,
    dsn: sentryDsn,
    tracesSampleRate: sentryRate,
    attachStacktrace: true,
    release: process.env.VUE_APP_BUILD_HASH,
    environment: process.env.VUE_APP_BUILD_BRANCH,
    // integrations: [
    //   new BrowserTracing({
    //     routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    //     tracingOrigins: ['localhost', 'moilioincircle.com', /^\//],
    //   }),
    // ],
  });
}
// END sentry

Vue.mount('#' + appId);

//
axios
  .get('/test/envs/run-mode.json')
  .then(res => {
    const rmd = res.data?.data as RunMode;
    const sty = runModeStyle.get(rmd);
    if (sty) {
      const app = document.getElementById(appId) as HTMLDivElement;
      app.style.borderTop = sty;
      appRuntime.runMode = rmd;
    }
  })
  .catch(() => {
    // ignore
  });
