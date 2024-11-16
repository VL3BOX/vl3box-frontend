<template>
    <div class="m-item-price-tabs">
        <div class="m-price-server">
            <i class="el-icon-s-shop"></i> Giá toàn server
            <el-select class="u-server" v-model="server" placeholder="Vui lòng chọn server" size="mini">
                <!-- <el-option key label="Top 5 server giá thấp nhất" value v-if="!isOrigin"></el-option> -->
                <el-option v-for="serve in servers" :key="serve" :label="serve" :value="serve"></el-option>
            </el-select>
        </div>

        <el-tabs v-model="activeTab" type="border-card" @tab-click="active_tab_handle">
            <el-tab-pane label="📈 Biến động giá" name="item-price-chart">
                <item-price-chart ref="item_price_chart" :item_id="sourceId" :server="server" />
            </el-tab-pane>
            <el-tab-pane label="💰 Giá gần đây" name="item-prices">
                <item-prices :item_id="sourceId" :server="server" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import ItemPrices from "@/components/item/prices.vue";
import ItemPriceChart from "@/components/item/price-chart.vue";
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
export default {
    name: "PriceTabs",
    props: ["sourceId"],
    inject: ["client"],
    data() {
        return {
            server: "",
            activeTab: "item-price-chart",
        };
    },
    computed: {
        isOrigin: function () {
            return this.client == "origin";
        },
        servers: function () {
            return this.isOrigin ? servers_origin : servers_std;
        },
    },
    methods: {
        active_tab_handle(tab) {
            if (tab.name === "item-price-chart") {
                this.$nextTick(() => {
                    this.$refs.item_price_chart?.render();
                });
            }
        },
    },
    mounted: function () {
        let params = new URLSearchParams(location.search);
        let server = params.get("server");
        this.server = server || (this.isOrigin ? "缘起稻香" : "梦江南");
    },
    components: {
        "item-prices": ItemPrices,
        "item-price-chart": ItemPriceChart,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/price-tabs.less";
</style>
