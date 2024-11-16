<template>
    <ul class="u-comments">
        <li
            class="u-comment-panel"
            v-for="(comment, key) in comments"
            :key="key"
        >
            <div class="u-comment">
                <!-- 评论内容 -->
                <div class="u-nickname-panel">
                    <a
                        class="u-nickname"
                        :href="
                            comment.user_id ? author_url(comment.user_id) : null
                        "
                        target="_blank"
                        v-text="comment.user_nickname"
                    ></a>
                    <template v-if="comment.parent_id">
                        <span>&nbsp;Trả lời&nbsp;</span>
                        <a
                            class="u-nickname"
                            :href="
                                comment.parent.user_id
                                    ? author_url(comment.parent.user_id)
                                    : null
                            "
                            target="_blank"
                            v-text="comment.parent.user_nickname"
                        ></a>
                    </template>
                </div>
                <p class="u-content" v-html="comment.content"></p>
                <!-- 其他 -->
                <div class="m-reply">
                    <!-- 展开、Thu gọn -->
                    <el-button
                        type="default"
                        v-if="comment.reply_form && comment.reply_form.show"
                        class="u-reply"
                        @click="
                            comment.reply_form.show = !comment.reply_form.show
                        "
                    >
                        <i class="el-icon-arrow-up"></i>
                        <span>Thu gọn</span>
                    </el-button>
                    <el-button
                        type="primary"
                        plain
                        v-else
                        class="u-reply"
                        @click="
                            comment.reply_form.show = !comment.reply_form.show
                        "
                    >
                        <i class="el-icon-chat-dot-round"></i>
                        <span>Trả lời</span>
                    </el-button>
                    <!-- 更新时间 -->
                    <span
                        class="u-time"
                        v-text="ts2str(comment.updated)"
                    ></span>
                </div>
                <!-- 评论Trả lời表单 -->
                <div class="m-reply-form" v-if="comment.reply_form && comment.reply_form.show">
                    <textarea
                        class="u-reply-content"
                        v-model="comment.reply_form.content"
                    ></textarea>
                    <div class="u-author">
                        <span>Biệt danh:</span>
                        <input
                            v-model="comment.reply_form.user_nickname"
                            type="text"
                        />
                    </div>
                    <el-button
                        type="primary"
                        class="u-submit"
                        @click="create_comment(comment.reply_form, comment.id)"
                    >
                        <i class="el-icon-check"></i>
                        <span>Gửi</span>
                    </el-button>
                </div>
            </div>
            <WikiComment
                v-if="comment.children.length"
                :comments="comment.children"
                :source-id="sourceId"
            />
        </li>
    </ul>
</template>

<script>
import { authorLink, ts2str } from "@jx3box/jx3box-common/js/utils";

export default {
    name: "WikiComment",
    props: ["comments", "sourceId"],
    methods: {
        author_url: authorLink,
        ts2str,
        create_comment(form, parent_id) {
            let app = this.$parent;
            if (!app.create_comment) app = app.$parent;
            if (!app.create_comment) {
                this.$message({
                    message: "Có lỗi khi đăng bình luận, vui lòng liên hệ quản trị viên",
                    type: "warning",
                });
                return;
            }
            app.create_comment(form, parent_id);
        },
    },
};
</script>
