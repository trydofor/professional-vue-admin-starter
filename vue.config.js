const { defineConfig } = require('@vue/cli-service');

// BGN git revision
const webpack = require('webpack');
const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin({ branch: true });
// END git revision

module.exports = defineConfig({
  productionSourceMap: false,
  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    allowedHosts: 'all',
    host: 'localhost',
    //port: 8080,
    headers: { 'Access-Control-Allow-Origin': '*' },
    client: {
      logging: 'info',
    },
    proxy: {
      '/': {
        target: process.env.VUE_APP_API_URL,
        secure: false,
        changeOrigin: true,
        preserveHeaderKeyCase: true,
        ws: false,
      },
    },
  },

  configureWebpack: {
    plugins: [
      gitRevisionPlugin,
      new webpack.DefinePlugin({
        VUE_APP_BUILD_HASH: JSON.stringify(gitRevisionPlugin.commithash()),
        VUE_APP_BUILD_BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
        VUE_APP_BUILD_TIME: JSON.stringify(new Date().toISOString()),
      }),
    ],
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
