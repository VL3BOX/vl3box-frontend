<template>
    <DefaultLayout
        name="Bách khoa vật phẩm"
        slug="item"
        root="/item"
        :publishEnable="true"
        :feedbackEnable="true"
        :adminEnable="false"
    >
        <template #breadcrumb>
            <ItemBreadcrumb />
        </template>
        <template #left>
            <CommonNav>
                <Sidebar :sidebar="globalSidebar" />
            </CommonNav>
        </template>
        <Search :placeholder="placeholder" @search="search($event)">
            <template #filter>
                <el-popover placement="bottom-end" trigger="click" popper-class="m-search-filter-popper">
                    <div class="m-search-filter">
                        <el-select v-model="filter.BindType" filterable clearable placeholder="Loại trói buộc">
                            <el-option
                                v-for="item in enums.BindType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                        <el-select v-model="filter.BelongSchool" filterable clearable placeholder="Môn phái thuộc về">
                            <el-option v-for="item in enums.BelongSchool" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-model="filter.MagicKind" filterable clearable placeholder="Loại trắng">
                            <el-option v-for="item in enums.MagicKind" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-model="filter.MagicType" filterable clearable placeholder="Loại xanh">
                            <el-option v-for="item in enums.MagicType" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-model="filter.GetType" filterable clearable placeholder="Cách thu thập">
                            <el-option v-for="item in enums.GetType" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-model="filter.TypeLabel" filterable clearable placeholder="Loại vật phẩm">
                            <el-option v-for="item in enums.TypeLabel" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <div class="u-filter-level">
                            <el-input v-model="filter.MinLevel" placeholder="Phẩm chất thấp nhất"></el-input>
                            <span>~</span>
                            <el-input v-model="filter.MaxLevel" placeholder="Phẩm chất cao nhất"></el-input>
                        </div>
                    </div>
                    <el-button slot="reference" class="u-search-more" type="primary" plain>
                        <i class="el-icon-more"></i>
                    </el-button>
                </el-popover>
            </template>
        </Search>
        <keep-alive include="PlanList">
            <router-view />
        </keep-alive>
        <template #right>
            <Extend />
        </template>
    </DefaultLayout>
</template>

<script>
import { get_item_enums } from "@/service/item";

import DefaultLayout from "@/layout/default-layout.vue";
import ItemBreadcrumb from "@/components/item/item-breadcrumb.vue";
import Sidebar from "@/components/item/sidebar.vue";
import Extend from "@/components/item/extend.vue";
import Search from "@/components/common/search.vue";
import CommonNav from "@/components/common/nav.vue";

export default {
    name: "ItemIndex",
    components: { DefaultLayout, ItemBreadcrumb, Sidebar, Extend, Search, CommonNav },
    data() {
        return {
            placeholder: "Nhập tên đồ vật (có thể sử dụng dạng ngoặc vuông) / mô tả đồ vật「Enter」để tìm kiếm",

            filter: {
                BindType: null,
                BelongSchool: null,
                MagicKind: null,
                MagicType: null,
                GetType: null,
                TypeLabel: null,
                MinLevel: null,
                MaxLevel: null,
            },
            enums: {
                BindType: [],
                BelongSchool: [],
                MagicKind: [],
                MagicType: [],
                GetType: [],
                TypeLabel: [],
            },
        };
    },
    computed: {
        globalSidebar() {
            return this.$store.state.sidebar;
        },
        query() {
            return this.$route.query;
        },
        params() {
            return this.$route.params;
        },
        client() {
            return this.$store.state.client;
        }
    },
    watch: {
        $route: {
            // immediate: true,
            handler() {
                let sidebar = {};
                if (
                    typeof this.params.AucGenre === "undefined" &&
                    typeof this.params.AucSubTypeID === "undefined" &&
                    typeof this.query.auc_genre === "undefined" &&
                    typeof this.query.auc_sub_type_id === "undefined" &&
                    !this.params.item_id
                ) {
                    sidebar = { AucGenre: null, AucSubTypeID: null };
                } else {
                    sidebar = {
                        AucGenre: this.query.auc_genre || "",
                        AucSubTypeID: this.query.auc_sub_type_id || "",
                    };
                    // 如存在路由参数，优先使用路由参数
                    if (this.params.AucGenre) {
                        sidebar = {
                            AucGenre: this.params.AucGenre === "empty" ? "" : this.params.AucGenre,
                            AucSubTypeID: this.params.AucSubTypeID || "",
                        };
                    }
                }
                this.$store.commit("SET_STATE", { key: "sidebar", value: sidebar });
                this.initQuery();
            },
        },
        filter: {
            handler(val, oldVal) {
                if (val.MinLevel === oldVal.MinLevel && val.MaxLevel === oldVal.MaxLevel) {
                    this.search(this.keyword);
                }
            },
            deep: true,
        },
    },
    methods: {
        search(keyword) {
            let query = { page: 1 };
            // 菜单筛选
            if (this.$store.state.sidebar.AucGenre) query.auc_genre = this.$store.state.sidebar.AucGenre;
            if (this.$store.state.sidebar.AucSubTypeID) query.auc_sub_type_id = this.$store.state.sidebar.AucSubTypeID;

            for (let key in this.filter) {
                if (this.filter[key]) query[key] = this.filter[key];
            }

            this.$router.push({
                name: "search",
                params: { keyword: keyword },
                query: query,
            });
        },

        initQuery() {
            this.keyword = this.$route.params.keyword;
            const query = this.$route.query;
            for (let key in query) {
                if (this.filter[key] !== undefined)
                    this.filter[key] = !isNaN(Number(query[key])) ? Number(query[key]) : query[key];
            }
        },
    },
    mounted() {
        this.initQuery();
        get_item_enums({client: this.client}).then((res) => {
            const data = res.data?.data;
            if (!data) return;
            this.enums = data;
            this.enums.BindType = [
                {
                    label: "Không khóa khi nhặt",
                    value: 1,
                },
                {
                    label: "Khóa sau khi trang bị",
                    value: 2,
                },
                {
                    label: "Khóa sau khi nhặt",
                    value: 3,
                },
            ];
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
</style>
