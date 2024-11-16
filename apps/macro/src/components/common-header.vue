<template>
    <div class="c-macro__header">
        <div class="m-archive-search" slot="search-before">
            <a :href="publish_link" class="u-publish el-button el-button--primary">+ Đăng tác phẩm</a>
            <el-input placeholder="Nhập nội dung tìm kiếm" v-model.trim.lazy="search" clearable @clear="onSearch" @keydown.native.enter="onSearch">
                <span slot="prepend"><i class="el-icon-search"></i> <span class="u-search">Từ khóa</span></span>
                <el-button slot="append" icon="el-icon-position" class="u-btn" @click="onSearch"></el-button>
            </el-input>
        </div>

        <!-- 筛选 -->
        <div class="m-archive-filter" v-if="canFilter">
            <div class="m-filter--left">
                <!-- 版本过滤 -->
                <clientBy @filter="filterImperceptibly" :type="client"></clientBy>
                <!-- 角标过滤 -->
                <markBy @filter="filterMeta"></markBy>
                <!-- Ngôn ngữ过滤 -->
                <menuBy @filter="filterMeta" :data="langs" type="lang" placeholder="Ngôn ngữ"></menuBy>
                <!-- 资料片过滤 -->
                <zlpBy @filter="filterMeta" type="zlp" :client="client"></zlpBy>
                <!-- 无界筛选 -->
                <el-checkbox v-model="is_wujie" class="u-wujie-filter" :true-label="1" :false-label="0" @change="onWujieChange">Chỉ xem không giới hạn</el-checkbox>
            </div>
            <div class="m-filter--right">
                <!-- 排序过滤 -->
                <orderBy @filter="filterMeta"></orderBy>
            </div>
        </div>
    </div>
</template>

<script>
import { appKey } from "@/../setting.json";
import { publishLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: 'CommonHeader',
    props: {
        canFilter: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            search: "",
            client: this.$store.state.client, //版本选择

            langs: {
                cn: "简体中文",
                tr: "繁體中文",
            },

            rows: 1,

            is_wujie: 0,
        }
    },
    computed: {
        // 发布按钮链接
        publish_link: function () {
            return publishLink(appKey);
        },
    },
    methods: {
        filterImperceptibly(val) {
            this.$emit('filterImperceptibly', val)
        },
        filterMeta(val) {
            this.$emit('filterMeta', val)
        },
        onSearch() {
            this.$emit('search', this.search)
        },
        onWujieChange() {
            this.$emit('wujie', this.is_wujie)
        }
    }
}
</script>
