<template>
    <div>
        <render-talent v-if="typeof version != 'number'" :talent-code="code" :webview="webview"></render-talent>
        <render-talent2 v-else :talent-code="code" :webview="webview"></render-talent2>
    </div>
</template>

<script>
import renderTalent from "./RenderTalent.vue";
import renderTalent2 from "./RenderTalent2.vue";
export default {
    name: "Talent2Plugin",
    data() {
        return {
            code: "",
            webview: false,
            version: "",
        };
    },
    methods: {
        /**
         * 对加密后的镇派编码进行解码
         * @param {string} val 加密后的编码
         * @returns {string} 解码后的数据
         */
        decodeCode: function (val) {
            return decodeURIComponent(escape(window.atob(val)));
        },
        init: function () {
            const regex = new RegExp(/code=(.*)/g);

            const code = document.location.href.match(regex);

            const _code = code && code.join("").slice(5);

            this.code = this.decodeCode(_code);

            const codeObj = JSON.parse(this.code);

            this.version = codeObj.version;

            this.webview = new URLSearchParams(document.location.search).get("webview") === "true";
        },
    },
    created: function () {
        this.init();
    },
    components: {
        renderTalent,
        renderTalent2,
    },
};
</script>
