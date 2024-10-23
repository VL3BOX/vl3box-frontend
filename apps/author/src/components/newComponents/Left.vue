<template>
    <div class="m-author-info">
        <div class="m-top">
            <div class="u-title">
                TA的作品
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
                    label: "作品",
                    value: "Post",
                    component: Post,
                },
                {
                    label: "百科",
                    value: "Wiki",
                    component: Wiki,
                },
                {
                    label: "数据",
                    value: "Data",
                    component: Data,
                },
                {
                    label: "休闲",
                    value: "Fallow",
                    component: Fallow,
                },
                {
                    label: "其他",
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
