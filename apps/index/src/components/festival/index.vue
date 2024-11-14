<template>
    <div class="m-index-popup" v-if="success" v-show="visible" @click="close">
        <!-- 贺卡 -->
        <midAutumn :fontCount="count" @checked="checked" @close="close" />
    </div>
</template>

<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { getBoxCoin } from "@/service/index";
import User from "@jx3box/jx3box-common/js/user";
import midAutumn from "@/components/festival/midAutumn.vue";
export default {
    name: "Festival",
    data: function () {
        return {
            success: false,
            visible: true,
            count: 0,
            data: {},
            done: sessionStorage.getItem("festival_id"),
            check: false,
        };
    },
    components: { midAutumn },
    computed: {
        imgLink() {
            return __imgPath + `topic/festival/`;
        },
        fontCount() {
            // if (this.count == 0) return "零";
            return this.toChineseBig(this.count);
        },
        username() {
            return User.getInfo().name || "匿名";
        },
        event_id() {
            return ~~this.$store.state.config.festival_id;
        },
        event_status() {
            return !!~~this.$store.state.config.festival_enable;
        },
        event_test() {
            return !!~~this.$store.state.config.festival_test;
        },
    },
    methods: {
        closePop() {
            this.visible = false;
        },
        checked() {
            this.check = true;
        },
        close() {
            this.visible = false;
        },
        init() {
            if ((this.event_status && this.event_id) || (this.event_test && User.isSuperAdmin())) {
                console.log("尝试触发贺卡事件");
                if (!this.done) {
                    getBoxCoin(this.event_id)
                        .then((res) => {
                            console.log("成功触发贺卡事件");
                            this.data = res.data?.data;
                            this.count = res.data?.data?.boxcoin || res.data?.data?.points || 0;
                            this.success = true;
                            sessionStorage.setItem("festival_id", this.event_id);
                        })
                        .catch((err) => {
                            console.log("贺卡触发失败", err);
                        });
                }
            }
        },
        toChineseBig(num) {
            var strNum = String(num);
            var unit = ["拾", "佰", "仟", "万", "拾", "佰", "仟", "亿", "拾", "佰", "仟"];
            // var unit = ["十", "百", "千", "万", "十", "百", "千", "亿", "十", "百", "千"];
            // 结果中放一个符号，用来解决最后的零去不掉的问题
            var result = ["@"];
            // 单位下标
            var unitNo = 0;
            // 从后往前遍历接收到的数据，省略结束条件
            for (let i = strNum.length - 1; ; i--) {
                // 调用转大写函数，将每一个数字转换成中文大写，一次放入一个到结果数组中
                result.unshift(this.numToChinese(strNum[i]));
                // 如果不大于0
                if (i <= 0) {
                    // 结束循环
                    break;
                }
                // 放入一个数字，放入一个单位
                result.unshift(unit[unitNo]);
                // 单位下标加1
                unitNo++;
            }
            // 将结果数组转换成字符串，并使用正则替换一些关键位置，让结果符合语法
            return result
                .join("")
                .replace(/(零[仟佰拾]){1,3}/g, "零")
                .replace(/零{2,}/g, "零")
                .replace(/零([万亿])/g, "$1")
                .replace(/亿万/g, "亿")
                .replace(/零*@/g, "");
        },
        numToChinese(n) {
            let chineseBigNum = "零壹贰叁肆伍陆柒捌玖";
            // var chineseBigNum = "零一二三四五六七八九";
            return chineseBigNum[n];
        },
    },
    watch: {
        "$store.state.config": {
            handler(val, oldVal) {
                this.init();
            },
            deep: true,
        },
    },

    mounted() {
        if (User.isLogin()) {
            this.init();
        }
    },
};
</script>

<style lang="less">
@import "../../assets/css/index/popup.less";
</style>
