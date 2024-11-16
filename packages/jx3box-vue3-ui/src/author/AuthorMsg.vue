<template>
    <div class="c-author-msg">
        <img src="../../assets/img/author/msg.svg" svg-inline title="Tin nhắn ngắn" />
    </div>
</template>

<script>
export default {
    name: "AuthorMsg",
    props: ["uid"],
    components: {},
    data: function () {
        return {};
    },
    computed: {},
    watch: {},
    methods: {},
    created: function () {},
    mounted: function () {
        // 需要判断是否接受私信
    },
};
</script>

<style scoped lang="less"></style>
