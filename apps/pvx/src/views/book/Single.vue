<template>
    <div ref="bookSingleWrap" class="book-single-wrapper m-single-wrapper">
        <div class="back-wrap">
            <el-button @click="goBack">Trở về</el-button>
        </div>
        <div v-if="book" class="book-single-content" v-loading="loading">
            <div class="book-header">
                <h2 class="book-title">{{ book.Name }}</h2>
                <p class="book-desc" v-html="book.Desc"></p>
            </div>
            <div class="book-detail-wrapper">
                <div class="book-info">
                    <p class="u-subtitle">
                        <img svg-inline src="@/assets/img/book/book-info.svg" />
                        <span>Thông tin sách</span>
                    </p>
                    <div class="u-book-info">
                        <div v-if="!['其它', '碑铭'].includes(getOrigin(book))" class="u-item book-origin">
                            Nguồn:
                            <el-tooltip placement="top" popper-class="book-notice-tooltip">
                                <div slot="content">
                                    <template v-if="getOrigin(book).indexOf('Bí cảnh') > -1">
                                        <div class="u-detail-item">Bí cảnh</div>
                                        <div class="book-fb" v-html="getBossOrigin(book)"></div>
                                    </template>
                                    <template v-if="getOrigin(book).indexOf('Cửa hàng') > -1">
                                        <div class="u-detail-item">Cửa hàng</div>
                                        <div class="book-shop" v-html="getShopOrigin(book)"></div>
                                    </template>
                                    <template v-if="getOrigin(book).indexOf('Nhiệm vụ') > -1">
                                        <div class="u-detail-item">Nhiệm vụ</div>
                                        <div class="book-quest">
                                            <div
                                                class="quest-item"
                                                v-for="item in getQuestOrigin(book)"
                                                :key="item.questId"
                                            >
                                                <a target="_blank" :href="getLink('quest', item.questId)">
                                                    [{{ item.questName }}]</a
                                                >
                                            </div>
                                        </div>
                                    </template>
                                </div>
                                <span :class="getOrigin(book) !== '其它' && 'book-special'">{{ getOrigin(book) }}</span>
                            </el-tooltip>
                        </div>
                        <div v-else class="u-info-item">
                            Nguồn:<span v-if="getOrigin(book) === '碑铭'" class="book-special"
                                >{{ getOrigin(book) }}
                                <a
                                    class="look-site"
                                    href="javascript:;"
                                    v-if="bookMapSite.length"
                                    @click="dialogVisible = true"
                                    >Xem vị trí</a
                                >
                            </span>
                            <!-- 其它 -->
                            <span v-else>{{ getOrigin(book) }}</span>
                        </div>
                        <div class="u-info-item">
                            Bộ sách thuộc:{{ "【" + getProfessionType(book.ExtendProfessionID1) + "】" + book.BookName }}
                        </div>
                        <div class="u-info-item">Cấp độ đọc:{{ book.RequireLevel }}</div>
                    </div>
                    <template v-if="book.copy && book.copy.ID">
                        <p class="u-subtitle">
                            <img svg-inline src="@/assets/img/book/request.svg" />
                            <span>Yêu cầu sao chép</span>
                        </p>
                        <div class="u-book-info">
                            <div class="u-info-item">
                                <span>Cấp độ nhân vật:</span>
                                <span>{{ book.copy.RequirePlayerLevel }}</span>
                            </div>
                            <div class="u-info-item">
                                <span>Cấp độ đọc:</span>
                                <span>{{ book.copy.RequireLevel }}</span>
                            </div>
                            <div class="u-info-item">
                                <span>{{ getProfessionType(book.ExtendProfessionID1) }}等级：</span>
                                <span>{{ book.copy.RequireLevelExt }}</span>
                            </div>
                            <div class="u-info-item">
                                <span>Tiêu hao tinh lực:</span>
                                <span>{{ book.copy.CostVigor }}</span>
                            </div>
                            <div v-if="book.copyList.length" class="u-info-item">
                                <span>Nguyên liệu cần thiết:</span>
                                <item-icon
                                    v-for="meterial in book.copyList"
                                    :key="meterial.item_id"
                                    :item_id="meterial.item_id"
                                    :size="28"
                                    :amount="meterial.count"
                                    :onlyIcon="true"
                                ></item-icon>
                            </div>
                        </div>
                    </template>
                </div>
                <div
                    v-if="book.contentInfo"
                    class="book-content-wrapper"
                    :class="`book-content-wrapper-${book.ExtendProfessionID1}`"
                >
                    <div class="right-div"></div>
                    <div
                        v-if="/^\d+$/g.test(book.contentInfo)"
                        class="book-content"
                        :class="/^\d+$/g.test(book.contentInfo) && 'img-content'"
                    >
                        <img :src="iconLink(book.contentInfo, client)" :alt="iconLink(book.contentInfo, client)" />
                    </div>
                    <template v-else>
                        <div ref="bookWrap" class="book-content" :class="isVertical ? 'vertical' : 'row'">
                            <div ref="bookTitle" class="title">{{ book.Name }}</div>
                            <div ref="bookContent" class="content" v-html="book.contentInfo"></div>
                        </div>
                        <div v-if="arrowShow" class="buttons" :class="isVertical ? 'vertical' : 'row'">
                            <div class="left" :class="noMore && 'disabled'" @click="toMore">
                                <i :class="isVertical ? 'el-icon-arrow-left' : 'el-icon-arrow-down'"></i>
                                <!-- <span>Tiếp tục</span> -->
                            </div>
                            <div class="right" :class="noBack && 'disabled'" @click="toBack">
                                <!-- <span>Trở về</span> -->
                                <i :class="isVertical ? 'el-icon-arrow-right' : 'el-icon-arrow-up'"></i>
                            </div>
                        </div>
                        <div class="switch" @click="toSwitch">{{ isVertical ? "Cổ phong" : "Hiện đại" }}</div>
                    </template>
                </div>
            </div>
            <!-- 套书列表 -->
            <div v-if="bookList.length" class="m-book-list" v-loading="listLoading">
                <div class="u-title">
                    <span class="title">Bộ sách·{{ book.BookName }}</span>
                    <a
                        v-if="book.AchievementID"
                        class="book-achievement"
                        target="_blank"
                        :href="getLink('achievement', book.AchievementID)"
                    >
                        <!-- [{{ book.achievement ? book.achievement.Name : "" }}] -->
                        <i class="el-icon-warning"></i>
                        <span>Bộ sách này có thành tựu</span>
                    </a>
                </div>
                <div class="book-list-wrapper">
                    <div class="book-list-content">
                        <BookCard :item="item" v-for="(item, index) in bookList" :key="item.idKey + index"></BookCard>
                    </div>
                </div>
            </div>
            <!-- Thông tin bia sách -->
            <!-- <div v-if="bookMapSite.length" class="m-book-map">
                <div class="u-title">
                    <span class="u-txt">Thông tin bia sách</span>
                </div>
                <jx3box-map
                    class="u-content"
                    :map-id="parseInt(bookMapSite[0].map)"
                    :datas="bookMapSite[0].position"
                ></jx3box-map>
            </div> -->
        </div>
        <!-- 包含攻略、评论、历史版本、点赞等 Sách，宠物等物品为item, 声望成就等为achievement -->
        <pvx-user :id="id" name="Sách" type="item"></pvx-user>
        <!-- Thông tin bia sách -->
        <el-dialog
            title="Vị trí bia sách"
            :visible.sync="dialogVisible"
            :width="isPhone() ? '90%' : '38%'"
            center
            destroy-on-close
        >
            <div class="m-book-map">
                <jx3box-map
                    v-if="bookMapSite.length"
                    class="u-content"
                    :map-id="parseInt(bookMapSite[0].map)"
                    :datas="bookMapSite[0].position"
                ></jx3box-map>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Jx3boxMap from "@jx3box/jx3box-map/src/components/Map.vue";
import ItemIcon from "@/components/book/common/item_icon.vue";
import BookCard from "@/components/book/BookCard";
import PvxUser from "@/components/PvxUser.vue";

import bookProfession from "@/assets/data/book_profession.json";
// 碑铭坐标json
import bookMapInfoStd from "@/assets/data/stele_std_fwd.json";
import bookMapInfoOrigin from "@/assets/data/stele_origin_fwd.json";

// 副本地图json
import maps_std from "@jx3box/jx3box-data/data/fb/fb_map.json";
import maps_orgin from "@jx3box/jx3box-data/data/fb/fb_map_origin.json";

import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";

import { getLink, iconLink } from "@jx3box/jx3box-common/js/utils";

import { getInfo, getList } from "@/service/book";
import { isPhone } from "@/utils/index";

export default {
    name: "bookSingle",
    components: { Jx3boxMap, BookCard, ItemIcon, PvxUser },
    data() {
        return {
            compatible: false,
            is_empty: true,
            // 是否Cổ phong
            isVertical: true,
            arrowShow: false,
            book: {
                idKey: "",
                Name: "",
                Desc: "",
                BookName: "",
                contentInfo: "",
            },
            loading: false,
            bookMapSite: [], // 碑铭点位信息
            listLoading: false,
            bookList: [],
            dialogVisible: false,
            // 是否还有更多
            noMore: false,
            // 是否还可以Trở về
            noBack: true,
        };
    },
    methods: {
        toSwitch() {
            this.isVertical = !this.isVertical;
            this.noBack = true;
            this.noMore = false;
        },
        isPhone,
        toMore() {
            const isVertical = this.isVertical;
            const bookWrap = this.$refs.bookWrap;
            if (isVertical) {
                // 当前为Cổ phong
                const sW = bookWrap.scrollWidth;
                const sLeft = bookWrap.scrollLeft;
                const cW = bookWrap.clientWidth;
                const step = Math.ceil(cW / 4);
                if (sW + sLeft > cW) {
                    // 没到尽头
                    bookWrap.scrollBy({
                        left: -step,
                        behavior: "smooth",
                    });
                    this.noMore = false;
                    this.noBack = false;
                } else {
                    this.noMore = true;
                    this.noBack = false;
                }
            } else {
                // 当前为Hiện đại
                const sH = bookWrap.scrollHeight;
                const sTop = bookWrap.scrollTop;
                const cH = bookWrap.clientHeight;
                const step = Math.ceil(cH / 2);
                if (sH - sTop > cH) {
                    // 没到底
                    bookWrap.scrollBy({
                        top: step,
                        behavior: "smooth",
                    });
                    this.noMore = false;
                    this.noBack = false;
                } else {
                    this.noMore = true;
                    this.noBack = false;
                }
            }
        },
        toBack() {
            const isVertical = this.isVertical;
            const bookWrap = this.$refs.bookWrap;
            if (isVertical) {
                // 当前为Cổ phong
                const sLeft = bookWrap.scrollLeft;
                const cW = bookWrap.clientWidth;
                const step = Math.ceil(cW / 4);
                if (sLeft < 0) {
                    // 没到尽头
                    bookWrap.scrollBy({
                        left: step,
                        behavior: "smooth",
                    });
                    this.noBack = false;
                    this.noMore = false;
                } else {
                    this.noBack = true;
                    this.noMore = false;
                }
            } else {
                // 当前为Hiện đại
                const sTop = bookWrap.scrollTop;
                const cH = bookWrap.clientHeight;
                const step = Math.ceil(cH / 2);
                if (sTop > 0) {
                    // 没到顶
                    bookWrap.scrollBy({
                        top: -step,
                        behavior: "smooth",
                    });
                    this.noBack = false;
                    this.noMore = false;
                } else {
                    this.noBack = true;
                    this.noMore = false;
                }
            }
        },
        goBack() {
            this.$router.push({ path: "/" });
        },
        iconLink,
        getBossOrigin(book) {
            const fbMaps = this.client === "std" ? maps_std : maps_orgin;
            const maps = Object.values(fbMaps)
                .map((item) => Object.values(item.dungeon))
                .reduce(function (a, b) {
                    return a.concat(b);
                })
                .map((item) => {
                    return item.maps.map((mItem) => {
                        return {
                            map_id: Number(mItem.map_id),
                            name: mItem.mode + item.name,
                        };
                    });
                })
                .flat();
            const drops = book?.drops;
            if (drops && drops.length) {
                let orgin = "";
                drops.forEach((item) => {
                    orgin =
                        orgin +
                        (orgin ? "<br />" : "") +
                        ("[" + item.BossName + "]") +
                        (maps.find((mItem) => mItem.map_id === item.MapID)
                            ? "(" + maps.find((mItem) => mItem.map_id === item.MapID).name + ")"
                            : "");
                });
                return orgin;
            }
            return "";
        },
        getShopOrigin(book) {
            let shopNames = book?.ShopNames;
            if (shopNames) {
                shopNames = shopNames.replace(/\|/g, "<br />");
            }
            return shopNames;
        },
        getQuestOrigin(book) {
            const quests = book?.Quests;
            let questList = [];
            if (quests) {
                questList = quests.split(";").map((item) => {
                    if (item.indexOf(":") > -1) {
                        return {
                            questId: item.split(":")[0],
                            questName: item.split(":")[1],
                        };
                    }
                });
            }
            return questList;
        },
        getOrigin(item) {
            const tempId = item.DoodadTemplateID;
            const ShopNames = item?.ShopNames;
            const drops = item.drops || [];
            const quests = item?.Quests;
            let orgin = "";
            if (tempId) {
                orgin = orgin + (orgin ? "/" : "") + (this.bookMapInfo[tempId] ? "碑铭" : "其它");
            }
            if (ShopNames) {
                orgin = orgin + (orgin ? "/" : "") + "Cửa hàng";
            }
            if (drops.length) {
                orgin = orgin + (orgin ? "/" : "") + "Bí cảnh";
            }
            if (quests) {
                orgin = orgin + (orgin ? "/" : "") + "Nhiệm vụ";
            }
            if (!orgin) {
                orgin = "其它";
            }
            return orgin;
        },
        getProfessionType(type) {
            return bookProfession.find((item) => item.id === Number(type))
                ? bookProfession.find((item) => item.id === Number(type)).name
                : "";
        },
        getData() {
            this.loading = true;
            getInfo({
                id: this.idKey,
                client: this.client,
            })
                .then((res) => {
                    const data = res.data;
                    data.contentInfo = data.contents.map((item) => item.content.replace(/\\n/g, "<br>")).join("<br>");
                    if (data.DoodadTemplateID && this.bookMapInfo[data.DoodadTemplateID]) {
                        this.bookMapSite = this.bookMapInfo[data.DoodadTemplateID];
                        this.bookMapSite[0].position[0] = Object.assign(this.bookMapSite[0].position[0], {
                            title: data.Name,
                            content: `坐标：(${this.bookMapSite[0].position[0].x},${this.bookMapSite[0].position[0].y},${this.bookMapSite[0].position[0].z})`,
                        });
                    }
                    if (data?.copy?.ID) {
                        const keyArr = Object.keys(data.copy).filter((key) => key.indexOf("RequireItem") > -1);
                        let len = parseInt(keyArr.length / 3);
                        data.copyList = [];
                        for (let i = 1; i <= len; i++) {
                            if (data.copy["RequireItemType" + i]) {
                                data.copyList.push({
                                    item_id: data.copy["RequireItemType" + i] + "_" + data.copy["RequireItemIndex" + i],
                                    count: data.copy["RequireItemCount" + i],
                                });
                            }
                        }
                    }
                    this.book = data;
                    // 保存最近阅读
                    const recentBook = {
                        idKey: data.idKey,
                        Name: data.Name,
                        Desc: data.Desc,
                        ExtendProfessionID1: data.ExtendProfessionID1,
                    };
                    this.$store.dispatch("setRecentReadList", recentBook);
                    // 保存当前Sách类型
                    this.$store.dispatch("setCurrentBookType", data.ExtendProfessionID1);
                    // 获取套书列表
                    this.getBookList(data.BookName);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getBookList(keyword) {
            const params = {
                page: 1,
                pageSize: isPhone() ? 8 : 16,
                client: this.client,
                keyword,
            };
            this.$nextTick(() => {
                // const listWidth = this.$refs.bookSingleWrap?.clientWidth;
                // if (!isPhone() && Math.floor(listWidth / 210) < params.pageSize) {
                //     params.pageSize = Math.floor(listWidth / 210);
                // }
                this.listLoading = true;
                getList(params)
                    .then((res) => {
                        this.bookList = res.data.list || [];
                        this.listLoading = false;
                    })
                    .finally(() => {
                        this.listLoading = false;
                    });
            });
        },
        getLink,
    },
    mounted() {
        this.getData();
    },
    computed: {
        idKey: function () {
            return this.$route.params.id;
        },
        id: function () {
            return this.book?.ItemID;
        },
        client() {
            return this.$store.state.client;
        },
        bookMapInfo() {
            return this.client === "std" ? bookMapInfoStd : bookMapInfoOrigin;
        },
    },
    watch: {
        idKey() {
            this.getData();
        },
        id() {
            if (!/^\d+$/g.test(this.book.contentInfo)) {
                // 非图片
                this.$nextTick(() => {
                    const wrapSW = this.$refs.bookWrap.scrollWidth;
                    const wrapCW = this.$refs.bookWrap.clientWidth;
                    if (wrapSW > wrapCW) {
                        this.arrowShow = true;
                    }
                });
            }
        },
        isVertical(bol) {
            if (!/^\d+$/g.test(this.book.contentInfo)) {
                // 非图片
                if (bol) {
                    // 竖版
                    this.$nextTick(() => {
                        const wrapSW = this.$refs.bookWrap.scrollWidth;
                        const wrapCW = this.$refs.bookWrap.clientWidth;
                        this.arrowShow = wrapSW > wrapCW;
                    });
                } else {
                    this.$nextTick(() => {
                        const wrapSH = this.$refs.bookWrap.scrollHeight;
                        const wrapCH = this.$refs.bookWrap.clientHeight;
                        this.arrowShow = wrapSH > wrapCH;
                    });
                }
            }
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/book/single.less";
</style>
