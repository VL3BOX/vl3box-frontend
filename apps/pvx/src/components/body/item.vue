<template>
    <a
        :class="['m-body-item m-face-item', { onlyPic, noName }]"
        :href="`${link}/${item.id}`"
        target="_blank"
        v-reporter="{
            data: {
                href: '/body/' + item.id,
                ...reporter,
            },
            caller: 'body_index',
        }"
    >
        <div class="m-img">
            <el-image class="u-pic" :src="showThumb(imgLink)" fit="cover">
                <div slot="error" class="image-slot">
                    <img src="../../assets/img/body_null.png" />
                </div>
            </el-image>
            <div class="m-mark-left">
                <i class="u-mark u-mark--star" v-if="!!item.star">Đề cử</i>
                <i class="u-mark u-mark--new" v-if="!!item.is_unlimited">Khả dụng</i>
            </div>
            <i class="u-mark u-mark--pay" v-if="!!~~item.price_type && !!item.price_count">Trả phí</i>
        </div>

        <div class="m-op">
            <div class="u-title">{{ item.title }}</div>
            <div class="m-author" @click.stop="onAuthorClick">
                <img class="u-avatar" :src="showAvatar(item.user_avatar)" :alt="author" />
                <span class="u-name"> {{ item.author_name || "Ẩn danh" }} </span>
            </div>
        </div>
    </a>
</template>

<script>
import { showAvatar, getThumbnail } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "item",
    props: ["item", "reporter", "onlyPic", "noName"],
    data: function () {
        return {
            markmap: {
                newbie: "Phổ biến",
                advanced: "Đề xuất",
                recommended: "Chọn lọc",
            },
        };
    },
    computed: {
        author: function () {
            return this.item.display_name || "Ẩn danh";
        },
        imgLink: function () {
            return this.item.images?.[0];
        },
        link() {
            return location.origin + "/body";
        },
    },
    methods: {
        showThumb: function (url) {
            return getThumbnail(url, 360);
        },
        showAvatar,
        onAuthorClick() {
            if (!this.item.original) {
                window.open(this.item.author_link, "_blank");
            }
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/face/item.less";
</style>
