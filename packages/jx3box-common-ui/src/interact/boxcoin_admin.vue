<template>
    <div class="w-boxcoin-admin" v-if="allowBoxcoin">
        <el-tooltip effect="dark" content="Đánh giá phẩm" placement="top-start">
            <div class="w-boxcoin-block">
                <img
                    @click="openBoxcoinPop"
                    class="u-icon"
                    svg-inline
                    :src="iconPath"
                />
            </div>
        </el-tooltip>
        <el-dialog title="Đánh giá phẩm评分" :visible.sync="visible" custom-class="w-boxcoin-pop" :close-on-click-modal="false" append-to-body>
            <div class="w-boxcoin-admin-content">
                <div class="u-left">
                    <em class="u-label">Tình trạng tháng này</em>
                    Đã sử dụng<b>{{this.used}}</b> Còn lại<b>{{this.left}}</b> Tổng cộng<b>{{this.total}}</b>
                    <el-progress :percentage="this.total ? 100 - (this.used * 100 / this.total) : 0" :stroke-width="15" :text-inside="true"></el-progress>
                </div>
                <div class="u-list">
                    <em class="u-label">❤️ Đánh giá phẩm</em>
                    <Contributors v-if="authors && authors.length" :authors="authors" @chosen="handleChosen" />
                    <div class="u-points">
                        <el-radio-group v-model="count">
                            <el-radio :label="item" v-for="item in fitPoints" :key="item" border>
                                <b>{{item}}</b>Hộp tiền
                            </el-radio>
                            <el-radio label="custom" border>Tùy chỉnh</el-radio>
                            <el-input v-model="amount" v-show="count === 'custom'" placeholder="输入Tùy chỉnh数量"></el-input>
                        </el-radio-group>
                    </div>
                </div>
                <div class="u-msg">
                    <em class="u-label">📝 Lời nhắn</em>
                    <div class="u-input">
                        <el-input
                            v-model="remark"
                            placeholder="请输入Lời nhắn（必填）"
                            :minlength="2"
                            :maxlength="30"
                            show-word-limit
                        ></el-input>
                        <el-button :disabled="fetchingCurrentRelease" @click="insertCurrentRelease">Chèn phiên bản hiện tại</el-button>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">Lấy 消</el-button>
                <el-button type="primary" @click="submit" :disabled="!ready || submitting">Xác nhận 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { grantBoxcoin } from "../../service/thx.js";
import User from "@jx3box/jx3box-common/js/user";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc";
import Contributors from './Contributors.vue';
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "BoxcoinAdmin",
    props: ["postType", "postId", "userId", "own", "total", "points", "max", "min", 'authors','client',"category"],
    components: {
        Contributors
    },
    data: function () {
        return {
            visible: false,
            count: 0,

            remark: "Cảm ơn sự chăm chỉ của bạn!",
            left : this.own,
            chosen: '', // 被选中的人
            amount: "",

            submitting: false,
            fetchingCurrentRelease: false,
        };
    },
    computed: {
        used: function () {
            return this.total - this.left;
        },
        ready: function () {
            const count = this.count === "custom" ? this.amount : this.count;
            // 不能给自己打赏，打赏目标不能是自己
            // 打赏数量不能超过Còn lại数量
            // 打赏数量不能为0
            // 打赏Lời nhắn不能为空
            return !!(
                !this.isSelf &&
                !this.targetIsSelf &&
                this.isEnough &&
                count &&
                this.remark
            );
        },
        isNotSelf: function () {
            return this.userId != User.getInfo().uid;
        },
        targetIsSelf: function () {
            return this.chosen == User.getInfo().uid;
        },
        isEnough: function () {
            const count = this.count === "custom" ? this.amount : this.count;
            return this.left && this.left >= count;
        },
        allowBoxcoin : function (){
            return this.postType && this.postId && (this.userId || (this.authors && this.authors.length))
        },
        hostClient : function (){
            return location.href.includes('origin') ? 'origin' : 'std'
        },
        fitPoints : function (){
            const points = this.points.filter(item => item <= this.left)
            if (this.isSignAuthor) {
                // 最大值为1000
                return points.filter(item => item <= 1000)
            }
            return points
        },
        isSignAuthor : function (){
            return User.getInfo().group == 32;
        },
        iconPath() {
            return __cdn + "design/vector/icon/taste.svg"
        },
    },
    watch: {
        own : function (val){
            this.left = val
        }
    },
    methods: {
        openBoxcoinPop: function () {
            this.visible = true;
        },
        // 选择要打赏的对象
        handleChosen(userId) {
            this.chosen = userId
        },
        submit: function () {
            this.submitting = true;
            const count = this.count === "custom" ? this.amount : this.count;
            let client = this.client || this.hostClient;
            if (!['std', 'origin', 'all'].includes(client)) {
                client = 'std'
            }
            grantBoxcoin(this.postType, this.postId, this.chosen || this.userId, count, {
                remark: this.remark,
                client : client,
                // 如果有category，传入category
                redirect: this.category ? `/${this.category}/${this.postId}` : undefined
            })
                .then((res) => {
                    this.$message({
                        message: "Hoạt động thành công",
                        type: "success",
                    });
                    return res.data.data
                })
                .then((data) => {
                    // 1.扣除额度
                    this.left -= this.count;
                    // 2.将修改emit出去
                    this.$emit('updateRecord', data);
                })
                .finally(() => {
                    this.submitting = false;
                    this.visible = false;
                });
        },
        insertCurrentRelease: function() {
            this.fetchingCurrentRelease = true;
            getBreadcrumb(`current-release-${this.hostClient}`).then(res => {
                this.remark += res;
            }).catch(err => {
                this.$message({
                    message: "获Lấy失败",
                    type: "error",
                });
            }).finally(() => {
                this.fetchingCurrentRelease = false;
            });
        },
        init: function () {},
    },
    created: function () {},
    mounted: function () {},
};
</script>
