<template>
    <div class="m-author-info">
        <div class="m-top">
            <div class="u-title">
                Tác phẩm của TA
            </div>
            <el-tabs class="m-tabs" v-model="active" stretch>
                <el-tab-pane v-for="item in types" :key="item.value" :label="item.label" :name="item.value" :lazy="true">
                <span slot="label">
                    {{ item.label }}
                </span>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="m-primary">
            <component :is="currentComponent" v-if="activeType === active"/>
        </div>

    </div>
</template>

<script>
import Post from "@/components/Post.vue";
import Wiki from "@/components/Wiki.vue";
import Exam from "@/components/newComponents/Exam";
import Collection from "@/components/Collection.vue";
import Namespace from "@/components/Namespace.vue";
import Jokes from "@/components/Jokes.vue";
import Emotions from "@/components/Emotions.vue";
import Data from "@/components/newComponents/Data.vue";
import Fallow from "@/components/newComponents/Fallow";
import Other from "@/components/newComponents/Other";
export default {
    name: "Left",
    components: {
        Post,
        Wiki,
        Exam,
        Collection,
        Namespace,
        Data,
        Jokes,
        Emotions,
        Fallow
    },
    data: function () {
        return {
            active: "Post",
            types: [
                {
                    label: "Tác phẩm",
                    value: "Post",
                    component: Post,
                },
                {
                    label: "Bách khoa",
                    value: "Wiki",
                    component: Wiki,
                },
                {
                    label: "Dữ liệu",
                    value: "Data",
                    component: Data,
                },
                {
                    label: "Giải trí",
                    value: "Fallow",
                    component: Fallow,
                },
                {
                    label: "Khác",
                    value: "Other",
                    component: Other,
                }
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

}
</script>

<style lang="less">
@import "../../assets/css/newCss/left.less";
@import "../../assets/css/newCss/content.less";
.m-empty{
    text-align: center;
}
</style>
