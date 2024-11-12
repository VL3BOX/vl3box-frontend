<template>
    <div class="m-post" v-loading="loading">
        <!-- 列表 -->
        <div v-if="list && list.length" class="m-archive-list">
            <ul class="u-list">
                <li v-for="(item, i) in list"  :key="i + item" class="u-item">
                    <!-- 标题 -->
                    <h2 class="u-post">
                        <!-- 标题文字 -->
                        <a :href="postLink(item.id, item.client)" class="u-title" target="_blank">{{ item.title || "无标题" }}</a>
                    </h2>
                    <!-- 字段 -->
                    <div class="u-content u-desc">
                        <i :class="item.client" class="u-client">{{ item.client | clientLabel }}</i>
                        {{ item.desc || "这个配装没有任何描述" }}
                    </div>

                    <!-- 作者 -->
                    <div class="u-misc">
                        <span class="u-date">
                            Updated on
                            <time >{{ item.updated_at | dateFormat }}</time>
                        </span>
                    </div>
                </li>
            </ul>
        </div>
        <div class="m-empty" v-else>
            <img src='../assets/img/null.png' width="80%">
        </div>
        <el-pagination
            class="m-author-pages"
            background
            :hide-on-single-page="true"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            :page-size="per"
        >
        </el-pagination>
    </div>
</template>

<script>
import {getLink, showAvatar,authorLink,} from "@jx3box/jx3box-common/js/utils";
import dateFormat from "../utils/dateFormat";
import { getUserPz } from "@/service/cms.js";
import { __postType, __clients, __Root, __OriginRoot } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    props: [],
    data: function() {
        return {
            loading: false,
            list: [],
            total: 1,
            per: 8,
            page: 1,
            root: {
                std: __Root.slice(0,-1),
                origin: __OriginRoot.slice(0,-1),
            },
        };
    },
    computed: {
        params: function() {
            return {
                user_id: this.uid,
                page: this.page,
                per: this.per,
                // client: this.client,
            };
        },
        uid: function() {
            return this.$store.state.uid;
        },
        client: function() {
            return this.$store.state.client;
        },
    },
    methods: {
        loadData: function(i = 1) {
            this.loading = true;
            getUserPz(this.params)
                .then((res) => {
                    this.list = res.data.data.list || [];
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        postLink: function (id, client) {
            return this.root[client] + getLink('pz', id);
        },
    },
    filters: {
        authorLink,
        dateFormat: function(val) {
            return dateFormat(new Date(val));
        },
        showMark: function(val) {
            return mark_map[val] || val;
        },
        showAvatar: function(userinfo) {
            return showAvatar(userinfo?.user_avatar);
        },
        showNickname : function (userinfo){
            return userinfo?.display_name || '匿名'
        },
        clientLabel: function(val) {
            val = val || "std";
            return __clients[val];
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler: function() {
                this.loadData();
            },
        },
    },
    mounted: function() {},
};
</script>
