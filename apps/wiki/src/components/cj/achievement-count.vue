<template>
    <div class="m-achievement-count">
        <div class="u-stat">
            <span v-for="(text, key) in countDict" :key="key">
                <em>{{ text }}</em>
                <b>{{ count[key] }}</b>
            </span>
        </div>
    </div>
</template>
<script>
import { getAchievementsTotal } from "@/service/achievement";

export default {
    name: "AchievementCount",
    data() {
        return {
            generalNum: 137, // 和游戏差异，固定加上
            count: {},
            countDict: {
                general: "Thành tựu thường",
                general_point: "Điểm thành tựu thường",
                armor: "Thành tựu Ngũ giáp",
                armor_point: "Điểm thành tựu Ngũ giáp",
                // post_count: "收录攻略数",
            },
        };
    },
    created() {
        // 获取成就统计信息
        getAchievementsTotal().then((data) => {
            data = data.data;
            this.count = data.data.count;
            this.count.general = ~~this.count?.general + this.generalNum;
            this.$store.commit("SET_STATE", { key: "generalTotal", value: ~~this.count["general"] });
            this.$store.commit("SET_STATE", { key: "armorTotal", value: ~~this.count["armor"] });
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/achievement-count.less";
</style>
