<template>
    <div class="m-info">
        <div class="m-info-router">
            <router-link title="Macro trực tuyến" to="/"><i class="el-icon-collection"></i></router-link>
            <router-link title="Macro của tôi" to="/bucket"><i class="el-icon-receiving"></i></router-link>
            <router-link title="Mục yêu thích" to="/fav"><i class="el-icon-star-off"></i></router-link>
            <router-link title="Macro bạn bè" to="/landspace"><i class="el-icon-sugar"></i></router-link>
            <router-link title="Bảng xếp hạng" to="/rank"><i class="el-icon-data-analysis"></i></router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: "Info",
    props: [],
    data: function() {
        return {};
    },
    computed: {
    },
    methods: {},
    mounted: function() {}
};
</script>

<style lang="less">
@import "~@/assets/css/info.less";
</style>
