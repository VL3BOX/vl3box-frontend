<template>
    <div class="about-wrapper">
        <Header :overlayEnable="true"></Header>
        <div class="m-about-main" :style="{ backgroundImage: `url('${backgroundImage}')` }">
            <Breadcrumb
                class="m-about-bread"
                icon="more"
                :name="name"
                slug="about"
                root="/about"
                :publishEnable="false"
            >
            </Breadcrumb>
            <LeftSidebar class="m-about-nav--left">
                <SubNav :side="true"></SubNav>
            </LeftSidebar>
            <SubNav class="m-about-nav--top"></SubNav>
            <div class="m-about-content">
                <transition duration="550" name="nested" mode="out-in">
                    <keep-alive>
                        <router-view v-if="$route.meta.cache" class="inner"></router-view>
                    </keep-alive>
                    <router-view v-if="!$route.meta.cache" class="inner"></router-view>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import SubNav from "./components/SubNav.vue";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import { isPhone } from "@/utils/index";
export default {
    name: "About",
    props: [],
    components: { SubNav },
    data: function () {
        return {
            isPhone: false,
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        name() {
            return this.$route.meta.title === "首页" ? "关于我们" : this.$route.meta.title;
        },
        backgroundImage() {
            // return "/temp/about/" + this.$route.name + ".png";
            const name = this.$route.name || "index";
            return __cdn + "design/about/" + name + ".png";
        },
    },
    watch: {},
    methods: {},
    created: function () {},
    mounted() {
        const self = this;
        self.isPhone = isPhone();
        let timer = null;
        window.addEventListener("resize", () => {
            if (timer === null) {
                timer = setTimeout(() => {
                    self.isPhone = isPhone();
                    clearTimeout(timer);
                    timer = null;
                }, 0);
            }
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/about/about.less";
@import "~@/assets/css/about/index.less";
</style>
