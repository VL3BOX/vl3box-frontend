<template>
    <el-tabs class="m-tabs" v-model="view" @tab-click="changeView">
        <el-tab-pane label="Chiến lược nghề nghiệp" name="index">
            <span slot="label">
                <i class="el-icon-collection"></i>
                <b>Chiến lược nghề nghiệp</b>
                <!-- <em class="u-secret">Sách trắng uy tín</em> -->
            </span>
        </el-tab-pane>

        <el-tab-pane label="Khu vực chất lượng cao" name="highlights">
            <span slot="label">
                <i class="el-icon-star-off"></i>
                <b>Khu vực chất lượng cao</b>
                <em class="u-secret">Tác phẩm chất lượng</em>
            </span>
        </el-tab-pane>

        <!-- <el-tab-pane label="Hệ số kỹ năng" name="skill">
            <span slot="label">
                <i class="el-icon-key"></i>
                <b>Hệ số kỹ năng</b>
            </span>
        </el-tab-pane> -->

        <el-tab-pane label="技能/Buff数据库" name="raw">
            <span slot="label">
                <i class="el-icon-reading"></i>
                <b>Tổng hợp kỹ năng</b>
                <!-- <em class="u-ready">Ký hợp đồng</em> -->
            </span>
        </el-tab-pane>

        <el-tab-pane label="Tổng hợp bí kíp" name="recipe">
            <span slot="label">
                <i class="el-icon-magic-stick"></i>
                <b>Tổng hợp bí kíp</b>
            </span>
        </el-tab-pane>

        <el-tab-pane label="Tập hợp kỹ năng" name="kungfu">
            <span slot="label">
                <i class="el-icon-notebook-1"></i>
                <b>Tập hợp kỹ năng</b>
            </span>
        </el-tab-pane>

        <el-tab-pane label="Lịch sử sửa đổi kỹ thuật" name="changelog">
            <span slot="label">
                <i class="el-icon-news"></i>
                <b>Lịch sử sửa đổi kỹ thuật</b>
            </span>
        </el-tab-pane>

        <el-tab-pane label="Ngưỡng cấp tốc" name="haste">
            <span slot="label">
                <i class="el-icon-stopwatch"></i>
                <b>Ngưỡng cấp tốc</b>
            </span>
        </el-tab-pane>

        <el-tab-pane label="Máy tính DPS" name="dps">
            <span slot="label">
                <i class="el-icon-cpu"></i>
                <b>Máy tính DPS</b>
            </span>
        </el-tab-pane>

        <el-tab-pane label="Bảng xếp hạng môn phái" name="ladder" v-if="client == 'std'">
            <span slot="label">
                <i class="el-icon-s-data"></i>
                <b>Bảng xếp hạng môn phái</b>
            </span>
        </el-tab-pane>

        <!-- <el-tab-pane label="Bộ sưu tập tác phẩm" name="collection">
            <span slot="label">
                <i class="el-icon-paperclip"></i>
                <b>Bộ sưu tập tác phẩm</b>
            </span>
        </el-tab-pane> -->

        <el-tab-pane label="Phân tích mã nguồn" name="lua" v-if="isSuperAuthor">
            <span slot="label">
                <i class="el-icon-full-screen"></i>
                <b>Phân tích mã nguồn</b>
                <em class="u-ready">Ký hợp đồng</em>
            </span>
        </el-tab-pane>

        <!-- <el-tab-pane label="Nhóm môn phái" name="group" v-if="client == 'std'">
            <span slot="label">
                <i class="el-icon-headset"></i>
                <b>Nhóm môn phái</b>
            </span>
        </el-tab-pane> -->

        <!-- <el-tab-pane label="Câu chuyện nền" name="story">
            <span slot="label">
                <i class="el-icon-film"></i>
                <b>Câu chuyện nền</b>
            </span>
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
        };
    },
    watch: {
        $route: {
            handler: function (_route) {
                this.view = _route.name;
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
            this.$router.push({
                name: this.view,
                query: {
                    subtype: this.$route.query.subtype,
                },
            });
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
