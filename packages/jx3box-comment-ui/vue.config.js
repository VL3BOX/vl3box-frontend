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