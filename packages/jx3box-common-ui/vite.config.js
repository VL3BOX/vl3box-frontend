// const path = require("path");
// const pkg = require("./package.json");
// const { JX3BOX } = require("@jx3box/jx3box-common");
// // const Setting = require("./setting.json");

// module.exports = {
//     //❤️ define path for static files ~
//     publicPath:
//         //FOR Localhost => development
//         (process.env.NODE_ENV === "development" && "/") ||
//         //BY origin
//         (process.env.STATIC_PATH === "origin" && `${JX3BOX.__staticPath["origin"]}${pkg.name}/`) ||
//         //BY github
//         (process.env.STATIC_PATH === "github" && `${JX3BOX.__staticPath["github"]}${pkg.name}/`) ||
//         //BY jsdelivr
//         (process.env.STATIC_PATH === "jsdelivr" && `${JX3BOX.__staticPath["jsdelivr"]}${pkg.name}@gh-pages/`) ||
//         //BY OSS=>CDN
//         (process.env.STATIC_PATH === "mirror" && `${JX3BOX.__staticPath["mirror"]}${pkg.name}/`) ||
//         //BY relative path
//         (process.env.STATIC_PATH === "repo" && `/${pkg.name}/`) ||
//         //BY root path or bind a domain
//         (process.env.STATIC_PATH == "root" && "/") ||
//         //for lost
//         "/",

//     //❤️ Porxy ~
//     devServer: {
//         proxy: {
//             "/api/vip": {
//                 target: "https://pay.vl3box.com",
//                 onProxyReq: function(request) {
//                     request.setHeader("origin", "");
//                 },
//             },
//             "/api/inspire": {
//                 target: "https://pay.vl3box.com",
//                 onProxyReq: function(request) {
//                     request.setHeader("origin", "");
//                 },
//             },
//             "/api/team": {
//                 "target": "https://team.api.vl3box.com",
//                 onProxyReq: function(request) {
//                     request.setHeader("origin", "");
//                 },
//             },
//             "/api/cms": {
//                 target: process.env["DEV_SERVER"] == "true" ? "http://localhost:7100" : "https://cms.vl3box.com",
//             },
// 			"/api/article": {
// 				target: "https://next2.vl3box.com",
// 			},
//             "/api/messages": {
//                 target: "https://helper.vl3box.com",
//             },
//             "/api/post/favorite": {
//                 target: "https://helper.vl3box.com",
//             },
//             "/api/wiki": {
//                 target: "https://helper.vl3box.com",
//             },
//             "/api/personal": {
//                 target: "https://pay.vl3box.com",
//                 onProxyReq: function(request) {
//                     request.setHeader("origin", "");
//                 },
//             },
//             "/api/cny":{
//                 target: "https://pay.vl3box.com",
//                 onProxyReq: function(request) {
//                     request.setHeader("origin", "");
//                 },
//             },
//             "/api": {
//                 target: "https://next2.vl3box.com",
//                 onProxyReq: function(request) {
//                     request.setHeader("origin", "");
//                 },
//             },
//         },
//         disableHostCheck: true,
//     },

//     chainWebpack: (config) => {
//         //💘 html-webpack-plugin ~
//         // Multiple pages disable the block below
//         // config.plugin("html").tap(args => {
//         //     args[0].meta = {                            //------设置SEO信息
//         //         Keywords: Setting.keys,
//         //         Description: Setting.desc
//         //     };
//         //     args[0].title = Setting.title + SEO.title;  //------自动添加标题后缀
//         //     return args;
//         // });

//         //💝 in-line small imgs ~
//         config.module
//             .rule("images")
//             .use("url-loader")
//             .loader("url-loader")
//             .tap((options) => Object.assign(options, { limit: 10240 }));

//         //💝 in-line svg imgs ~
//         config.module
//             .rule("vue")
//             .use("vue-svg-inline-loader")
//             .loader("vue-svg-inline-loader");

//         //💖 import common less var * mixin ~
//         const types = ["vue-modules", "vue", "normal-modules", "normal"];
//         var preload_styles = [];
//         preload_styles.push(
//             path.resolve(__dirname, "./node_modules/csslab/base.less"),
//             path.resolve(__dirname, "./node_modules/@jx3box/jx3box-common/css/var.less")
//             // path.resolve(__dirname, './src/assets/css/var.less')
//         );
//         function addStyleResource(rule) {
//             rule.use("style-resource")
//                 .loader("style-resources-loader")
//                 .options({
//                     patterns: preload_styles,
//                 });
//         }
//         types.forEach((type) => addStyleResource(config.module.rule("less").oneOf(type)));
//     },
// };


import { defineConfig, loadEnv } from 'vite';
// import vue2 from '@vitejs/plugin-vue2';
import svgLoader from 'vite-svg-loader'
import path from 'path';
import pkg from './package.json';
import { JX3BOX } from '@jx3box/jx3box-common';
import { createVuePlugin } from 'vite-plugin-vue2'
// import vue from '@vitejs/plugin-vue2'

// Helper to determine base URL
const getBase = (mode) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  if (mode === 'development') return '/';
  
  switch (env.STATIC_PATH) {
    case 'origin':
      return `${JX3BOX.__staticPath["origin"]}${pkg.name}/`;
    case 'github':
      return `${JX3BOX.__staticPath["github"]}${pkg.name}/`;
    case 'jsdelivr':
      return `${JX3BOX.__staticPath["jsdelivr"]}${pkg.name}@gh-pages/`;
    case 'mirror':
      return `${JX3BOX.__staticPath["mirror"]}${pkg.name}/`;
    case 'repo':
      return `/${pkg.name}/`;
    case 'root':
      return '/';
    default:
      return '/';
  }
};

// Proxy configuration helper
const createProxy = (target, removeOrigin = false) => ({
  target,
  changeOrigin: true,
  configure: removeOrigin ? (proxy, _options) => {
    proxy.on('proxyReq', (proxyReq) => {
      proxyReq.setHeader('origin', '');
    });
  } : undefined
});

export default defineConfig(({ mode }) => ({
  // Base public path
  base: getBase(mode),

  // Plugins configuration
  plugins: [
    createVuePlugin(),
    // vue(),
    svgLoader()
  ],

  // Server configuration
  server: {
    proxy: {
      '/api/vip': createProxy('https://pay.vl3box.com', true),
      '/api/inspire': createProxy('https://pay.vl3box.com', true),
      '/api/team': createProxy('https://team.api.vl3box.com', true),
      '/api/cms': createProxy(
        process.env.DEV_SERVER === 'true' 
          ? 'http://localhost:7100' 
          : 'https://cms.vl3box.com'
      ),
      '/api/article': createProxy('https://next2.vl3box.com'),
      '/api/messages': createProxy('https://helper.vl3box.com'),
      '/api/post/favorite': createProxy('https://helper.vl3box.com'),
      '/api/wiki': createProxy('https://helper.vl3box.com'),
      '/api/personal': createProxy('https://pay.vl3box.com', true),
      '/api/cny': createProxy('https://pay.vl3box.com', true),
      '/api': createProxy('https://next2.vl3box.com', true)
    }
  },

  // Build configuration
  build: {
    assetsInlineLimit: 10240, // 10KB - equivalent to url-loader limit
  },

  // CSS configuration
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `
          @import "${path.resolve(__dirname, './node_modules/csslab/base.less')}";
          @import "${path.resolve(__dirname, './node_modules/@jx3box/jx3box-common/css/var.less')}";
        `,
      },
    },
  },

  // Resolve configuration
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.vue','.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']

  }
}));
