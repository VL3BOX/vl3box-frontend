<template>
    <div class="u-reply">
        <div class="u-reply-content">
            <span class="u-reply-label" v-if="replyForUserId != 0">
                Trả lời
                <el-link type="primary" target="_blank" :href="userHref"
                    >@{{ replyForUsername }}</el-link
                >
                :
            </span>
            <div class="u-reply-text" v-html="renderContent"></div>
             <!--<div class="u-reply-text" v-html="content"></div>-->
            <!-- <p v-for="(p, index) in getPList(content)" :key="index" v-html="formatContent(p)"></p> -->
        </div>
        <div class="u-attachements" v-if="attachments.length">
            <el-image
                v-for="url in attachments"
                :key="url"
                :src="showAttachment(url)"
                :preview-src-list="[showPreview(url)]"
                lazy
            ></el-image>
        </div>
        <div class="u-toolbar">
            <el-button
                class="u-admin"
                v-if="!currentUserHadLike"
                link
                size="small"
                @click="doLike(true)"
                ><img
                    class="u-up"
                    src="../../assets/img/heart_1.svg"
                    alt=""
                />Thích<span class="u-like-count">{{
                    likesFormat(hasLikeCount)
                }}</span></el-button
            >
            <el-button
                class="u-admin"
                link
                size="small"
                v-if="currentUserHadLike"
                @click="doLike(false)"
                ><img
                    class="u-up"
                    src="../../assets/img/heart_2.svg"
                    alt=""
                />Đã thích<span class="u-like-count">{{
                    likesFormat(hasLikeCount)
                }}</span></el-button
            >
            <el-button
                class="u-admin"
                v-if="canReply"
                link
                icon="ChatLineRound"
                size="small"
                @click="showReplyForReplyInput"
                type="primary"
                >Trả lời</el-button
            >
            <el-button
                class="u-admin"
                v-if="canDelete"
                link
                icon="Delete"
                size="small"
                type="danger"
                @click="deleteComment"
                >Xóa</el-button
            >
            <el-button
                class="u-admin"
                link
                size="small"
                icon="Delete"
                v-if="canHide"
                @click="hideComment"
                title="Sau khi đưa vào hố đen, chỉ có người bình luận mới nhìn thấy"
            >
                Hố đen</el-button
            >
            <time class="u-date">
                <i class="Clock"></i>
                {{ dataFormat(date) }}
            </time>
        </div>
    </div>
</template>

<script>
import { resolveImagePath, authorLink } from "@jx3box/jx3box-common/js/utils";
import { formatContent } from "../../utils/emotion";
function fillZero(num) {
    return num > 9 ? num : `0${num}`;
}
export default {
    props: [
    "commentId",
        "content",
        "attachments",
        "date",
        "hasReply",
        "canDelete",
        "canHide",
        "canReply",
        "isLike", // 是否已Thích
        "likes", // Thích数
        "userHref",
        "replyForUsername",
        "replyForUserId",
    ],
    data: function () {
        return {
            showInput: false,
            currentUserHadLike: this.isLike,
            hasLikeCount: this.likes,

            renderContent: "",
        };
    },
    computed: {
        _attachments: function () {
            return this.attachments.map((val) => {
                return resolveImagePath(val);
            });
        },
    },
    watch: {
        content: {
            handler: function (val) {
                this.formatContent(val);
            },
            immediate: true,
        },
    },
    methods: {
        profileLink: function (uid) {
            return authorLink(uid);
        },
        showAttachment: function (val) {
            return resolveImagePath(val) + "?x-oss-process=style/comment_thumb";
        },
        async formatContent(str) {
            this.renderContent = await formatContent(str);
        },
        getPList(content) {
            return content.split("\n");
        },
        doLike(setLike) {
            if (setLike === this.currentUserHadLike) {
                return;
            }
            this.currentUserHadLike = setLike;
            this.hasLikeCount = setLike
                ? this.hasLikeCount + 1
                : this.hasLikeCount - 1;
            this.$emit("setLikeComment", setLike);
        },
        deleteComment() {
            this.$confirm("Đồng ýXóa该评论吗？", "Nhắc nhở", {
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Hủy",
                type: "warning",
            })
                .then(() => {
                    this.$emit("delete", this.commentId);
                })
                .catch(() => {});
        },
        hideComment() {
            this.$confirm("Bạn có chắc chắn muốn ẩn bình luận này không?", "Nhắc nhở", {
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Hủy",
                type: "warning",
            })
                .then(() => {
                    this.$emit("hide", this.commentId);
                })
                .catch(() => {});
        },
        likesFormat(count) {
            return count > 0 ? count : "";
        },
        dataFormat(str) {
            let d = new Date(str);
            return (
                d.getFullYear() +
                "-" +
                fillZero(d.getMonth() + 1) +
                "-" +
                fillZero(d.getDate()) +
                " " +
                fillZero(d.getHours()) +
                ":" +
                fillZero(d.getMinutes()) +
                ":" +
                fillZero(d.getSeconds())
            );
        },
        showReplyForReplyInput() {
            this.$emit("showReplyInput");
        },
        previewImg(i) {
            this.$hevueImgPreview({
                multiple: true,
                nowImgIndex: i,
                imgList: this._attachments,
                controlBar: false,
                clickMaskCLose: true,
            });
        },
        showPreview: function (val) {
            return resolveImagePath(val);
        },
    },
};
</script>

<style lang="less">
.u-reply-content {
    div,
    p {
        padding: 0;
        margin: 0;
        line-height: 1.75;
        font-size: 14px;
        img {
            vertical-align: -3px;
        }
    }
}
.u-reply-text {
    white-space: pre-line;
}
.u-attachements {
    margin-top: 10px;
}
</style>
