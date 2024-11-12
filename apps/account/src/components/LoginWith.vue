<template>
    <div class="m-oauth">
        <el-divider class="u-title">OR</el-divider>
        <el-row :gutter="20">
            <!-- <el-col :span="8"
                ><a class="u-item" :href="github">
                    <i class="u-oauth-logo"
                        ><img svg-inline src="../assets/img/github.svg"
                    /></i>
                    <span class="u-oauth-name">Github</span>
                </a></el-col
            > -->
            <el-col :span="8"
                ><a class="u-item" :href="qq">
                    <i class="u-oauth-logo"><img svg-inline src="../assets/img/qq.svg" /></i>
                    <span class="u-oauth-name">QQ</span>
                </a></el-col
            >
            <el-col :span="8"
                ><a class="u-item" :href="wechat">
                    <i class="u-oauth-logo"><img svg-inline src="../assets/img/wechat.svg" /></i>
                    <span class="u-oauth-name">微信</span>
                </a></el-col
            >
            <el-col :span="8"
                ><a class="u-item" :href="weibo">
                    <i class="u-oauth-logo"><img svg-inline src="../assets/img/weibo.svg" /></i>
                    <span class="u-oauth-name">微博</span>
                </a></el-col
            >
        </el-row>
    </div>
</template>

<script>
import connect from "@jx3box/jx3box-common/js/connect.js";
import User from "@jx3box/jx3box-common/js/user";
const client = location.host.includes('origin') ? 'origin' : 'std'
export default {
    name: "LoginWith",
    props: [],
    data: function () {
        return {
            github: this.buildState(connect.github),
            qq: this.buildState(connect.qq),
            weibo: this.buildState(connect.weibo),
            wechat: this.buildState(connect.wechat),
        };
    },
    computed: {
    },
    methods: {
        buildState : function (val){
            return val.replace('state=login',`state=login_${client}`)
        }
    },
    mounted: function () {},
    components: {},
};
</script>

<style lang="less">
@import "../assets/css/oauth.less";
</style>
