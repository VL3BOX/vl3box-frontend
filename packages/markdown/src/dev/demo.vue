<template>
    <div>
        <div class="navigate">
            <span @click="viewIndex = 1">Markdown渲染</span>
            <span @click="viewIndex = 2">Markdown编辑器</span>
        </div>
        <div>
            <App v-if="viewIndex == 1"></App>
            <Editor v-if="viewIndex == 2" ></Editor>
        </div>
    </div>
</template>

<script>
import app from "./app.vue";
import editor from "./editor.vue";

export default {
    name: "demo",
    components: {
        App: app,
        Editor: editor,
    },
    data() {
        return {
            viewIndex: 2,
        };
    },
};
</script>
<style>
.navigate {
    text-align: center;
    font-size: 18px;
    color: blue;
}

.navigate span {
    margin-right: 5px;
}

.navigate span:hover {
    cursor: pointer;
    font-weight: bolder;
}
</style>
