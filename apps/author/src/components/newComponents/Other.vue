<template>
    <div class="m-exam">
        <el-tabs class="m-tabs" v-model="active" type="card">
            <el-tab-pane v-for="item in types" :key="item.value" :label="item.label" :name="item.value" :lazy="true">
                <span slot="label">
                    <i :class="item.icon"></i>
                    {{ item.label }}
                </span>
            </el-tab-pane>
        </el-tabs>
        <div class="m-primary">
            <component :is="currentComponent" v-if="activeType === active" />
        </div>
    </div>
</template>

<script>
import Collection from "@/components/Collection";
// import Question from "@/components/Question.vue";
// import Paper from "@/components/Paper.vue";
import Namespace from "../Namespace.vue";
import Emotions from "@/components/Emotions";
import Jokes from "@/components/Jokes";
import Topic from "@/components/Topic";
import Reply from "@/components/Reply";
export default {
    name: "Other",
    components: {
        Collection,
        Namespace,
        // Question,
        // Paper,
        Emotions,
        Jokes,
        Topic,
    },
    data: function () {
        return {
            active: "Topic",
            types: [
                {
                    label: "Bài viết",
                    value: "Topic",
                    component: Topic,
                    icon: "el-icon-collection",
                },
                {
                    label: "Trả lời",
                    value: "Reply",
                    component: Reply,
                    icon: "el-icon-tickets",
                },
                {
                    label: "Bộ sưu tập",
                    value: "Collection",
                    component: Collection,
                    icon: "el-icon-orange",
                },
                // {
                //     label: "Bài thi",
                //     value: "Paper",
                //     component: Paper
                // },
                // {
                //     label: "Đề mục",
                //     value: "Question",
                //     component: Question
                // },
                {
                    label: "Biển tên",
                    value: "Namespace",
                    component: Namespace,
                    icon: "el-icon-pear",
                },
                {
                    label: "Thú đồ",
                    value: "Emotions",
                    component: Emotions,
                    icon: "el-icon-cherry",
                },
                {
                    label: "Chuyện phiếm",
                    value: "Jokes",
                    component: Jokes,
                    icon: "el-icon-apple",
                },
            ],
        };
    },
    computed: {
        currentComponent: function () {
            return this.types.find((item) => item.value === this.active)?.component;
        },
        activeType: function () {
            return this.types.find((item) => item.value === this.active)?.value;
        },
    },
};
</script>
