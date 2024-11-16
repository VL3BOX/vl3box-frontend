<template>
    <div class="m-fb-story" v-loading="loading">
        <el-tabs v-model="map_id" type="card" v-if="data && data.length">
            <el-tab-pane v-for="item in data" :label="item.Layer3Name" :key="item.MapID" :name="String(item.MapID)">
                <div class="m-story-basic">
                    <el-divider content-position="left">Thông tin cơ bản</el-divider>
                    <el-descriptions :column="3" border>
                        <el-descriptions-item label="Tên">{{ item.OtherName }}</el-descriptions-item>
                        <el-descriptions-item label="ID bản đồ">{{ item.MapID }}</el-descriptions-item>
                        <el-descriptions-item label="Bản mở rộng"
                            >Level.{{ item.DivideLevel }}／{{ item.DivideName }}／{{
                                item.VersionName
                            }}</el-descriptions-item
                        >
                        <el-descriptions-item label="Yêu cầu cấp độ tối thiểu">{{ item.MinLevel }}</el-descriptions-item>
                        <el-descriptions-item label="Lối vào" :span="2">{{ item.EnterWay }}</el-descriptions-item>
                        <el-descriptions-item label="Giới thiệu">{{
                            formatIntroduction(item.Introduction)
                        }}</el-descriptions-item>
                    </el-descriptions>
                </div>
                <div class="m-story-boss">
                    <el-divider content-position="left">Truyền thuyết thủ lĩnh</el-divider>
                    <div class="u-list" v-if="boss_list && boss_list.length">
                        <div class="u-boss" v-for="(boss, i) in boss_list" :key="i">
                            <h5 class="u-name">
                                <img class="u-boss-icon" svg-inline src="../assets/img/skull.svg" />
                                {{ boss.BOSS }}
                            </h5>
                            <p class="u-boss-detail" v-html="boss.Introduce"></p>
                            <el-button
                                class="u-boss-more"
                                type="primary"
                                plain
                                @click="loadSkills(boss)"
                                size="mini"
                                icon="el-icon-key"
                                >{{
                                    !skill_list[boss.NPCID] ? "Xem kỹ năng" : skill_status[boss.NPCID] ? "Thu gọn" : "Mở rộng"
                                }}</el-button
                            >
                            <div class="u-boss-skills" v-show="skill_status[boss.NPCID]">
                                <template v-if="skill_list[boss.NPCID]">
                                    <div class="u-skill" v-for="skill in skill_list[boss.NPCID]" :key="skill.idkey">
                                        <h6 class="u-skill-name">※ {{ skill.SkillName }}</h6>
                                        <div class="u-skill-desc">{{ skill.Desc }}</div>
                                    </div>
                                </template>
                                <div class="u-skill-null" v-else>
                                    <i class="el-icon-warning-outline"></i> Không có thông tin liên quan
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="'Bản đồ phó bản'">
                <fb-map></fb-map>
            </el-tab-pane>
        </el-tabs>
        <el-alert title="Không tìm thấy thông tin liên quan" type="info" show-icon v-else></el-alert>
    </div>
</template>

<script>
import { __ossMirror } from "@jx3box/jx3box-common/data/jx3box";
import { getInfo, getBoss, getBossSkills } from "@/service/story.js";
import { extractTextContent } from "@jx3box/jx3box-common/js/utils";
import fbMap from "./Map.vue";

export default {
    name: "Story",
    components: {
        fbMap,
    },
    props: [],
    data: function () {
        return {
            loading: false,
            map_id: "",
            data: "",
            boss_list: "",
            skill_list: {
                // NPCID : []
            },
            skill_status: {},
        };
    },
    computed: {
        fb: function () {
            return this.$route.query.fb_name || this.$store.state.default_fb;
        },
        client: function () {
            return this.$store.state.client;
        },
        map_cover: function () {
            return __ossMirror + "pic/map/map_" + this.mapid + "_0.png";
        },
    },
    methods: {
        loadData: function () {
            this.loading = true;
            const isFbMapTab = this.data && this.data.findIndex((item) => ~~item.MapID === ~~this.map_id) === -1;
            getInfo(this.fb, this.client)
                .then((res) => {
                    this.data = res?.data || [];
                    const length = this.data.length; // Bản đồ phó bản的tab name为tabs的index
                    this.map_id = !isFbMapTab ? String(this.data?.[0]?.["MapID"]) : length + "";
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadSkills: function (boss) {
            let npc_id = boss?.NPCID;
            if (this.skill_list[npc_id]) {
                this.skill_status[npc_id] = !this.skill_status[npc_id];
                this.$forceUpdate();
            } else {
                // 合并技能列表
                let skills = [boss.Step1Skill, boss.Step2Skill, boss.Step3Skill, boss.Step4Skill, boss.szStep5Skill];
                skills = _.compact(skills);
                skills = skills.join(";");

                // 请求技能数据
                this.loading = true;
                getBossSkills(skills, this.client)
                    .then((res) => {
                        this.skill_list[npc_id] = res?.data || [];
                        this.skill_status[npc_id] = true;
                        this.$forceUpdate();
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
        },
        formatIntroduction: function (str) {
            return extractTextContent(str)?.[0]?.text;
        },
    },
    watch: {
        fb: function () {
            this.loadData();
        },
        map_id: function (id) {
            if (id) {
                this.loading = true;
                getBoss(id, this.client)
                    .then((res) => {
                        this.boss_list = res?.data || [];
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
        },
        "$route.query.map_id": {
            immediate: true,
            handler: function (id) {
                if (id) {
                    this.map_id = id;
                }
            },
        },
    },
    mounted: function () {
        this.loadData();
    },
};
</script>

<style lang="less">
@import "../assets/css/story.less";
</style>
