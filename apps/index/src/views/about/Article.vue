<template>
    <div class="p-article about-detail-wrapper">
        <div class="detail-title-list">
            <router-link
                class="title-item special-title-item hvr-grow"
                v-for="item in tabs"
                :key="item.type"
                :to="{ name: item.type }"
            >
                {{ item.title }}
            </router-link>
        </div>
        <div class="detail-content-wrap detail-text-wrap">
            <AboutText :customType="active"></AboutText>
        </div>
    </div>
</template>

<script>
import AboutText from "./components/AboutText.vue";
export default {
    name: "Article",
    components: { AboutText },
    data() {
        return {
            active: "",
            list: {
                terms: [
                    {
                        title: "Thỏa thuận người dùng",
                        type: "license",
                    },
                    {
                        title: "Chính sách bảo mật",
                        type: "privacy",
                    },
                ],
                creation: [
                    {
                        title: "Hiệp ước sáng tác",
                        type: "treaty",
                    },
                    {
                        title: "Khuyến khích sáng tác",
                        type: "incentives",
                    },
                ],
            },
        };
    },
    computed: {
        name() {
            return this.$route.name;
        },
        tabs() {
            return this.list[this.$route.meta.belongs] || [];
        },
    },
    watch: {
        name: {
            handler() {
                this.active = this.tabs[0].type;
            },
            immediate: true,
        },
    },
};
</script>

<style lang="less">
.p-article {
    .detail-title-list {
        gap: 20px;
    }
    .detail-title-list .title-item.router-link-exact-active {
        font-size: 20px !important;
    }
}
</style>
