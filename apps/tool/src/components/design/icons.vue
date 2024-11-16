<template>
    <div class="m-icons">
        <h1 class="m-icons-title">Thư viện biểu tượng Kiếm Tam</h1>
        <div class="m-icons-box">
            <el-radio-group v-model="mode" class="m-icons-radio">
                <el-radio-button label="search">Chế độ khám phá</el-radio-button>
                <el-radio-button label="view">Chế độ duyệt</el-radio-button>
            </el-radio-group>
            <IconsSearch v-if="mode === 'search'" />
            <IconsView v-if="mode === 'view'" />
            <!-- <el-tabs v-model="activeTabName" type="card">
                <el-tab-pane label="Thư viện biểu tượng" name="list">
                </el-tab-pane>
                <el-tab-pane label="Biểu tượng yêu thích" name="favicon">
                    <IconsFav />
                </el-tab-pane>
            </el-tabs> -->
        </div>
    </div>
</template>

<script>
import IconsSearch from "./search.vue";
import IconsView from "./icon_view.vue";
// import IconsFav from "./fav.vue";
export default {
    name: "icons",
    props: [],
    components: {
        IconsSearch,
        // IconsFav,
        IconsView,
    },
    data: function () {
        return {
            activeTabName: "list",

            mode: "search",
        };
    },
    computed: {},
    methods: {},
};
</script>

<style lang="less">
.m-icons-radio {
    .flex;
    justify-content: center;
    .mb(20px);
}
</style>
