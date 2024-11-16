<template>
    <AppLayout>
        <div class="m-recipe" v-loading="loading">
            <!-- Tìm kiếm -->
            <div class="m-recipe-search">
                <el-input v-model.trim.lazy="search" placeholder="Vui lòng nhập từ khóa.." clearable @clear="onSearch" @keydown.native.enter="onSearch">
                    <template #prepend> <i class="el-icon-search"></i> Tìm kiếm </template>
                    <template #append>
                        <el-button icon="el-icon-position" @click="onSearch"></el-button>
                    </template>
                </el-input>
            </div>
            <!-- 列表 -->
            <div class="m-recipe-list" v-if="data && data.length">
                <el-table
                    :data="data"
                    :default-sort="{ prop: 'name' }"
                    size="small"
                    :loading="loading"
                    @row-click="expandRow"
                    ref="recipeTable"
                >
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="u-expand">
                                <el-form-item
                                    :label="key"
                                    v-for="(val, key) in props.row"
                                    :key="key"
                                    v-show="isNotHidden(key) && hasValidValue(val)"
                                >
                                    <span>{{ props.row[key] }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="SkillName"
                        label="Tên kỹ năng"
                        width="120"
                        :filters="skills"
                        :filter-method="filterHandler"
                    ></el-table-column>
                    <el-table-column prop="name" label="Tên bí kíp" sortable width="300">
                        <template slot-scope="scope">
                            <span :href="getItemLink(scope.row.RecipeName)" class="u-link">
                                <img :src="iconLink(scope.row.IconID)" class="u-icon" />
                                <span class="u-name" :class="'isQuality-' + scope.row.Quality">{{
                                    scope.row.RecipeName
                                }}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="Desc" label="Mô tả bí kíp" sortable>
                        <template slot-scope="scope">
                            <span class="u-desc">{{ scope.row.Desc }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="exam_print" label="Tiêu hao" width="100" sortable>
                        <template slot-scope="scope">
                            <template v-if="scope.row.ExamPrint && !scope.row.TrainValue">
                                <span class="u-points">
                                    <img src="../assets/img/recipe/exam_points.png" alt />
                                    {{ scope.row.ExamPrint }}
                                </span>
                            </template>
                            <template v-if="scope.row.TrainCost">
                                <span class="u-points u-train">
                                    <img src="../assets/img/recipe/train_points.png" alt />
                                    {{ scope.row.TrainCost }}
                                </span>
                            </template>
                            <template v-if="scope.row.TrainValue">
                                <span class="u-points u-train">
                                    <img src="../assets/img/recipe/train_points.png" alt />
                                    {{ scope.row.TrainValue }}
                                </span>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="tasks" label="Nguồn nhiệm vụ">
                        <template slot-scope="scope">
                            <a
                                v-for="task in scope.row.tasks"
                                :key="task.name"
                                :href="getTaskLink(task.id)"
                                target="_blank"
                                @click.stop
                            >
                                [{{ task.name }}]
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="books" label="Nguồn sách">
                        <template slot-scope="scope">
                            <a
                                v-for="book in scope.row.books"
                                :key="book.name"
                                :href="getItemLink(book.id)"
                                target="_blank"
                                @click.stop
                            >
                                [{{ book.name }}]
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="doodad_template_id" label="Nguồn bia ký">
                        <template slot-scope="scope">
                            <a
                                v-for="doodad in scope.row.doodad_template_id"
                                :key="doodad.name"
                                :href="getDoodadLink(doodad.id)"
                                target="_blank"
                                @click.stop
                            >
                                [{{ doodad.name }}]
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="_remark" label="Ghi chú">
                        <template slot-scope="scope">
                            <span>{{ scope.row._remark }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="RecipeName" label="Bách khoa">
                        <template slot-scope="scope">
                            <a :href="getItemWiki(scope.row.RecipeName)" class="u-link" target="_blank" @click.stop
                                >查看Bách khoa&raquo;</a
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </AppLayout>
</template>

<script>
import AppLayout from "@/layout/AppLayout.vue";
import { getRecipe } from "@/service/node.js";
import { mount_belong_school } from "@jx3box/jx3box-data/data/xf/relation.json";
import { iconLink, extractTextContent } from "@jx3box/jx3box-common/js/utils";
import { getLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "Recipe",
    props: [],
    components: { AppLayout },
    data: function () {
        return {
            search: "",
            raw: [],
            loading: false,
            hidden_fields: ["idkey", "tasks", "books", "doodad_template_id", "_remark"],

            isInit: true,
        };
    },
    computed: {
        mount_name: function () {
            return this.$route.query.subtype || "通用";
        },
        school_name: function () {
            if (this.mount_name == "通用") {
                return "江湖";
            } else {
                return mount_belong_school[this.mount_name];
            }
        },
        params: function () {
            return {
                school: this.school_name,
                client: this.client,
            };
        },
        skills: function () {
            let list = new Set();
            this.data.forEach((item) => {
                list.add(item.SkillName);
            });
            list = [...list];
            list = list.map((item) => {
                return { text: item, value: item };
            });
            return list;
        },
        data: function () {
            // 过滤废弃数据
            let clean_list = this.raw.filter((item) => {
                return (
                    item.Name &&
                    !!item.SkillID &&
                    !item.RecipeName.includes("废") &&
                    !item.RecipeName.includes("镜像") &&
                    !item.RecipeName.includes("删除") &&
                    !item.RecipeName.includes("复制")
                );
            });
            // 补全Tên kỹ năng与武功套路
            clean_list = clean_list.map((item) => {
                let re = /《(.*?)·(.*?)》/;
                let name = item.RecipeName.match(re);
                item.SkillName = name && name[2];
                item.KungfuName = name && name[1];
                item.IconID = item.IconID;
                item.Desc = item.Desc;
                item.ExamPrint = item.ExamPrint;
                item.Quality = item.Quality;
                item.BindType = item.BindType;
                item.UiID = item.UiID;
                return item;
            });
            clean_list = clean_list.filter((item) => {
                return item.SkillName;
            });
            return clean_list;
        },
        client: function () {
            return this.$store.state.client || "std";
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler: function () {
                this.loadData();
            },
        },
        school_name: {
            handler: function () {
                this.search = "";
                this.isInit = true;
            },
        },
    },
    methods: {
        onSearch() {
            this.getRecipe();
        },
        // 加载秘籍
        loadData: function () {
            this.getRecipe();
        },
        getRecipe: function () {
            this.loading = true;
            const params = {
                ...this.params,
                search: this.search,
            }
            getRecipe(params)
                .then((res) => {
                    this.raw = res.data;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        filterHandler(value, row, column) {
            return row["SkillName"] === value;
        },
        isNotHidden: function (key) {
            return !this.hidden_fields.includes(key);
        },
        hasValidValue(val) {
            return val !== "" && val !== undefined && val !== null;
        },
        expandRow: function (row, column, event) {
            this.$refs.recipeTable.toggleRowExpansion(row);
        },
        iconLink,
        getItemLink: function (id) {
            return getLink("item", id);
        },
        getTaskLink: function (id) {
            return getLink("quest", id);
        },
        getDoodadLink: function (id) {
            return getLink("doodad", id);
        },
        getItemWiki: function (str) {
            return `/item/search/${str}`;
        },
    },
};
</script>

<style lang="less">
@import "../assets/css/recipe.less";
</style>
