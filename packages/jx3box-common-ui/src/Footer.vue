<template>
    <footer class="c-footer" id="c-footer" v-if="!isApp" :class="{ 'is--dark': darkMode }">
        <div class="c-footer-inner">
            <div class="c-footer-left">
                <img class="u-flag" svg-inline src="../assets/img/footer/china.svg" />
                <a href="https://beian.miit.gov.cn/" class="u-beian" target="_blank">湘ICP备2021002288号</a>
            </div>
            <div class="c-footer-right">
                <a class="u-about" :href="about" target="_blank">Về chúng tôi</a>
                <em>|</em>
                <a class="u-doc" href="/tool?subtype=4" target="_blank">Tài liệu trợ giúp</a>
                <em>|</em>
                <a class="u-log" href="https://github.com/JX3BOX" target="_blank">Mã nguồn</a>
                <em>|</em>
                <a class="u-feedback" href="/feedback" target="_blank">Góp ý và phản hồi</a>
            </div>
            <slot></slot>
        </div>
    </footer>
</template>

<script>
import { __Root, feedback } from "@jx3box/jx3box-common/data/jx3box.json";
import { isApp } from "../assets/js/app.js";
export default {
    name: "Footer",
    props: {
        darkMode: {
            type: Boolean,
            default: false,
        },
    },
    data: function () {
        return {
            about: __Root + "about",
            feedback: feedback + "&subject=" + location.href,
            isApp: isApp(),
        };
    },
};
</script>

<style lang="less">
@import "../assets/css/footer.less";
</style>
