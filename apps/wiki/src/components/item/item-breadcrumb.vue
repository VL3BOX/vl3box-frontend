<template>
    <div class="m-breadcrumb">
        <div class="u-stat">
            <span v-for="(value, key) in countDict" :key="key">
                <em>{{ value }}</em>
                <b>{{ count[key] }}</b>
            </span>
        </div>
    </div>
</template>
<script>
import { get_items_count } from "@/service/item.js";

export default {
    name: "ItemBreadcrumb",
    props: [],
    data: function () {
        return {
            count: {},
            countDict: {
                total: "Tổng số vật phẩm",
                quality_0: "Số lượng tàn phẩm",
                quality_1: "Số lượng thường phẩm",
                quality_2: "Số lượng tinh phẩm",
                quality_3: "Số lượng tuyệt phẩm",
                quality_4: "Số lượng trân kỳ phẩm",
                quality_5: "Số lượng thần phẩm"
            },
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        }
    },
    methods: {},
    mounted: function () {
        // 输出Tổng số vật phẩm统计
        get_items_count({client: this.client}).then((res) => {
            res = res.data;
            this.count = res.data;
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/bread.less";
</style>
