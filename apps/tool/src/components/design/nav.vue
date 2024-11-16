<template>
    <div class="m-list-nav">
        <div class="m-nav-group">
            <router-link
                v-for="(item, i) in menu"
                :to="{ name: item.routeName }"
                :key="i"
                :class="{ on: isActive(item) }"
                class="u-item"
            >
                <i :class="item.icon"></i>
                <span class="u-text">{{ item.name }}</span>
            </router-link>
        </div>
    </div>
</template>

<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "list_nav",
    props: [],
    data: function () {
        return {
            menu: [
                {
                    icon: "el-icon-grape",
                    name: "Thư viện biểu tượng Kiếm Tam",
                    routeName: "icon"
                },
                {
                    icon: "el-icon-orange",
                    name: "Gói biểu cảm Kiếm Tam",
                    routeName: "emotion"
                },
                {
                    icon: "el-icon-map-location",
                    name: "Thư viện bản đồ Kiếm Tam",
                    routeName: "map"
                },
                {
                    icon: "el-icon-cherry",
                    name: "Thư viện hình vector Magic Box",
                    routeName: "vector"
                },
                {
                    icon: "el-icon-watermelon",
                    name: "Thư viện hình nền Magic Box",
                    routeName: "wallpaper"
                },
            ],
        };
    },
    methods: {
        isActive: function (item, routeName) {
            return item.routeName == this.$route.name;
        },
        getIcon: function (slug, type=".png") {
            return require("../../assets/img/nav/" + slug + type);
        },
    },
};
</script>
<style lang="less">
@import "../../assets/css/nav.less";
</style>
