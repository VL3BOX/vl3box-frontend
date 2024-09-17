const path = require('path');
const pkg = require("./package.json");
const { JX3BOX, SEO } = require("@jx3box/jx3box-common");
const Setting = require("./setting.json");

module.exports = {

    //❤️ Multiple pages ~
    pages:{
        login : {
            title : '登录 - JX3BOX',
            entry:'src/core/login/login.js',
            template : 'public/app.html',
            filename:'login/index.html',
        },
        register : {
            title : '注册 - JX3BOX',
            entry:'src/core/register/register.js',
            template : 'public/app.html',
            filename:'register/index.html',
        },
        email_verify : {
            title : '邮箱验证 - JX3BOX',
            entry:'src/core/email_verify/email_verify.js',
            template : 'public/app.html',
            filename:'email_verify/index.html',
        },
        password_reset : {
            title : '密码重设 - JX3BOX',
            entry:'src/core/password_reset/password_reset.js',
            template : 'public/app.html',
            filename:'password_reset/index.html',
        },
        login_callback : {
            title : '登录成功 - JX3BOX',
            entry:'src/core/login_callback/login_callback.js',
            template : 'public/app.html',
            filename:'login_callback/index.html',
        },
        // wechat : {
        //     title : '微信扫一扫 - JX3BOX',
        //     entry:'src/core/wechat/wechat.js',
        //     template : 'public/app.html',
        //     filename:'wechat/index.html',
        // },
    },

    //❤️ Porxy ~
    devServer: {
        proxy: {
            "/api/cms": {
                target: process.env["DEV_SERVER"] == "true" ? "http://localhost:7100" : "https://cms.jx3box.com",
            },
        }
    },

    //❤️ define path for static files ~
    publicPath:
        //FOR Localhost => development
        (process.env.NODE_ENV === 'development' && '/') ||

        //BY origin
        (process.env.STATIC_PATH === "origin" && `${JX3BOX.__staticPath["origin"]}${pkg.name}/`) || 

        //BY github
        (process.env.STATIC_PATH === "github" && `${JX3BOX.__staticPath["github"]}${pkg.name}/`) || 
        

        //BY jsdelivr
        (process.env.STATIC_PATH === "jsdelivr" && `${JX3BOX.__staticPath["jsdelivr"]}${pkg.name}@gh-pages/`) || 

        //BY OSS=>CDN
        (process.env.STATIC_PATH === "mirror" && `${JX3BOX.__staticPath["mirror"]}${pkg.name}/`) ||

        //BY relative path
        (process.env.STATIC_PATH === "repo" && `/${pkg.name}/`) || 

        //BY root path or bind a domain
        (process.env.STATIC_PATH == 'root' && '/') || 

        //for lost
        '/',

    chainWebpack: config => {

        //💘 html-webpack-plugin ~
        // config.plugin("html").tap(args => {
        //     args[0].meta = {                            //------设置SEO信息
        //         Keywords: Setting.keys,
        //         Description: Setting.desc
        //     };
        //     args[0].title = Setting.title + SEO.title;  //------自动添加标题后缀
        //     return args;
        // });


        //💝 in-line small imgs ~
        config.module
            .rule("images")
            .use("url-loader")
            .loader("url-loader")
            .tap(options => Object.assign(options, { limit: 10240 }));


        //💝 in-line svg imgs ~
        config.module
			.rule("vue")
			.use("vue-svg-inline-loader")
            .loader("vue-svg-inline-loader")


        //💖 import common less var * mixin ~
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
        var preload_styles = []
        preload_styles.push(
            path.resolve(__dirname, './node_modules/csslab/base.less'),
            path.resolve(__dirname, './node_modules/@jx3box/jx3box-common/css/var.less'),
            path.resolve(__dirname, './src/assets/css/var.less')
        )
        function addStyleResource (rule) {
            rule.use('style-resource')
              .loader('style-resources-loader')
              .options({
                patterns: preload_styles,
            })
        }
        types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)));

    }
};
