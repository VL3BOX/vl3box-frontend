<template>
    <div id="m-item-view">
        <div v-if="source" class="w-item">
            <div class="m-item-viewer">
                <div class="w-left">
                    <jx3-item :item_id="source.id" />
                </div>
                <div class="w-right">
                    <div class="m-name">
                        <div class="u-title">
                            <item-icon :item="source" :dishoverable="true" />
                            <h6
                                class="u-name"
                                :class="{ white: source.Quality == 1 }"
                                v-text="source.Name"
                                :style="{
                                    color: item_color(source.Quality),
                                }"
                            ></h6>
                        </div>

                        <div class="m-buttons fr">
                            <!-- 加入清单 -->
                            <Plan class="u-plan" :itemId="id" />
                            <!-- 收藏按钮 -->
                            <Fav
                                ref="fav"
                                class="u-collect"
                                post-type="item"
                                :post-id="source.id"
                                :post-title="fav_title"
                            />
                        </div>
                    </div>
                    <!-- 原料 -->
                    <div class="m-item-required" v-if="requiredList.length">
                        <span class="u-label">Nguyên liệu chế tạo</span>
                        <router-link
                            class="u-item"
                            v-for="item in requiredList"
                            :key="item.ID"
                            target="_blank"
                            :to="`/view/5_${item.ID}`"
                        >
                            <img class="u-icon" :src="iconLink(item)" :alt="item.Name" :title="item.Name" />
                            <span class="u-count">{{ item._count }}</span>
                        </router-link>
                    </div>
                    <!-- 其余Thuộc tính -->
                    <ul class="m-other-fields">
                        <li class="m-other-field">
                            <span class="u-label">Nhặt sẽ khóa</span>
                            <span class="u-value">{{ item_bind(source.BindType) }}</span>
                        </li>
                        <li class="m-other-field">
                            <span class="u-label">Có thể giao dịch</span>
                            <span class="u-value">{{ source.CanTrade ? "✔️ Có" : "❌ 不Có" }}</span>
                        </li>
                        <li>
                            <span class="u-label">Giá mua lại</span>
                            <GamePrice class="u-value" :price="source.Price" v-if="source.Price" />
                            <span class="u-value" v-else>-</span>
                        </li>
                        <!-- <li v-if="source.Level">
							<span class="u-label">Cấp chất lượng</span>
							<span class="u-value" v-text="source.Level"></span>
						</li> -->
                        <!-- <li class="m-other-field">
							<span class="u-label">Chất lượng</span>
							<span class="u-value" v-html="`<span style='color:${item_color(source.Quality)}'>${item_quality(source.Quality)}</span>`"></span>
						</li> -->

                        <li class="m-other-field">
                            <span class="u-label">Có thể chồng</span>
                            <span class="u-value">{{ source.CanStack ? "✔️ Có" : "❌ 不Có" }}</span>
                        </li>
                        <li v-if="source.MaxExistAmount > 0">
                            <span class="u-label">Số lượng tối đa</span>
                            <span class="u-value">{{ source.MaxExistAmount }}</span>
                        </li>
                        <li v-if="source.MaxExistTime > 0">
                            <span class="u-label">Hạn sử dụng</span>
                            <span class="u-value">{{ showDuration(source.MaxExistTime) }}</span>
                        </li>

                        <!-- <li v-if="source.BelongSchool">
							<span class="u-label">Môn phái</span>
							<span class="u-value">{{source.BelongSchool}}</span>
						</li>
						<li v-if="source.MagicKind">
							<span class="u-label">Tâm pháp</span>
							<span class="u-value">{{source.MagicKind}}</span>
						</li>
						<li v-if="source.MagicType">
							<span class="u-label">Thuộc tính</span>
							<span class="u-value">{{source.MagicType}}</span>
						</li> -->
                        <li v-if="source.GetType">
                            <span class="u-label">Cách thu được</span>
                            <span class="u-value">{{ source.GetType }}</span>
                        </li>
                        <li v-if="source.CanChangeMagic">
                            <span class="u-label">Có thể phù phép</span>
                            <span class="u-value">✔️ Có</span>
                        </li>
                        <li v-if="source.CanExterior">
                            <span class="u-label">Có thể thu thập</span>
                            <span class="u-value">✔️ Có</span>
                        </li>
                        <li v-if="source.CanSetColor">
                            <span class="u-label">Có thể nhuộm màu</span>
                            <span class="u-value">✔️ Có</span>
                        </li>
                        <li class="m-other-field">
                            <span class="u-label">Có thể phân rã</span>
                            <span class="u-value">{{ source.CanApart ? "✔️ Có" : "❌ 不Có" }}</span>
                        </li>
                        <li class="m-other-field">
                            <span class="u-label">Có thể phá hủy</span>
                            <span class="u-value">{{
                                source.CanDestroy || source.CanDestroy === null ? "✔️ Có" : "❌ 不Có"
                            }}</span>
                        </li>
                        <!-- <li v-if="source.CanShared">
							<span class="u-label">Có thể chia sẻ</span>
							<span class="u-value" v-text="'Có分享'"></span>
						</li> -->

                        <!-- <li v-if="source.Requires && source.Requires[100]">
							<span class="u-value" v-text="source.Requires[100]"></span>
						</li> -->
                        <!--<li v-if="source.Require1Type">
                            <label class="u-title" v-text="item_require_1_type(source.Require1Type) + '：'"></label>
                            <span class="u-value" v-text="source.Require1Value"></span>
                        </li>-->

                        <!-- <li v-if="source.AucGenre >= 1 && source.AucGenre <= 3">
							<span class="u-label">Độ bền</span>
							<span class="u-value" v-text="`${source.MaxDurability}/${source.MaxDurability}`"></span>
						</li> -->
                        <!--<li class="m-field">
                            <label class="u-title">磨损率：</label>
                            <span class="u-value" v-text="source.AbradeRate"></span>
                        </li>-->
                        <!--<li class="m-other-field">
                            <label class="u-title">修理费：</label>
                            <span class="u-value" v-text="source.RepairPriceRebate"></span>
                        </li>-->

                        <!-- <li v-if="source.CanConsume">
							<span class="u-label">Tiêu hao phẩm</span>
							<span class="u-value" v-text="'是'"></span>
						</li> -->
                    </ul>
                </div>
            </div>
        </div>

        <div class="m-tabs" v-if="showPrice">
            <div class="m-price-server">
                <i class="el-icon-s-shop"></i> Giá cả toàn server
                <el-select
                    v-if="activeTab === 'item-price-chart' || activeTab === 'item-prices'"
                    filterable
                    class="u-server"
                    v-model="server"
                    placeholder="Vui lòng chọn server"
                    size="mini"
                >
                    <el-option v-for="(serve, i) in servers" :key="i" :label="serve" :value="serve"></el-option>
                </el-select>
            </div>

            <el-tabs v-model="activeTab" type="border-card" @tab-click="active_tab_handle" v-loading="loading">
                <el-tab-pane label="📈 Biến động giá" name="item-price-chart" v-if="source && source.BindType != 3">
                    <item-price-chart ref="item_price_chart" :item_id="source.id" :server="server" />
                </el-tab-pane>
                <el-tab-pane label="💰 Giá gần đây" name="item-prices" v-if="source && source.BindType != 3" lazy>
                    <item-prices ref="item_prices" :item_id="source.id" :server="server" />
                </el-tab-pane>
                <!-- <el-tab-pane label="📜 相关物品清单" name="relation-plans" lazy>
                    <relation-plans :item_id="source.id" />
                </el-tab-pane> -->
            </el-tabs>
        </div>

        <Notice></Notice>
        <div class="m-wiki-post-panel" v-if="wiki_post && wiki_post.post">
            <WikiPanel :wiki-post="wiki_post">
                <template slot="head-title">
                    <img class="u-icon" svg-inline src="@/assets/img/item.svg" />
                    <span class="u-txt">Chiến lược vật phẩm</span>
                </template>
                <template slot="head-actions">
                    <a class="el-button el-button--primary" :href="publish_url(`item/${id}`)">
                        <i class="el-icon-edit"></i>
                        <span>完善Chiến lược vật phẩm</span>
                    </a>
                </template>
                <template slot="body">
                    <div class="m-wiki-compatible" v-if="compatible">
                        <i class="el-icon-warning-outline"></i> Chưa có chiến lược khởi đầu, dưới đây là chiến lược tái tạo, chỉ mang tính chất tham khảo,<a
                            class="s-link"
                            :href="publish_url(`item/${id}`)"
                            >Tham gia chỉnh sửa</a
                        >。
                    </div>
                    <Article :content="wiki_post.post.content" />
                    <div class="m-wiki-signature">
                        <i class="el-icon-edit"></i>
                        Chỉnh sửa lần này bởi <b>{{ user_name }}</b> Nộp vào{{ updated_at }}
                    </div>
                </template>
            </WikiPanel>

            <!-- 历史版本 -->
            <WikiRevisions type="item" :source-id="id" />

            <!-- 打赏 -->
            <div class="m-wiki-thx-panel">
                <WikiPanel>
                    <template slot="head-title">
                        <i class="el-icon-coin"></i>
                        <span class="u-txt">Tham gia đóng góp</span>
                    </template>
                    <template slot="body">
                        <Thx
                            class="m-thx"
                            :postId="id"
                            postType="item"
                            :postTitle="source.Name"
                            :userId="author_id"
                            :adminBoxcoinEnable="true"
                            :userBoxcoinEnable="true"
                            :authors="authors"
                            mode="wiki"
                            :key="'item-thx-' + id"
                            :client="client"
                            showRss
                        />
                    </template>
                </WikiPanel>
            </div>

            <!-- 百科评论 -->
            <WikiComments type="item" :source-id="id" />
        </div>
        <div class="m-wiki-post-empty" v-else>
            <i class="el-icon-s-opportunity"></i>
            <span>Chưa có chiến lược, tôi muốn</span>
            <a class="s-link" :href="publish_url(`item/${id}`)">Hoàn thiện chiến lược</a>
        </div>
    </div>
</template>

<script>
import Article from "@jx3box/jx3box-editor/src/Article.vue";
// import Fav from "@jx3box/jx3box-common-ui/src/interact/Fav.vue";
import Fav from "./item-fav";
import Item from "@jx3box/jx3box-editor/src/Item.vue";
import ItemIcon from "@/components/common/item-icon.vue";
import Plan from "@/components/item/plan.vue";
import WikiPanel from "@/components/wiki-panel.vue";
import WikiRevisions from "@/components/wiki-revisions.vue";
import WikiComments from "@/components/wiki-comments.vue";
import ItemPrices from "@/components/item/item-prices.vue";
import ItemPriceChart from "@/components/item/item-price-chart.vue";
import GamePrice from "@jx3box/jx3box-common-ui/src/wiki/GamePrice.vue";
import User from "@jx3box/jx3box-common/js/user";
import Notice from "@/components/cj/notice.vue";

import { postStat, postHistory } from "@jx3box/jx3box-common/js/stat";
import { wiki } from "@jx3box/jx3box-common/js/wiki_v2.js";
import { __Links } from "@jx3box/jx3box-common/data/jx3box.json";
import std_servers from "@jx3box/jx3box-data/data/server/server_std.json";
import origin_servers from "@jx3box/jx3box-data/data/server/server_origin.json";
import { item_color, item_quality, item_price, item_bind } from "@/filters";
import { publishLink, ts2str, showAvatar, iconLink } from "@jx3box/jx3box-common/js/utils";
import { getManufactureDetail, getItemDetail } from "@/service/item";
import { getMyInfo } from "@/service/user";
import { get_item, show_item_prices } from "@/service/item";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const DEFAULT_ACTIVE_TAB = "item-price-chart";

export default {
    name: "Detail",
    props: [],
    data: function () {
        return {
            source: {},
            wiki_post: {
                source: {},
                post: null,
            },
            compatible: false,
            is_empty: true,

            server: "",
            activeTab: DEFAULT_ACTIVE_TAB,
            loading: false,
            requiredList: [], // 原料列表
            showPrice: false,
        };
    },
    computed: {
        id: function () {
            return this.$route.params.item_id;
        },
        post_id: function () {
            return this.$route.params.post_id;
        },
        isRevision: function () {
            return !!this.$route.params.post_id;
        },
        author_id: function () {
            return ~~this.wiki_post?.post?.user_id;
        },
        servers: function () {
            return this.$store.state.client == "origin" ? origin_servers : std_servers;
        },
        isStdClient: function () {
            return this.$store.state.client == "std";
        },
        client: function () {
            return this.$store.state.client;
        },
        user_name: function () {
            return this.wiki_post?.post?.user_nickname;
        },
        updated_at: function () {
            return ts2str(this.wiki_post?.post?.updated);
        },
        auc: function () {
            return `${this.wiki_post?.source?.AucGenre}_${this.wiki_post?.source?.AucSubType}`;
        },
        fav_title: function () {
            return this.wiki_post?.source?.Name;
        },
        authors: function () {
            if (!this.isRevision) {
                return (
                    this.wiki_post?.users
                        ?.filter((user) => user.id)
                        ?.map((user) => {
                            return {
                                user_id: user.id,
                                user_avatar: user.avatar,
                                display_name: user.nickname,
                            };
                        }) || []
                );
            }
            return [];
        },
        firstServer: function () {
            for (let i of this.servers || []) {
                return i;
            }
            return "";
        },
        // favList() {
        //     return this.$store.state.myFavorites;
        // },
    },
    components: {
        "jx3-item": Item,
        ItemIcon,
        WikiPanel,
        WikiRevisions,
        WikiComments,
        Article,
        Fav,
        Plan,
        "item-prices": ItemPrices,
        "item-price-chart": ItemPriceChart,
        GamePrice,
        Notice,
    },
    methods: {
        get_data() {
            const item_id = this.source.id;
            if (item_id) {
                show_item_prices(item_id, {
                    server: this.server,
                    limit: 15,
                }).then((data) => {
                    data = data.data;
                    const prices = data.data?.prices.sort((a, b) => a.created + b.created) || [];
                    this.showPrice = !!prices.length;
                });
            }
        },
        active_tab_handle(tab) {
            if (tab.name === "item-price-chart") {
                this.$nextTick(() => {
                    this.$refs.item_price_chart?.render();
                });
            }
        },
        go_to_comment() {
            let target = document.querySelector("#m-reply-form");
            target.scrollIntoView(true);
        },
        publish_url: publishLink,
        item_color,
        item_quality,
        item_price,
        item_bind,
        ts2str,
        iconLink(item) {
            return iconLink(item.item_info[0]?.IconID || item.item_info?.IconID);
        },
        showAvatar: function (url) {
            return showAvatar(url, 32);
        },
        loadData: function () {
            // 获取最新攻略
            if (this.id) {
                get_item(this.id, this.client).then((res) => {
                    // console.log(res, "res");
                    this.source = res?.data?.data?.item;
                });
                wiki.mix({ type: "item", id: this.id, client: this.client }).then((res) => {
                    const { post, source, compatible, isEmpty, users } = res;
                    this.wiki_post = {
                        post: post,
                        source: source,
                        users,
                    };
                    this.is_empty = isEmpty;
                    this.compatible = compatible;

                    User.isLogin() && postHistory({
                        source_type: this.client == "origin" ? "origin_item" : "item",
                        source_id: ~~this.id,
                        link: location.href,
                        title: post.title,
                    });
                });
            }
            this.triggerStat();
        },
        loadRevision: function () {
            // 获取指定攻略
            wiki.getById(this.post_id, { type: "item" }).then((res) => {
                this.wiki_post = res.data.data?.post;
            });
            this.triggerStat();
        },
        triggerStat: function () {
            if (this.client == "origin") {
                postStat("origin_item", this.id);
            } else {
                postStat("item", this.id);
            }
        },
        loadItemDetail: function () {
            if (this.wiki_post?.source?.UiID) {
                getManufactureDetail({ sourceId: this.wiki_post?.source?.SourceID, client: this.client }).then(
                    (res) => {
                        const data = res?.data?.find(
                            (item) => item.CreateItemIndex1 === this.wiki_post?.source?.SourceID
                        );

                        if (!data) return;

                        let counts = [];
                        let itemIds = [];

                        if (data) {
                            for (const key in data) {
                                if (key.startsWith("RequireItemCount") && data[key]) {
                                    counts.push(data[key]);
                                }

                                if (key.startsWith("RequireItemIndex") && data[key]) {
                                    itemIds.push(data[key]);
                                }
                            }
                        }

                        getItemDetail({ ids: itemIds.join(","), per: 10, client: this.client }).then((itemRes) => {
                            this.requiredList = itemRes?.data?.list?.map((item, i) => {
                                return {
                                    ...item,
                                    _count: counts[i],
                                };
                            });
                        });
                    }
                );
            }
        },
        showDuration: function (val) {
            val = Number(val);
            return val && dayjs.duration(val).asDays().toFixed(0) + "天";
        },
        loadUserDefaultServer() {
            User.isLogin() &&
                getMyInfo().then((data) => {
                    let userServer = data?.jx3_server;
                    this.$nextTick(() => {
                        if (userServer && this.servers.includes(userServer)) {
                            this.server = userServer;
                        } else {
                            this.server = this.firstServer;
                        }
                        this.$refs.item_price_chart?.render();
                    });
                });
        },
    },
    watch: {
        id: {
            handler() {
                this.loadData();
            },
        },
        post_id: {
            handler() {
                this.loadRevision();
            },
        },
        source: {
            immediate: true,
            deep: true,
            handler() {
                let item = this.source;
                this.activeTab = item && item.BindType != 3 ? DEFAULT_ACTIVE_TAB : "relation-plans";
                this.$store.state.sidebar.AucGenre = Number(item.AucGenre);
                this.$store.state.sidebar.AucSubTypeID = Number(item.AucSubType);

                this.get_data();
                this.loadItemDetail();
            },
        },
        // favList: {
        //     deep: true,
        //     handler(list) {
        //         if (!list.find((item) => item.id === this.source.id)) {
        //             this.$refs.fav.favorite = false;
        //         }
        //     },
        // },
    },
    mounted: function () {
        if (this.post_id) {
            this.loadRevision();
        } else {
            this.loadData();
        }
        this.loadUserDefaultServer();
    },
    created() {
        if (this.$store.state.client == "origin") {
            this.server = "缘起稻香";
        } else {
            if (!this.server) {
                this.server = "梦江南";
            }
        }
        if (sessionStorage.getItem("server_name")) {
            this.server = sessionStorage.getItem("server_name");
            sessionStorage.removeItem("server_name");
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/detail.less";
</style>

<style lang="less" scoped>
.u-plan {
    margin-right: 10px;
}

.m-name {
    .flex;
    justify-content: space-between;

    .u-title {
        .flex;
        align-items: center;
    }
}
</style>
