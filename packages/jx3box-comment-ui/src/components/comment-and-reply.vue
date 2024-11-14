<template>
    <div class="c-comment-cmt">
        <div class="c-comment-cmt__box" :style="decorationStyles">
            <CommentAvatar
                :user-avatar="item.avatar | showAvatar"
                :user-href="item.userId | profileLink"
                :username="item.displayName"
                :avatarFrame="item.user_avatar_frame"
                :withFrame="true"
                :avatarSize="48"
            />
            <div class="u-flex-1">
                <div class="c-comment-cmt__author">
                    <el-link
                        class="u-name"
                        type="primary"
                        target="_blank"
                        :href="userHref"
                        >{{ username || "人字榜800线无名小侠" }}</el-link
                    >
                    <span
                        class="u-boxcoin"
                        v-if="total"
                        @click="onBoxcoinClick"
                    >
                        <img
                            class="u-boxcoin-img"
                            src="../assets/img/like4.png"
                            alt=""
                        />
                        卷面分：<span class="u-boxcoin-num">{{ total }}</span
                        ><i class="el-icon-coin"></i>
                    </span>
                    <span class="u-mark u-top" v-if="item.is_top"
                        ><i class="el-icon-download"></i>置顶</span
                    >
                    <span class="u-mark u-star" v-if="item.is_star"
                        ><i class="el-icon-star-off"></i>精华</span
                    >
                    <span class="u-mark u-secret" v-if="item.is_secret"
                        ><i class="el-icon-cherry"></i>悄悄话</span
                    >
                </div>
                <ContentOfCommentAndReply
                    :date="item.commentDate"
                    :content="item.content"
                    :comment-id="item.id"
                    :attachments="item.attachments | stringToArray"
                    :can-delete="power.can_del || power.uid == item.userId"
                    :can-set-top="
                        (power.is_author || power.is_editor) && !item.is_top
                    "
                    :can-cancel-top="
                        (power.is_author || power.is_editor) && item.is_top
                    "
                    :can-set-star="
                        !item.is_star && (power.is_author || power.is_editor)
                    "
                    :can-cancel-star="
                        item.is_star && (power.is_author || power.is_editor)
                    "
                    :can-add-white="
                        !item.is_white && power.article_open_white == 1
                    "
                    :can-remove-white="
                        item.is_white &&
                        (power.is_author == 1 || power.is_editor == 1)
                    "
                    :can-hide="power.is_author == 1 || power.is_editor == 1"
                    :can-approve="power.is_author == 1 || power.is_editor == 1"
                    :is-like="item.is_likes == 1"
                    :likes="~~item.likes"
                    :homework="homework"
                    @addNewReply="addNewReply"
                    @deleteComment="deleteComment"
                    @setTopComment="setTopComment"
                    @setStarComment="setStarComment"
                    @setLikeComment="setLikeComment"
                    @setWhiteComment="setWhiteComment"
                    @hide="hideComment"
                    @homework="onHomework"
                />
            </div>
        </div>
        <ReplyList
            :data="replyList"
            :pager="pager"
            :power="power"
            @addNewReply="addNewReply"
            @deleteReply="deleteReply"
            @goto="gotoReplyListIndex"
            @resetReply="resetReply"
            @setLikeComment="setLikeReply"
            @hide="hideComment"
        />
    </div>
</template>

<script>
import { showAvatar, authorLink } from "@jx3box/jx3box-common/js/utils";
import ContentOfCommentAndReply from "./comment-and-reply-subcomponents-content.vue";
import ReplyList from "./comment-and-reply-subcomponents-reply-list.vue";
import { POST, DELETE, GET, getHistorySummary } from "../service";
import { bus } from "../utils";
import CommentAvatar from "./avatar.vue";
const DECORATION_KEY = "decoration_comment_";
import { $cms } from "@jx3box/jx3box-common/js/https";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    props: [
        "item",
        "baseApi",
        "power",
        "user-href",
        "username",
        "homework",
        "postType",
    ],
    components: {
        ContentOfCommentAndReply,
        ReplyList,
        CommentAvatar,
    },
    data: function () {
        return {
            decoration: "",
            replyList: [],
            pager: {
                index: 1,
                pageSize: 10,
                pageTotal: 1,
                total: 0,
            },

            summary: {
                fromManager: 0,
                fromUser: 0,
            },
        };
    },
    filters: {
        stringToArray: function (str) {
            if (!str) {
                return [];
            }
            return JSON.parse(str);
        },
        showAvatar: function (val) {
            return showAvatar(val, 84);
        },
        profileLink: function (uid) {
            return authorLink(uid);
        },
    },
    created() {
        this.replyList = this.item.reply || [];
        this.getDecoration();
    },
    watch: {
        item: {
            deep: true,
            immediate: true,
            handler(val) {
                if (val?.id) {
                    this.loadHomeworkBoxcoin();
                }
            },
        },
    },
    computed: {
        total() {
            return this.summary.fromManager + this.summary.fromUser;
        },
        uid() {
            return this.item.userId;
        },
        decorationStyles() {
            return this.decoration
                ? {
                      backgroundImage: `url(${this.decoration})`,
                      borderRadius: "8px",
                  }
                : null;
        },
    },
    methods: {
        getDecoration() {
            let decoration_local = sessionStorage.getItem(
                DECORATION_KEY + this.uid
            );
            if (decoration_local) {
                //解析本地缓存
                let decoration_parse = JSON.parse(decoration_local);
                if (decoration_parse) {
                    this.decoration =
                        __imgPath +
                        `decoration/images/${decoration_parse.val}/comment.png`;
                    return;
                }
            }
            this.fetchDecoration({
                using: 1,
                user_id: this.uid,
                type: "comment",
            }).then((res) => {
                let decorationList = res.data.data;
                //筛选个人装扮
                let decoration = decorationList.find(
                    (item) => item.type == "comment"
                );
                if (decoration) {
                    this.decoration =
                        __imgPath +
                        `decoration/images/${decoration.val}/comment.png`;
                    sessionStorage.setItem(
                        DECORATION_KEY + this.uid,
                        JSON.stringify(decoration)
                    );
                    return;
                }
            });
        },
        //获取装扮
        fetchDecoration(params) {
            return $cms().get(`/api/cms/user/decoration`, {
                params: params,
            });
        },
        deleteComment() {
            this.$emit("deleteComment", this.item.id);
        },
        hideComment() {
            this.$emit("hide", this.item.id);
        },
        setTopComment(setTop) {
            this.$emit("setTopComment", this.item.id, setTop);
        },
        setStarComment(setStar) {
            this.$emit("setStarComment", this.item.id, setStar);
        },
        setLikeComment(setLike) {
            this.$emit("setLikeComment", this.item.id, setLike);
        },
        setLikeReply(id, setLike) {
            this.$emit("setLikeComment", id, setLike);
        },
        setWhiteComment(white) {
            this.$emit("setWhiteComment", this.item.id, white);
        },
        addNewReply(data) {
            POST(`${this.baseApi}/comment/${this.item.id}/reply`, null, data)
                .then(() => {
                    this.$notify({
                        title: "",
                        message: "评论成功!",
                        type: "success",
                        duration: 3000,
                        position: "bottom-right",
                    });

                    this.loadReplyList(this.pager.index);
                })
                .catch(() => {});
        },
        deleteReply(id) {
            DELETE(`${this.baseApi}/comment/${id}`)
                .then(() => {
                    this.$notify({
                        title: "",
                        message: "删除成功!",
                        type: "success",
                        duration: 3000,
                        position: "bottom-right",
                    });
                    this.loadReplyList(this.pager.index);
                })
                .catch(() => {});
        },
        gotoReplyListIndex(index) {
            this.loadReplyList(index, 6);
        },
        loadReplyList(index, pageSize) {
            GET(
                `${this.baseApi}/comment/${this.item.id}/reply/page/${index}?pageSize=${pageSize}`
            )
                .then((resp) => {
                    if (index == 1 && pageSize == 3) {
                        this.item.reply = resp.data || [];
                    }
                    this.replyList = resp.data || [];
                    this.pager = resp.page;
                })
                .catch(() => {});
        },
        resetReply() {
            this.loadReplyList(1, 3);
        },
        onHomework() {
            bus.emit("homework-click", this.item);
        },
        onBoxcoinClick() {
            bus.emit("boxcoin-click", this.item);
        },
        loadHomeworkBoxcoin() {
            if (!this.homework) return;
            getHistorySummary(this.postType, this.item.id).then((res) => {
                this.summary = res.data.data;
            });
        },
    },
};
</script>

<style lang="less">
.c-comment-cmt {
    .u-name {
        margin-right: 6px;
    }
    .u-mark {
        font-style: normal;
        font-size: 12px;
        padding: 2px 5px;
        border-radius: 2px;
        color: #fff;
        margin-left: 5px;
        cursor: default;
        display: inline-flex;
        align-items: center;
    }
    .u-top {
        background-color: #6f42c1;
        i {
            transform: rotate(180deg);
        }
    }
    .u-star {
        background-color: #fba524;
        i {
            margin-right: 2px;
        }
    }
    .u-secret {
        background-color: #ff99cc;
    }
}
.c-comment-cmt__box {
    display: flex;
    padding-top: 5px;
    background-size: cover;
    .u-flex-1 {
        flex: 1;
    }
}
.c-comment-cmt__author {
    .pr;

    .u-boxcoin {
        .pa;
        right: 10px;
        top: 0;
        .fz(14px);
        .flex;
        align-items: center;
        gap: 5px;
        .pointer;
    }

    .u-boxcoin-img {
        .size(14px);
    }

    .u-boxcoin-num {
        color: #f0b400;
        .bold;
    }
}
</style>
