<template>
    <div class="markdown-container">
        <!-- markdown渲染 -->
        <div class="markdown-body">
            <div ref="vShowContent" v-html="d_render"></div>
            <!-- 预览图片 -->
            <transition name="fade">
                <div @click="d_preview_imgsrc = null" class="v-note-img-wrapper" v-if="d_preview_imgsrc">
                    <img :src="d_preview_imgsrc" alt="none" />
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { ImagePreviewListener } from "./lib/core/extra-function.js";
import markdown, { initMarkdown } from "./lib/mixins/markdown.js";
import "./lib/font/css/fontello.css";
import "./lib/css/md.css";
import "./lib/css/github-markdown.min.css";

export default {
    mixins: [markdown],
    props: {
        value: {
            // 初始 value
            type: String,
            default: "",
        },
        xssOptions: {
            // XSS 选项
            type: [Object, Boolean],
            default() {
                return {};
            },
        },
        html: {
            // Enable HTML tags in source
            type: Boolean,
            default: true,
        },
        preRender : {
            type : Function,
        }
    },
    data() {
        return {
            // 内容
            d_value: "", // props 文本内容
            d_render: "", // props 文本内容render

            // 画廊
            d_image_file: [],
            d_preview_imgsrc: null, // 图片预览地址

            // xss
            _xssHandler: null,
        };
    },
    computed: {},
    methods: {
        iRender() {
            var $vm = this;
            this.$render($vm.d_value, function (res) {
                if($vm.preRender){
                    $vm.d_render = $vm.preRender(res);
                }else{
                    $vm.d_render = res;
                }
                $vm.$emit("change", $vm.d_value, $vm.d_render);
            });
        },
    },
    watch: {
        d_value: function (val, oldVal) {
            this.iRender();
        },
        value: function (val, oldVal) {
            if (val !== this.d_value) {
                this.d_value = val;
            }
        },
    },
    created() {},
    mounted() {
        // 图片预览事件监听
        ImagePreviewListener(this);
        this.d_value = this.value || "";
    },
    getMarkdownIt() {
        let mdIt = this.mixins[0].data().markdownIt;
        if (!mdIt) {
            mdIt = initMarkdown();
        }
        return mdIt;
    },
};
</script>