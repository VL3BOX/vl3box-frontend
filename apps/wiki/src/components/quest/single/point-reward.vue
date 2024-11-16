<!--
 * @Author: X3ZvaWQ
 * @Date: 2022-07-11 00:14:36
 * @LastEditors: X3ZvaWQ
 * @LastEditTime: 2022-07-12 14:52:23
 * @Description: 数值奖励的Biểu tượng组件，如Thành tích、侠义值等
-->
<template>
    <a
        class="u-point-reward"
        draggable="false"
        :class="{ 'u-point-reward__achievement': id }"
        :href="toUrl"
        :target="id ? '_blank' : '_self'"
    >
        <div class="u-reward-icon">
            <img class="u-icon-bg" :src="backgroundUrl" alt="Nền biểu tượng" />
            <img v-if="icon == null" class="u-icon-img" :src="pointImgUrl" alt="Biểu tượng" />
        </div>
        <div class="u-reward-desc">{{ displayName }}<br />{{ value }}</div>
    </a>
</template>

<script>
import { getLink, iconLink } from "@jx3box/jx3box-common/js/utils";
export default {
    props: {
        type: {
            type: String,
        },
        value: {
            type: String,
        },
        icon: {
            type: Number,
            default: null,
        },
        id: {
            type: Number,
            default: null,
        },
    },
    data() {
        return {
            images: {
                17: require("@/assets/img/quest/fblist-17.png"),
                18: require("@/assets/img/quest/fblist-18.png"),
                29: require("@/assets/img/quest/fblist-29.png"),
                30: require("@/assets/img/quest/fblist-30.png"),
                33: require("@/assets/img/quest/fblist-33.png"),
                34: require("@/assets/img/quest/fblist-34.png"),
                36: require("@/assets/img/quest/fblist-36.png"),
                37: require("@/assets/img/quest/fblist-37.png"),
                80: require("@/assets/img/quest/fblist-80.png"),
            },
        };
    },
    methods: {
        iconLink,
    },
    computed: {
        displayName: function () {
            let map = {
                titlePoint: "Điểm chiến giai",
                prestige: "Điểm danh vọng",
                vigor: "Tinh lực",
                justice: "Điểm hiệp hành",
                train: "Tu luyện",
                tongFund: "Bang hội kim",
                tongResource: "Tài nguyên phương tiện",
                achievement: "Thành tích",
                skill: "Kỹ năng",
            };
            if (map[this.type]) return map[this.type];
            else return "Phần thưởng không xác định";
        },
        backgroundUrl: function () {
            if (this.icon) {
                return iconLink(this.icon);
            } else {
                return this.images[18];
            }
        },
        pointImgUrl: function () {
            let map = {
                titlePoint: 37,
                prestige: 33,
                vigor: 80,
                justice: 34,
                train: 17,
                tongFund: 30,
                tongResource: 36,
            };
            if (map[this.type]) return this.images[map[this.type]];
            else return iconLink(0);
        },
        toUrl: function () {
            if (this.type == "achievement" && this.id) {
                return getLink("achievement", this.id);
            }
            return "#";
        },
        client() {
            return this.$store.state.client;
        },
    },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/quest/single/point-reward.less";
</style>
