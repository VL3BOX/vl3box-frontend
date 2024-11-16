<template>
    <div class="jinmai yutang" style>
        <h3>Nhâm mạch</h3>
        <div v-for="(item, index) in jingmai" :key="index" :class="'ap ap' + item.id">
            <em :class="'level' + item.nowLevel"></em>
            <a
                href="javascript:void(0)"
                ref="detail"
                @mouseover="showDetail(item, index)"
                @mouseout="outDetail"
                @click="action(item)"
                @contextmenu.prevent="reduce(item)"
                :class="item.id === hover ? 'jm_mouse' : item.nowLevel === item.maxLevel ? 'jm_full' : item.requireSuccess ? 'jm_opened' :  ''"
            ></a>
            <div v-if="item.nowLevel >= item.lnLevel" :class="'ln ln' + item.id"></div>
        </div>
    </div>
</template>

<script>

export default {
    name: "yutang",
    data() {
        return {
            jingmai: [
                { name: "Nhâm mạch·玉堂", id: 77, lnLevel: 1 },
                { name: "Nhâm mạch·紫宫", id: 78, lnLevel: 1 },
                { name: "Nhâm mạch·华盖", id: 79, lnLevel: 1 },
                { name: "Nhâm mạch·璇玑", id: 80, lnLevel: 1 },
                { name: "Nhâm mạch·龈交", id: 81, lnLevel: 1 },
                { name: "Nhâm mạch·天突", id: 82, lnLevel: 1 },
                { name: "Nhâm mạch·廉泉", id: 83, lnLevel: 1 },
                { name: "Nhâm mạch·兑端", id: 84, lnLevel: 1 },
                { name: "Nhâm mạch·承浆", id: 85, lnLevel: 0 },
                { name: "Nhâm mạch·水沟", id: 86, lnLevel: 2 },
                { name: "Nhâm mạch·素髎", id: 87, lnLevel: 2 },
                { name: "Nhâm mạch·神庭", id: 88, lnLevel: 2 },
                { name: "Nhâm mạch·上星", id: 89, lnLevel: 2 },
                { name: "Nhâm mạch·前顶", id: 90, lnLevel: 0 },
            ],
            mouseData: {},
            hover: "",
        };
    },
    computed: {},
    created() {
        this.init();
    },
    methods: {
        init() {
            let define = this.$store.state.defineMeridians;
            let select = this.$store.state.selectMeridians;
            let jingmai = JSON.parse(JSON.stringify(this.jingmai));
            jingmai = jingmai.map((item) => {
                let defItem = define.find(def => def.name === item.name)
                let selItem = select.find(sel => sel.name === item.name)
                if (selItem) {
                    return item = Object.assign(item, selItem);
                } else {
                    item = Object.assign(item, defItem);
                    item.nowLevel = 0
                    return item
                }
            });
            this.jingmai = jingmai;
        },
        showDetail(item, index) {
            if (item.requireSuccess && item.nowLevel < item.maxLevel) {
                this.hover = item.id;
            }
            let style = window.getComputedStyle(this.$refs.detail[index], null);
            let data = {};
            data.left = parseInt(style.left) + 430;
            data.top = parseInt(style.top) + 60;
            data = Object.assign(data, item);
            this.mouseData = data;
            this.$emit("showDetail", data);
        },
        outDetail() {
            this.hover = "";
            this.$emit("outDetail", {});
        },
        action(item) {
            this.$emit("action", this.mouseData);
        },
        setHover() {
            this.hover = "";
        },
        reduce(item) {
            this.$emit("reduce", item);
        },
    },
};
</script>

<style lang='less'>
//@import "../../../assets/css/meridians.less";
</style>
