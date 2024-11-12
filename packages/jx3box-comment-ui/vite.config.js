/*
const path = require("path");

module.exports = {
    "devServer": {
        "proxy": {
            "/api/cms": {
                "target": process.env["DEV_SERVER"] == "true" ? "http://localhost:5120" : "https://cms.jx3box.com",
                "onProxyReq": function (request) {
                    request.setHeader("origin", "");
                }
            },
            "/api/next2": {
                "target": process.env["DEV_SERVER"] == "true" ? "http://localhost:8000" : "https://next2.jx3box.com",
                "onProxyReq": function (request) {
                    request.setHeader("origin", "");
                }
            },
            "/api": {
                target: process.env["DEV_SERVER"] == "true" ? "http://localhost:8000" : "https://pay.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                }
            }
        }
    },
    chainWebpack: config => {
        // 覆写 v-html 
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.compilerOptions.directives = {
                    html(node, directiveMeta) {
                        (node.props || (node.props = [])).push({
                            name: "innerHTML",
                            value: `xss(_s(${directiveMeta.value}))`
                        });
                    }
                };
                return options
            })


        //💖 import common less var * mixin ~
        const types = ["vue-modules", "vue", "normal-modules", "normal"];
        var preload_styles = [];
        preload_styles.push(
            path.resolve(__dirname, "./node_modules/csslab/base.less"),
            path.resolve(__dirname, "./node_modules/@jx3box/jx3box-common/css/var.less"),
        );
        function addStyleResource(rule) {
            rule.use("style-resource").loader("style-resources-loader").options({
                patterns: preload_styles,
            });
        }
        types.forEach((type) => addStyleResource(config.module.rule("less").oneOf(type)));
    }
}
*/

import { defineConfig } from "vite";
// import vue from '@vitejs/plugin-vue';
// import styleImport from "vite-plugin-style-import";
import path from "path";
import { createVuePlugin } from "vite-plugin-vue2";
// import babel from 'vite-plugin-babel';

export default defineConfig({
    plugins: [
        // vue(),
        // babel(),
        createVuePlugin(),
        // // 💖 Automatically import common LESS variables and mixins
        // styleImport({
        //     resolves: [
        //         {
        //             libraryName: "@jx3box/jx3box-common",
        //             resolveStyle: (name) =>
        //                 path.resolve(
        //                     __dirname,
        //                     `./node_modules/@jx3box/jx3box-common/css/var.less`
        //                 ),
        //         },
        //     ],
        // }),
    ],

    server: {
        proxy: {
            "/api/cms": {
                target:
                    process.env.DEV_SERVER === "true"
                        ? "http://localhost:5120"
                        : "https://cms.jx3box.com",
                changeOrigin: true,
                configure: (proxy) => {
                    proxy.on("proxyReq", (proxyReq) => {
                        proxyReq.setHeader("origin", "");
                    });
                },
            },
            "/api/next2": {
                target:
                    process.env.DEV_SERVER === "true"
                        ? "http://localhost:8000"
                        : "https://next2.jx3box.com",
                changeOrigin: true,
                configure: (proxy) => {
                    proxy.on("proxyReq", (proxyReq) => {
                        proxyReq.setHeader("origin", "");
                    });
                },
            },
            "/api": {
                target:
                    process.env.DEV_SERVER === "true"
                        ? "http://localhost:8000"
                        : "https://pay.jx3box.com",
                changeOrigin: true,
                configure: (proxy) => {
                    proxy.on("proxyReq", (proxyReq) => {
                        proxyReq.setHeader("origin", "");
                    });
                },
            },
        },
    },

    css: {
        preprocessorOptions: {
            less: {
                additionalData: `
                    @import "${path.resolve(
                        __dirname,
                        "./node_modules/csslab/base.less"
                    )}";
                    @import "${path.resolve(
                        __dirname,
                        "./node_modules/@jx3box/jx3box-common/css/var.less"
                    )}";
                `,
            },
        },
    },

    // Custom Vite plugin to handle the `v-html` directive for Vue
    optimizeDeps: {
        include: ["xss"], // Make sure xss is included in the bundle
    },
    // Resolve configuration
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
        extensions: [
            ".vue",
            ".mjs",
            ".js",
            ".mts",
            ".ts",
            ".jsx",
            ".tsx",
            ".json",
        ],
    },
});
