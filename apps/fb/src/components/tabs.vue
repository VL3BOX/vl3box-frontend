<template>
    <el-tabs class="m-fb-tabs" v-model="view" @tab-click="changeView">
        <el-tab-pane label="Hướng dẫn phó bản" name="index">
            <span slot="label">
                <i class="el-icon-collection"></i>
                <b>Hướng dẫn phó bản</b>
                <em class="u-secret">Khai phá đầu tiên</em>
            </span>
        </el-tab-pane>

        <el-tab-pane label="Vật phẩm rơi trong phó bản" name="drop">
            <span slot="label">
                <i class="el-icon-present"></i>
                <b>Vật phẩm rơi trong phó bản</b>
                <!-- <em class="u-new">最新同步</em> -->
            </span>
        </el-tab-pane>

        <el-tab-pane label="Danh sách ngọc quý" name="gem">
            <span slot="label">
                <i class="el-icon-cherry"></i>
                <b>Danh sách ngọc quý</b>
            </span>
        </el-tab-pane>

        <el-tab-pane label="Thành tựu phó bản" name="cj">
            <span slot="label">
                <i class="el-icon-medal"></i>
                <b>Thành tựu phó bản</b>
                <!-- <em class="u-new">最新同步</em> -->
            </span>
        </el-tab-pane>

        <el-tab-pane label="Truyền thuyết bí cảnh" name="story">
            <span slot="label">
                <i class="el-icon-film"></i>
                <b>Truyền thuyết bí cảnh</b>
            </span>
        </el-tab-pane>

        <el-tab-pane label="Dữ liệu thủ lĩnh" name="npc">
            <span slot="label">
                <i class="el-icon-aim"></i>
                <b>Dữ liệu thủ lĩnh</b>
                <!-- <em class="u-secret">重磅独家</em> -->
            </span>
        </el-tab-pane>

        <el-tab-pane label="Cơ chế đặc biệt" name="attr">
            <span slot="label">
                <i class="el-icon-help"></i>
                <b>Kỹ thuật cao cấp</b>
                <!-- <em class="u-new">全新上线</em> -->
            </span>
        </el-tab-pane>

        <el-tab-pane label="Dữ liệu kỹ năng" name="skill" v-if="isSuperAuthor && client == 'std'">
            <span slot="label">
                <i class="el-icon-key"></i>
                <b>Dữ liệu kỹ năng</b>
                <em class="u-ready">Ký kết</em>
            </span>
        </el-tab-pane>

        <el-tab-pane label="Phân tích mã nguồn" name="lua" v-if="isEditor">
            <span slot="label">
                <i class="el-icon-full-screen"></i>
                <b>Phân tích mã nguồn</b>
                <em class="u-ready">Ký kết</em>
            </span>
        </el-tab-pane>

        <!-- <el-tab-pane label="地图大全" name="map">
            <span slot="label">
                <i class="el-icon-map-location"></i>
                <b>地图大全</b>
            </span>
        </el-tab-pane> -->

        <!-- <el-tab-pane label="秘境百强" name="rank" v-if="client=='std'">
            <a slot="label" href="/rank" target="_blank">
                <i class="el-icon-trophy"></i>
                <b>秘境百强</b>
            </a>
        </el-tab-pane>

        <el-tab-pane label="团队管理" name="team">
            <a slot="label" href="/team" target="_blank">
                <i class="el-icon-user"></i>
                <b>团队管理</b>
            </a>
        </el-tab-pane> -->
    </el-tabs>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "tabs",
    props: [],
    data: function () {
        return {
            view: "index",
            isEditor: User.isEditor(),
            links: ["rank", "team"],
        };
    },
    watch: {
        $route: {
            immediate: true,
            handler: function (_route) {
                this.view = _route.name;
            },
        },
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        isSuperAuthor: function () {
            return this.$store.state.isSuperAuthor || false;
        },
    },
    methods: {
        changeView: function (tab) {
            if (!this.links.includes(this.view)) {
                this.$router.push({
                    name: this.view,
                    query: {
                        fb_name: this.$route.query.fb_name,
                    },
                });
            }
        },
    },
    mounted: function () {
        User.isLogin() &&
            User.isSuperAuthor().then((data) => {
                this.$store.state.isSuperAuthor = data;
            });
    },
};
</script>

<style lang="less">
@import "../assets/css/tabs.less";
</style>
