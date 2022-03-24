import { createApp } from 'vue';
import router from './router';
import { key, store } from './store';
import 'normalize.css';
import '@/styles/main.scss';
import '@/styles/element.scss';
import ElementPlus from 'element-plus';
import App from './App.vue';
import permit from '@/directives/permit';
import VueI18n from '@/locale';
import * as Sentry from '@sentry/vue';
import { sentryDsn, sentryRate } from '@/configs/global';

const Vue = createApp(App);
// use `Vue` for IDE compatible with Vue2
Vue.use(store, key);
Vue.use(router);
Vue.use(ElementPlus);
Vue.use(VueI18n);
Vue.directive('permit', permit);

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
