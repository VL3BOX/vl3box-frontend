<template>
    <div id="app">
        <Header></Header>
        <div class="p-topic-container">
            <Index />
        </div>
        <Footer class="p-topic-footer"></Footer>
    </div>
</template>

<script>
import Index from "@/components/index/Index.vue";
export default {
    name: "App",
    components: { Index },
};
</script>

<style lang="less">
@import "~@/assets/css/index/index.less";
</style>
