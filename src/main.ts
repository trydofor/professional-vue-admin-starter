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
import { appRuntime, sentryDsn, sentryRate } from '@/configs/global';
import axios from 'axios';
import { createPinia } from 'pinia';
import logger from '@/libs/logger';
import { changeRunMode, RunMode } from '@/libs/runmode';

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

Vue.mount('#app');

//
axios
  .get(appRuntime.modeUrl)
  .then(res => {
    changeRunMode(res.data?.data as RunMode);
  })
  .catch(e => {
    logger.info('unknown RunMode', e);
  });
