<template>
    <div class="m-post" v-loading="loading">
        <div v-if="list && list.length" class="m-archive-list">
            <ul class="u-list">
                <li v-for="(item, i) in list"  :key="i + item" class="u-item">
                    <!-- 标题 -->
                    <h2 class="u-post">
                        <!-- 标题文字 -->
                        <a :href="postLink(item.id)" class="u-title" target="_blank">{{ item.title || "无标题" }}</a>
                    </h2>
                    <!-- 字段 -->
                    <div class="u-content u-desc">
                        <i :class="item.client" class="u-client">{{ item.type }}</i>
                        {{ item.desc || '' }}
                    </div>
                    <!-- 日期 -->
                    <div class="u-misc">
                        <span class="u-date">
                            Updated on
                            <time >{{ item.updated_at | dateFormat}}</time>
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
            :current-page.sync="pageIndex"
            :page-size="per"
        >
        </el-pagination>
    </div>
</template>

<script>
import { getBattleList } from "@/service/author.js";
export default {
    props: [],
    data: function() {
        return {
            loading: false,
            list: [],
            total: 1,
            per : 8,
            pageIndex : 1
        };
    },
    computed : {
        params : function (){
            return {
                user_id: this.uid,
                pageIndex: this.pageIndex,
            }
        },
        uid : function (){
            return this.$store.state.uid
        }
    },
    methods: {
        loadData: function() {
            this.loading = true;
            getBattleList(this.params)
                .then((res) => {
                    this.list = res.data.data.list;
                    this.total = res.data.data.page.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        postLink: function(id) {
           return "/battle/#/combat/" + id;
        },
    },
    filters: {
        dateFormat: function(date) {
            if (!date) return;
            let format = "yyyy-MM-dd";
            switch (typeof date) {
                case "string":
                    date = new Date(date.replace(/-/g, "/"));
                    break;
                case "number":
                    date = new Date(date);
                    break;
            }
            if (!(date instanceof Date)) return;
            var dict = {
                "yyyy": date.getFullYear(),
                "M": date.getMonth() + 1,
                "d": date.getDate(),
                "H": date.getHours(),
                "m": date.getMinutes(),
                "s": date.getSeconds(),
                "MM": ("" + (date.getMonth() + 101)).substr(1),
                "dd": ("" + (date.getDate() + 100)).substr(1),
                "HH": ("" + (date.getHours() + 100)).substr(1),
                "mm": ("" + (date.getMinutes() + 100)).substr(1),
                "ss": ("" + (date.getSeconds() + 100)).substr(1)
            };
            return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {
                return dict[arguments[0]];
            });
        },
    },
    watch : {
        params : {
            deep:true,
            immediate:true,
            handler : function (){
                this.loadData();
            }
        }
    },
    mounted: function() {
    },
};
</script>
