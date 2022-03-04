const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  productionSourceMap: false,
  devServer: {
    allowedHosts: 'all',
    proxy: {
      '/': {
        target: process.env.VUE_APP_API_URL,
        secure: false,
        changeOrigin: true,
      },
    },
  },

  chainWebpack: config => {
    config.module.rule('images').set('parser', {
      dataUrlCondition: {
        maxSize: 0,
      },
    });
  },

  pluginOptions: {
    i18n: {
      locale: process.env.VUE_APP_I18N_LOCALE,
      fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE,
      localeDir: 'locale',
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true,
    },
  },
});
