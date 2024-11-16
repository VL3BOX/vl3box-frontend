<!--
 * @Author: iRuxu
 * @Date: 2022-05-02 10:53:27
 * @LastEditTime: 2022-07-21 22:41:27
 * @Description:
-->
<template>
    <div class="m-author-body">
        <el-tabs class="m-tabs" v-model="active">
            <el-tab-pane v-for="item in types" :key="item.value" :label="item.label" :name="item.value" :lazy="true">
                <span slot="label">
                    <i class="u-icon" :class="item.icon"></i>
                    {{ item.label }}
                </span>
                <div class="m-primary">
                    <component :is="currentComponent" v-if="item.value === active" />
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import Post from "@/components/Post.vue";
import Wiki from "@/components/Wiki.vue";
import Question from "@/components/Question.vue";
import Paper from "@/components/Paper.vue";
import Collection from "@/components/Collection.vue";
import Namespace from "@/components/Namespace.vue";
import Jokes from "@/components/Jokes.vue";
import Emotions from "@/components/Emotions.vue";
// import Plan from "@/components/item_plan.vue";
import Pz from "@/components/Pz.vue";
export default {
    name: "Primary",
    props: [],
    data: function() {
        return {
            active: "Post",
            types: [
                {
                    label: "Tác phẩm mới nhất",
                    value: "Post",
                    component: Post,
                    icon: "el-icon-collection",
                },
                {
                    label: "Đóng góp bách khoa",
                    value: "Wiki",
                    component: Wiki,
                    icon: "el-icon-reading",
                },
                {
                    label: "Phương án phối trang",
                    value: "Pz",
                    component: Pz,
                    icon: "el-icon-shopping-bag-1",
                },
                {
                    label: "Bộ sưu tập",
                    value: "Collection",
                    component: Collection,
                    icon: "el-icon-notebook-1",
                },

                { label: "Đề tài Kiếm Tam", value: "Question", component: Question, icon: "el-icon-document-checked" },
                { label: "Đề thi Kiếm Tam", value: "Paper", component: Paper, icon: "el-icon-document-checked" },
                {
                    label: "Bảng hiệu của TA",
                    value: "Namespace",
                    component: Namespace,
                    icon: "el-icon-postcard",
                },
                {
                    label: "Thú đồ của TA",
                    value: "Emotions",
                    component: Emotions,
                    icon: "el-icon-sugar",
                },
                {
                    label: "Chuyện phiếm của TA",
                    value: "Jokes",
                    component: Jokes,
                    icon: "el-icon-cold-drink",

                }
            ],
        };
    },
    computed: {
        currentComponent: function() {
            return this.types.find((item) => item.value === this.active).component;
        },
    },
    components: {
        Post,
        Wiki,
        Question,
        Paper,
        Collection,
        Namespace,
        // Plan,
        Pz,
        Jokes,
        Emotions,
    },
};
</script>

<style lang="less" scoped>
.u-icon {
    .fz(16px);
}
</style>
