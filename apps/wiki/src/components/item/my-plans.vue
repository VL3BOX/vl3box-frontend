<template>
    <div class="m-plans-my">
        <div class="m-my-item-plans">
            <h3 class="c-sidebar-right-title">
                <i class="u-icon u-icon-mycollection"><img svg-inline src="@/assets/img/plan.svg" /></i>
                <span>Danh sách của tôi</span>
                <a class="fr el-button el-button--success el-button--mini" @click="onAddPlan" v-if="isLogin">
                    <i class="el-icon-document-add"></i>
                    <span>Tạo</span>
                </a>
            </h3>
            <template v-if="isLogin">
                <template v-if="data && data.length">
                    <router-link
                        class="m-my-item-plan"
                        v-for="(plan, key) in data"
                        :key="key"
                        :to="{
                            name: 'plan_view',
                            params: { plan_id: plan.id },
                        }"
                    >
                        <h5 class="u-title">
                            <i class="el-icon-lock" v-if="!plan.public"></i>
                            <span>{{ plan.title }}</span>
                        </h5>
                        <!-- <div class="u-misc">
                            <div class="u-delete" @click.stop="delete_plan($event, plan.id)">
                                <i class="el-icon-delete " title="Xóa"></i>
                            </div>
                            <div class="u-edit" @click.stop="edit_plan($event, plan.id)">
                                <i class="el-icon-edit " title="Chỉnh sửa"></i>
                            </div>
                            <span class="u-updated">Chỉnh sửa于{{ date_format(plan.updated) }}</span>
                        </div> -->
                    </router-link>
                    <el-pagination
                        class="m-pagination"
                        background
                        layout="prev, pager, next"
                        :pager-count="5"
                        small
                        :hide-on-single-page="true"
                        :page-size="per"
                        :total="total"
                        :current-page.sync="page"
                    ></el-pagination>
                </template>
                <div v-else class="u-tip"><i class="el-icon-warning-outline"></i> Chưa có ghi chép danh sách vật phẩm</div>
            </template>
            <template v-else
                ><div class="u-tip"><i class="el-icon-warning-outline"></i> Vui lòng đăng nhập</div></template
            >
        </div>
    </div>
</template>

<script>
import { getMyPlans, addMyPlan } from "@/service/item-plan.js";
import { __Links } from "@jx3box/jx3box-common/data/jx3box.json";
import User from "@jx3box/jx3box-common/js/user";
import { date_format } from "@/filters";
import bus from "@/store/bus";
export default {
    name: "",
    props: [],
    data: function () {
        return {
            isLogin: User.isLogin(),
            data: [],

            page: 1,
            per: 8,
            total: 0,
        };
    },
    computed: {
        params: function () {
            return {
                page: this.page,
                per: this.per,
            };
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler() {
                this.loadData();
            },
        },
    },
    mounted() {
        bus.on('plan_list_refresh', () => {
            this.loadData();
        })
    },
    methods: {
        date_format,
        loadData() {
            if (!this.isLogin) {
                return;
            }
            getMyPlans(this.params).then((res) => {
                this.data = res.list;
                this.total = res.total;
            });
        },
        onAddPlan() {
            this.$prompt("Vui lòng nhập tên danh sách", "Tạo清单", {
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Hủy bỏ",
                inputPlaceholder: "Vui lòng nhập tên danh sách",
                inputValidator: (value) => {
                    if (!value) {
                        return "Vui lòng nhập tên danh sách";
                    }
                },
                callback: (action, instance) => {
                    if (action === "confirm") {
                        const data = {
                            title: instance.inputValue,
                            type: 1, // 1: 物品清单
                            public: 1,
                            relation: [],
                            description: "",
                        }
                        addMyPlan(data).then((res) => {
                            this.$message({
                                message: "Tạo成功",
                                type: "success",
                            });
                            this.data.unshift(res.data.data);
                            this.$router.push({
                                name: "plan_edit",
                                params: { plan_id: res.data.data.id },
                            });
                        });
                    }
                },
            })
        }
    },
};
</script>
