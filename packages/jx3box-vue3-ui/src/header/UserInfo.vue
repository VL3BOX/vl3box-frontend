<template>
    <div class="c-header-panel c-header-info">
        <div class="c-header-profile" id="c-header-profile">
            <img class="u-avatar" :src="showAvatar(user.user_avatar)" />
            <template v-if="isPhone">
                <ul class="u-menu u-pop-content">
                    <li>
                        <a href="/dashboard">Trung tâm cá nhân</a>
                    </li>
                    <li>
                        <a :href="url.msg">Trung tâm tin nhắn</a>
                    </li>
                    <li>
                        <a :href="url.publish">Trung tâm đăng bài</a>
                    </li>
                    <hr />
                    <li v-for="item in userPanel" :key="item.label">
                        <a :href="item.link" :target="item.target || '_self'">
                            <!-- <i :class="item.icon || 'el-icon-present'"></i> -->
                            {{ item.label }}
                        </a>
                    </li>
                    <template v-if="isTeammate">
                        <li v-for="item in adminPanel" :key="item.label">
                            <a :href="item.link" :target="item.target || '_self'">
                                <!-- <i :class="item.icon || 'el-icon-present'"></i> -->
                                {{ item.label }}
                            </a>
                        </li>
                    </template>
                    <li>
                        <a class="" @click="logout">Đăng xuất</a>
                    </li>
                </ul>
            </template>
            <template v-else>
                <div class="c-header-userdata u-pop-content">
                    <div class="u-profile">
                        <div class="u-basic">
                            <a class="u-displayname" :href="url.homepage" :title="user.display_name" target="_blank">{{
                                showUserName(user.display_name)
                            }}</a>
                            <a class="u-sign" href="/dashboard/cooperation">
                                <img
                                    :src="super_author_icon"
                                    class="u-superauthor-profile"
                                    alt="superauthor"
                                    title="Tác giả ký hợp đồng"
                                    :class="{ off: !isSuperAuthor }"
                            /></a>
                            <a
                                class="u-vip"
                                href="/vip/premium?from=header_usermenu"
                                target="_blank"
                                title="Tài khoản phiên bản chuyên nghiệp"
                            >
                                <i class="i-icon-vip" :class="{ on: isPRO }">{{ vipType }}</i>
                                <span class="u-expire">有效期至：{{ pro_expire_date }}</span>
                            </a>
                        </div>
                        <div class="u-id">
                            <span
                                >UID Hộp Ma:<b>{{ user.ID }}</b></span
                            >
                            <el-icon @click.stop="copyText(user.ID)"><DocumentCopy /></el-icon>
                        </div>
                    </div>

                    <el-button-group class="u-actions">
                        <a class="el-button el-button--default is-plain" href="/dashboard">Trung tâm cá nhân</a>
                        <a class="el-button el-button--default is-plain" :href="url.profile">Cài đặt hồ sơ</a>
                        <a class="el-button el-button--default is-plain" href="/dashboard/frame">Phong cách chủ đề</a>
                    </el-button-group>

                    <div class="u-other">
                        <a href="/dashboard/fav" class="u-item"
                            ><el-icon><Star /></el-icon>Danh sách yêu thích và đăng ký
                        </a>
                        <a href="/team/role/manage" class="u-item"
                            ><el-icon><User /></el-icon>Quản lý vai trò
                        </a>
                        <a href="/dashboard/purchases" class="u-item"
                            ><el-icon><ShoppingCart /></el-icon>Tài nguyên đã mua
                        </a>
                        <a href="/dashboard/mall" class="u-item"
                            ><el-icon><ShoppingBag /></el-icon>Trung tâm đơn hàng
                        </a>
                        <hr />
                        <a href="/dashboard/feedback" class="u-item"
                            ><el-icon><Phone /></el-icon>Phản hồi và trợ giúp
                        </a>
                        <hr />
                        <div class="u-logout">
                            <el-button @click="logout" plain>Đăng xuất</el-button>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import * as utilModule from "@jx3box/jx3box-common/js/utils";
const { showAvatar } = utilModule;
import { showDate } from "@jx3box/jx3box-common/js/moment";
import { getMyInfo } from "../../service/author";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { copyText } from "../../utils";
import { getMenu } from "../../service/header";
export default {
    name: "HeaderUserInfo",
    props: ["asset"],
    emits: ["logout", "update"],
    data() {
        return {
            isPhone: window.innerWidth < 768,
            // 登录信息
            user: User.getInfo(),
            // links
            url: {
                msg: JX3BOX.__Links.dashboard.msg,
                publish: JX3BOX.__Links.dashboard.publish,
                dashboard: JX3BOX.__Links.dashboard.home,
                profile: JX3BOX.__Links.dashboard.profile,
                homepage: "/author/" + User.getInfo().uid,
            },

            isSuperAuthor: false,

            panel: [],
            isTeammate: false,
        };
    },
    computed: {
        siteRoot: function () {
            return location.host.includes("origin") ? JX3BOX.__OriginRoot : JX3BOX.__Root;
        },
        super_author_icon: function () {
            return JX3BOX.__imgPath + "image/user/" + "superauthor.svg";
        },
        vipType: function () {
            return "PRO";
        },
        isPRO: function () {
            return User._isPRO(this.asset) || false;
        },
        isAdmin() {
            return User.isAdmin();
        },
        userPanel: function () {
            return this.panel.filter((item) => {
                return !item.onlyAdmin;
            });
        },
        adminPanel: function () {
            return this.panel.filter((item) => {
                return item.onlyAdmin;
            });
        },
        pro_expire_date: function () {
            return this.asset.pro_expire_date ? showDate(this.asset.pro_expire_date) : "-";
        },
    },
    mounted() {
        this.loadMyInfo();
        this.loadPanel();
    },
    methods: {
        copyText,
        showAvatar,
        logout: function (mute = false) {
            User.destroy()
                .then(() => {
                    this.$emit("logout");
                    if (location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/publish")) {
                        location.href = this.siteRoot;
                    }
                })
                .then(() => {
                    if (mute) return;
                    this.$notify({
                        title: "Thành công",
                        message: "登出Thành công",
                        type: "success",
                        duration: 1000,
                    });
                });
        },
        showUserName: function (val) {
            return val || "Ẩn danh";
        },
        loadMyInfo: function () {
            getMyInfo().then((data) => {
                this.user = data;
                this.isSuperAuthor = !!data.sign;
                this.isTeammate = this.user?.is_teammate;
                localStorage.setItem("is_teammate", this.isTeammate);
                const permissions = this.user?.permission?.map(item => item.action)?.join(",");
                localStorage.setItem("jx3box_permission", permissions);
                this.$emit("update", this.user);
                if (this.user.deleted) {
                    this.logout(true);
                }
            });
        },
        loadPanel: function () {
            const panel = JSON.parse(sessionStorage.getItem("panel"));
            try {
                if (panel) {
                    this.panel = panel;
                } else {
                    getMenu("panel").then((res) => {
                        this.panel = res.data?.data?.val;
                        sessionStorage.setItem("panel", JSON.stringify(this.panel));
                    });
                }
            } catch (e) {
                this.panel = panel;
                console.log("loadPanel error", e);
            }
        },
    },
};
</script>
