<template>
    <div class="m-search-view">
        <span class="u-list-empty" v-if="isEmpty">👻 Chưa có ghi chép</span>
        <div v-if="isLogin && isVirtual && !isEmpty" class="m-normal-op">
            <el-checkbox v-model="isAll" border @change="switchAll" size="small">Chọn tất cả</el-checkbox>
            <template v-if="selectedAchievements.length">
                <el-button plain icon="el-icon-check" @click.stop="finishVirtual" size="small">
                    Đánh dấu hoàn thành hàng loạt({{ selectedAchievements.length }})
                </el-button>
                <el-button type="info" icon="el-icon-close" @click.stop="cancelVirtual" size="small">
                    Hủy đánh dấu hoàn thành hàng loạt({{ selectedAchievements.length }})
                </el-button>
            </template>
        </div>
        <Achievements :achievements="achievements" />
        <el-pagination
            background
            :total="achievements_count"
            hide-on-single-page
            layout="prev, pager, next"
            :current-page="page"
            :page-size="length"
            prev-html="&laquo;"
            next-html="&raquo;"
            @current-change="page_change_handle"
        ></el-pagination>
    </div>
</template>

<script>
import Achievements from "@/components/cj/achievements.vue";
import { searchAchievements, setVirtualRoleAchievements, cancelVirtualRoleAchievements } from "@/service/achievement";

import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "SearchPage",
    components: {
        Achievements,
    },
    props: [],
    data() {
        return {
            achievements: [],
            achievements_count: 0,
            page: 1,
            length: 15,
            isAll: false,
        };
    },
    computed: {
        isEmpty() {
            return !this.achievements?.length;
        },
        isLogin() {
            return User.isLogin();
        },
        currentRole() {
            return this.$store.state.role;
        },
        selectedAchievements() {
            return this.achievements.filter((item) => item.checked);
        },
        isVirtual() {
            // 是否是虚拟角色 - 魔盒账号
            return !this.currentRole?.jx3id;
        },
        achievementsVirtual() {
            return this.$store.state.achievementsVirtual;
        },
    },
    watch: {
        $route: {
            immediate: true,
            async handler() {
                this.isAll = false;
                this.page = parseInt(this.$route.query.page) || 1;
                let data = await this.get_achievements(this.$route.params.keyword, this.page, this.length);
                const achievements =
                    data.achievements?.map((item) => {
                        return {
                            ...item,
                            checked: false,
                        };
                    }) || [];
                this.achievements = achievements;
                this.achievements_count = data.total;
            },
        },
    },
    methods: {
        switchAll(bol) {
            this.achievements = this.achievements.map((item) => {
                return {
                    ...item,
                    checked: bol,
                };
            });
        },
        // 获取成就搜索列表
        get_achievements(keyword, page, length) {
            let data = { keyword: keyword, page: page };
            if (this.$route.query.scene) data["scene"] = this.$route.query.scene;

            if (typeof length !== "undefined") data["limit"] = length;
            return new Promise((resolve, reject) => {
                searchAchievements(data).then(
                    (data) => {
                        data = data.data;
                        resolve(data.data);
                    },
                    () => {
                        resolve(false);
                    }
                );
            });
        },
        page_change_handle(page) {
            this.$router.push({
                name: "search",
                params: { keyword: this.$route.params.keyword },
                query: { page: page },
            });
        },
        finishVirtual() {
            const ids = this.selectedAchievements?.map((item) => item.ID + "");
            if (!ids.length) return;
            const data = {
                achievements: ids.join(),
            };
            setVirtualRoleAchievements(data).then((res) => {
                this.$notify({
                    title: "Thao tác thành công",
                    message: "Đã đánh dấu thành tựu được chọn là đã hoàn thành",
                    type: "success",
                });
                const list = Array.from(new Set(this.achievementsVirtual.concat(ids)));
                this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: list });
                this.isAll = false;
                this.achievements = this.achievements.map((item) => {
                    return {
                        ...item,
                        checked: false,
                    };
                });
            });
        },
        cancelVirtual() {
            const ids = this.selectedAchievements?.map((item) => item.ID + "");
            const data = {
                achievements: ids.join(),
            };
            cancelVirtualRoleAchievements(data).then((res) => {
                this.$notify({
                    title: "Thao tác thành công",
                    message: "Đã đánh dấu thành tựu được chọn là đang chờ hoàn thành",
                    type: "success",
                });
                const list = this.achievementsVirtual.filter((item) => !ids.includes(item));
                this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: list });
                this.isAll = false;
                this.achievements = this.achievements.map((item) => {
                    return {
                        ...item,
                        checked: false,
                    };
                });
            });
        },
    },
};
</script>

<style lang="less">
.m-search-view {
    .m-normal-op {
        .mb(20px);
    }

    .m-search-op {
        padding-bottom: 10px;
        .el-checkbox {
            margin-right: 10px;
        }
    }
}
</style>
