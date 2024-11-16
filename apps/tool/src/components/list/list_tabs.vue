<template>
    <el-tabs class="m-tabs" v-model="view" @tab-click="changeView">
        <el-tab-pane label="Tất cả tài nguyên" name="all">
            <span slot="label">
                <img class="u-icon-img" src="@/assets/img/nav/all.png" alt="">
                <b>Tất cả tài nguyên</b>
            </span>
        </el-tab-pane>

        <el-tab-pane label="Tài nguyên công cụ" name="index">
            <span slot="label">
                <img class="u-icon-img" src="@/assets/img/nav/tool.png" alt="">
                <b>Tài nguyên công cụ</b>
                <!-- <em class="u-secret">Sách trắng uy tín</em> -->
            </span>
        </el-tab-pane>

        <el-tab-pane label="Dữ liệu plugin" name="jx3dat">
            <span slot="label">
                <img class="u-icon-img" src="@/assets/img/nav/data.png" alt="">
                <b>Dữ liệu plugin</b>
                <!-- <em class="u-secret">Tác phẩm chất lượng cao</em> -->
            </span>
        </el-tab-pane>

        <el-tab-pane label="Ghi chú học tập" name="game">
            <span slot="label">
                <img class="u-icon-img" src="@/assets/img/nav/code.png" alt="">
                <b>Ghi chú học tập</b>
                <!-- <em class="u-ready">签约</em> -->
            </span>
        </el-tab-pane>

        <el-tab-pane label="Tài liệu Magic Box" name="api">
            <span slot="label">
                <img class="u-icon-img" src="@/assets/img/nav/api.png" alt="">
                <b>Tài liệu Magic Box</b>
            </span>
        </el-tab-pane>

        <!-- <el-tab-pane label="Trợ lý Magic Box" name="desktop">
            <span slot="label">
                <i class="el-icon-notebook-1"></i>
                <b>Trợ lý Magic Box</b>
            </span>
        </el-tab-pane> -->
    </el-tabs>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
const subtypes = {
    all: "",
    index: 1,
    jx3dat: 2,
    game: 3,
    api: 4,
}
const _subtypes = {
    1: "index",
    2: "jx3dat",
    3: "game",
    4: "api",
}
export default {
    name: "tabs",
    props: [],
    data: function () {
        return {
            view: "all",
        };
    },
    watch: {
        $route: {
            handler: function (_route) {
                const subtype = _route.query.subtype;
                if (_route.name === 'index') {
                    if (subtype) {
                        this.view = _subtypes[subtype] || "index";
                    } else {
                        this.view = "all";
                    }
                } else {
                    this.view = _route.name;
                }
            },
            immediate: true,
            deep: true,
        },
    },
    computed: {
        client: function () {
            return this.$store.state.client || "std";
        },
        isSuperAuthor: function () {
            return this.$store.state.isSuperAuthor || false;
        },
    },
    methods: {
        changeView: function () {
            const name = this.view === 'all' ? 'index' : (subtypes[this.view] ? 'index' : this.view);
            this.$router.push({
                name: name,
                query: {
                    subtype: subtypes[this.view],
                },
            });
        },
        getIcon: function (slug, type = ".png") {
            return require("../../assets/img/nav/" + slug + type);
        },
    },
    mounted: function () {
        User.isSuperAuthor().then((data) => {
            this.$store.state.isSuperAuthor = data;
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/tabs.less";
</style>
