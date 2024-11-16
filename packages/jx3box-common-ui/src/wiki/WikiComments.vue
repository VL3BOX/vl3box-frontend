<template>
    <WikiPanel class="c-wiki-comments" scene="detail">
        <template slot="head-title">
            <i class="el-icon-chat-line-round"></i>
            <span>Bình luận bách khoa</span>
        </template>
        <template slot="body">
            <div class="m-comments-panel" v-loading="loading">
                <div class="u-empty" v-if="!comments || !comments.length">
                    <span v-if="comments === null">🎉 Đang tải dữ liệu...</span>
                    <span v-if="comments === false">⚠️ Lỗi tải dữ liệu</span>
                    <span v-if="comments && !comments.length">💧 Chưa có bình luận</span>
                </div>
                <!-- 递归评论组件 -->
                <Comment :comments="comments" :source-id="sourceId" />
                <el-pagination
                    class="u-pagination-box"
                    background
                    hide-on-single-page
                    :current-page="page"
                    :total="total"
                    :page-size="pageSize"
                    layout="prev, pager, next, total"
                    @current-change="handleCurrentChange"
                ></el-pagination>
                <!-- Trả lời表单 -->
                <div id="m-reply-form" class="m-reply-form">
                    <h4 class="u-title">
                        <i class="el-icon-chat-dot-round"></i>
                        <span>Trả lời</span>
                    </h4>
                    <textarea class="u-reply-content" v-model="reply_form.content"></textarea>
                    <div class="u-author">
                        <span>Biệt danh:</span>
                        <input v-model="reply_form.user_nickname" type="text" />
                    </div>
                    <el-button type="primary" class="u-submit" @click="create_comment(reply_form)">
                        <i class="el-icon-check"></i>
                        <span>Gửi</span>
                    </el-button>
                </div>
            </div>
        </template>
    </WikiPanel>
</template>

<script>
import WikiPanel from "./WikiPanel";
import Comment from "./WikiComment.vue";
import { wikiComment } from "@jx3box/jx3box-common/js/wiki_v2";
import User from "@jx3box/jx3box-common/js/user";

export default {
    name: "WikiComments",
    props: ["type", "sourceId"],
    data() {
        return {
            comments: null,
            reply_form: {
                content: "",
                user_nickname: User.getInfo().name,
            },
            page: 1,
            pageSize: 10,
            total: 0,
            loading: false,
        };
    },
    computed: {
        client: function () {
            return location.href.includes("classic") || location.href.includes("origin") ? "origin" : "std";
        },
    },
    methods: {
        get_comments() {
            if (!this.type || !this.sourceId) return;
            this.loading = true;
            wikiComment
                .list({ type: this.type, id: this.sourceId }, { client: this.client, page: this.page })
                .then((res) => {
                    res = res.data;
                    let comments = res.data.list;
                    for (let i = 0; i < comments.length; i++) {
                        comments[i]["reply_form"] = {
                            show: false,
                            content: "",
                            user_nickname: User.getInfo().name,
                        };
                    }
                    this.page = res.data.page;
                    this.total = res.data.total;
                    this.comments = filter(comments, 0);
                    // this.comments = comments;
                    this.loading = false;
                });

            function filter(comments, parent) {
                let outputs = [];
                for (let index in comments) {
                    let c = comments[index];
                    if (!c) continue;
                    if (c.parent_id === parent) {
                        // 递归
                        let children = filter(c.children, c.id);
                        c.children = children.map((item) => {
                            item.parent = {
                                user_id: c.user_id,
                                user_nickname: c.user_nickname,
                                id: c.id,
                            };
                            item.reply_form = {
                                show: false,
                                content: "",
                                user_nickname: User.getInfo().name,
                            };
                            return item;
                        });
                        outputs.push(c);
                    }
                }
                return outputs;
            }
        },
        create_comment(form, parent_id = 0) {
            // 校验评论内容
            if (!form.content) {
                this.$message({
                    message: "请先填写评论内容再尝试Gửi",
                    type: "warning",
                });
                return;
            }
            const data = {
                type: this.type,
                source_id: this.sourceId,
                parent_id: parent_id,
                user_nickname: form.user_nickname || User.getInfo().name,
                content: form.content,
                client: this.client,
            };
            wikiComment
                .post(data)
                .then((res) => {
                    res = res.data;
                    form.content = "";
                    this.$message({
                        message: "Gửi成功，请等待审核",
                        type: "success",
                    });
                })
                .finally(() => {
                    form.show = false;
                });
        },
        handleCurrentChange(page) {
            this.page = page;
            this.get_comments();
        },
    },
    components: {
        WikiPanel,
        Comment,
    },
    watch: {
        sourceId: {
            immediate: true,
            handler() {
                this.get_comments();
            },
        },
    },
};
</script>

<style lang="less">
@import "../../assets/css/wiki-comments.less";
</style>
