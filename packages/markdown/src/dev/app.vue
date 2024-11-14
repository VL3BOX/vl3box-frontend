<template>
    <div>
        <render ref="md" v-model="data" :xssOptions="xss"></render>
    </div>
</template>

<script>
import render from "../render.vue";
import content from "./assets/content_4";

import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

export default {
    components: {
        render,
    },
    data() {
        return {
            data: content,
            xss: {
                whiteList: {
                    pre: ["class", "style"],
                    div: ["class", "style"],
                    video: ["controls", "width", "height", "style", "src"],
                    audio: ["controls", "src"],
                    source: ["src", "type", "style"],
                    iframe: ["src", "frameborder", "scrolling", "allowfullscreen"],
                    details: [],
                    summary: [],
                },
            },
        };
    },
    mounted : function (){
        hljs.highlightAll();
    }
};
</script>

<style></style>
