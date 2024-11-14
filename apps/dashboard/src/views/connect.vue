<template>
    <uc class="m-dashboard-connect">
        <div class="m-profile-connect" v-loading="loading">
            <el-alert
                class="u-tip"
                title="通过第三方账号快速登录，如需解绑则需要先绑定一个邮箱"
                type="warning"
                show-icon
            >
            </el-alert>
            <div class="m-dashboard-content-list">
                <div class="m-item" v-for="type in oauth" :key="type">
                    <span class="u-profile-item">
                        <img :class="'u-' + type" svg-inline :src="icon(type)" />
                        <span class="u-status">
                            {{ types[type].name }}
                            <!-- {{ checkStatus(type) ? getNickname(type) : "未绑定" }} -->
                        </span>
                    </span>
                    <el-button
                        class="u-button"
                        :type="!checkStatus(type) ? 'primary' : 'danger'"
                        @click="!checkStatus(type) ? bind(type) : unbind(type)"
                    >
                        {{ !checkStatus(type) ? "立即绑定" : "解除绑定" }}
                    </el-button>
                </div>
            </div>
        </div>

        <el-dialog :visible.sync="showMiniProgram" title="绑定微信小程序" :width="isPhone ? '95%' : '400px'" custom-class="m-qrcode-dialog" :show-close="false">
            <div class="m-qr-content">
                <img class="u-login-qrcode" src="@/assets/img/connect/loginqrcode.jpg" alt="">
                <i class="u-tip">打开微信扫一扫，绑定小程序</i>
                <small class="u-tip-small">绑定之后需要重新登陆方可生效</small>
            </div>

            <template #footer>
                <el-button type="primary" @click="ihadBind">我已绑定</el-button>
            </template>
        </el-dialog>
    </uc>
</template>

<script>
import uc from "@/components/uc.vue";
import links from "@jx3box/jx3box-common/js/connect";
import { __imgPath, __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import { unbindOAuth, checkOAuth } from "@/service/profile";
const client = location.host.includes("origin") ? "origin" : "std";

const types = {
    github: {
        icon: "github",
        name: "Github",
    },
    qq: {
        icon: "qq",
        name: "QQ",
    },
    weibo: {
        icon: "weibo",
        name: "微博",
    },
    wechat: {
        icon: "wechat",
        name: "微信",
    },
    wechat_miniprogram: {
        icon: "app",
        name: "微信小程序",
    },
};

export default {
    name: "connect",
    props: [],
    data: function () {
        return {
            data: {
                github_name: "",
                github_id: "",

                weibo_name: "",
                weibo_id: "",

                qq_name: "",
                qq_unionid: "",

                wechat_name: "",
                wechat_unionid: "",

                wechat_miniprogram_openid: "",
            },
            oauth: ["github", "qq", "weibo", "wechat", "wechat_miniprogram"],
            types,

            showMiniProgram: false,
            isPhone: window.innerWidth < 768,

            loading: false,
        };
    },
    computed: {},
    methods: {
        checkStatus: function (type) {
            if (type == "qq" || type == "wechat") {
                return !!this.data[type + "_unionid"];
            } else if (type == "wechat_miniprogram") {
                return !!this.data[type + "_openid"];
            }
            return !!this.data[type + "_id"];
        },
        getNickname: function (type) {
            return this.data[type + "_name"] || "已绑定";
        },
        bind: function (type) {
            if (type == "wechat_miniprogram") {
                this.showMiniProgram = true;
                return;
            }
            location.href = links[type].replace("state=login", `state=bind_${client}`);
        },
        unbind: function (type) {
            this.$confirm("确定要解绑吗？", "解绑", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    unbindOAuth(type).then((res) => {
                        this.$message({
                            message: "解绑成功",
                            type: "success",
                        });
                        this.loadAuth();
                    });
                })
                .catch(() => {});
        },
        icon: function (type) {
            return __cdn + "design/user/" + types[type]['icon'] + ".png";
        },
        loadAuth() {
            this.loading = true;
            checkOAuth().then((res) => {
                this.data = res.data.data;
            }).finally(() => {
                this.loading = false;
            });
        },
        ihadBind() {
            this.showMiniProgram = false;
            this.loadAuth();
        },
    },
    mounted: function () {
        this.loadAuth();
    },
    components: {
        uc,
    },
};
</script>

<style lang="less">
@import "../assets/css/profile/connect.less";
</style>
