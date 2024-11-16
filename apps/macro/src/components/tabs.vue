<template>
    <el-tabs class="m-tabs" v-model="view" @tab-click="changeView">
        <el-tab-pane label="Macro trên đám mây" name="index">
            <span slot="label">
                <i class="el-icon-collection"></i>
                <b>Macro trên đám mây</b>
                <em class="u-new">Đồng bộ dễ dàng</em>
            </span>
        </el-tab-pane>
        <el-tab-pane label="Kho macro của tôi" name="bucket">
            <span slot="label" class="u-label">
                <i class="el-icon-receiving"></i>
                <b>Kho macro cá nhân</b>
                <!-- <em class="u-pop" v-if="isLogin">{{ count }}</em> -->
                <!-- <em class="u-ready" v-else>Riêng tư</em> -->
            </span>
        </el-tab-pane>
        <el-tab-pane label="Macro tôi đã lưu" name="fav">
            <span slot="label" class="u-label">
                <i class="el-icon-star-off"></i>
                <b>Danh sách macro yêu thích</b>
            </span>
        </el-tab-pane>
        <el-tab-pane label="Macro được bạn bè chia sẻ" name="landspace">
            <span slot="label" class="u-label">
                <i class="el-icon-sugar"></i>
                <b>Macro của bạn bè</b>
            </span>
        </el-tab-pane>
        <el-tab-pane label="Bảng xếp hạng" name="rank">
            <span slot="label">
                <i class="el-icon-data-analysis"></i>
                <b>Bảng xếp hạng</b>
                <!-- <em class="u-new">Mới ra mắt</em> -->
                <!-- <em class="u-ready">Sắp ra mắt</em> -->
            </span>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
// import { getMyPostCount } from "@/service/post.js";
export default {
    name: "tabs",
    props: [],
    data: function () {
        return {
            view: "index",
            isLogin: User.isLogin(),
        };
    },
    watch: {
        '$route': {
            handler: function (_route) {
                this.view = _route.name;
            },
            immediate: true,
            deep: true,
        },
    },
    computed: {
        count: function () {
            return this.$store.state.my_macro_count;
        },
    },
    methods: {
        changeView: function () {
            this.$router.push({ name: this.view, query: Object.assign({}, this.$route.query, { page: 1 }) });
        },
    },
    created: function () {
        // User.isLogin() &&
        //     getMyPostCount().then((res) => {
        //         this.$store.state.my_macro_count = res.data.data.macro || 0;
        //     });
    },
};
</script>

<style lang="less">
@import "../assets/css/tabs.less";
</style>
