<template>
    <div class="m-fb-rank" v-loading="loading">
        <h3 class="m-fb-rank-title">Bảng xếp hạng 100 đoàn đội vượt phó bản liên khu của Kiếm Tam</h3>
        <p class="m-fb-rank-desc">Hoạt động khen thưởng liên kết<a href="/tool/?pid=13715" target="_blank">Quy tắc hoạt động và báo cáo</a></p>
        <div class="m-fb-rank-tip el-alert el-alert--warning is-light">
            Thành tích của phòng làm việc sẽ không được hiển thị, thành tích được xác định chính thức là chơi thuê sẽ không được hiển thị, thành tích của đoàn đội chưa được xác nhận quá 1 tuần sẽ không được hiển thị, để xác nhận vui lòng tham gia nhóm QQ của trưởng đoàn:<a href="https://jq.qq.com/?_wv=1027&k=NoEyYq75">785597424</a>
        </div>

        <div class="m-fb-rank-wrapper" v-if="hasRank">
            <div class="m-fb-rank-tab">
                <el-tabs type="card" @tab-click="loadRank" v-model="active">
                    <el-tab-pane v-for="(cid, name) in nav" :label="name" :key="name" :name="name"></el-tab-pane>
                </el-tabs>
            </div>

            <div class="m-fb-rank-box m-fb-rank-box-full">
                <div class="m-fb-rank-list" v-for="(group, id) in rank" :key="id" v-show="active == id">
                    <div class="m-fb-rank-group">
                        <div class="u-list">
                            <el-row class="u-th">
                                <el-col :span="2" class="u-subblock u-order">Xếp hạng</el-col>
                                <el-col :span="4" class="u-subblock u-team">Đội trưởng</el-col>
                                <el-col :span="4" class="u-subblock u-server"
                                    ><el-select v-model="server" filterable placeholder="Máy chủ" size="small" @change="serverFilter">
                                        <el-option v-for="item in servers" :key="item" :label="item" :value="item"> </el-option> </el-select
                                ></el-col>
                                <el-col :span="4" class="u-subblock u-date">Thời gian hoàn thành</el-col>
                                <el-col :span="4" class="u-subblock u-cost">Thời gian tiêu diệt</el-col>
                                <el-col :span="4" class="u-subblock u-detail">Danh sách thành viên</el-col>
                                <el-col :span="2" class="u-subblock u-status">Trạng thái</el-col>
                            </el-row>
                            <el-row v-for="(item, i) in group" :key="i" v-show="item.visible">
                                <el-col :span="2" class="u-subblock u-order" :class="highlight(i)">{{ i + 1 }}</el-col>
                                <el-col :span="4" class="u-subblock u-team">{{ item.leader || item.Role }}</el-col>
                                <el-col :span="4" class="u-subblock u-server">{{ item.Server }}</el-col>
                                <el-col :span="4" class="u-subblock u-date"
                                    ><time
                                        >Thời gian hoàn thành : <b class="u-important">{{ item.finishTime | format }}</b></time
                                    ></el-col
                                >
                                <el-col :span="4" class="u-subblock u-cost"
                                    ><time
                                        >Thời gian : <b class="u-important u-big">{{ item.fightTime | costFormat }} </b></time
                                    ></el-col
                                >
                                <el-col :span="4" class="u-subblock u-detail"
                                    ><span class="u-detail-toggle" v-if="item.teamMembers" @click="view(item)"
                                        >点击展开 <i :class="item.active ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"></i></span
                                    ><span v-else>Không có dữ liệu thành viên</span></el-col
                                >
                                <el-col :span="2" class="u-subblock u-status">
                                    <span class="u-verified" v-if="item.teamname"><i class="el-icon-success"></i>{{ item.teamname }}</span>
                                    <span class="u-undefined" v-else>Thời gian công bố</span>
                                </el-col>
                                <el-col :span="24" class="u-members" :class="{ on: item.active }"  v-if="item.teamMembers">
                                    <div v-html="showMembers(item.teamMembers)"></div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <el-alert v-else class="m-archive-null" title="Hiện tại không có hoạt động trong phó bản này" type="info" center show-icon> </el-alert>
    </div>
</template>

<script>
// 10人 7503,7504,7505,7506,7507
// 25普通 7514,7515,7516,7517,7518
// 25英雄 7525,7526,7527,7528,7529
import { getDateRank } from "../service/team";
import moment from "moment";
import rankmap from "../assets/js/rank.json";
// import mock from '../mock/rank.json'
import { __ossMirror, __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import servers from "@jx3box/jx3box-data/data/server/server_list.json";
servers.unshift("全部");

export default {
    name: "Rank",
    props: [],
    data: function() {
        return {
            active: "",
            rank: {},
            loading: false,
            ready: false,
            server: "",
            servers: servers,
        };
    },
    computed: {
        fb: function() {
            return this.$store.state.fb;
        },
        nav: function() {
            return rankmap[this.fb];
        },
        labels: function() {
            return Object.keys(this.nav);
        },
        values: function() {
            return Object.values(this.nav);
        },
        first: function() {
            return this.labels[0];
        },
        hasRank: function() {
            return this.nav && Object.keys(this.nav).length;
        },
    },
    filters: {
        format: function(val) {
            return moment(val * 1000).format("YYYY-MM-DD HH:mm:ss");
        },
        costFormat: function(val) {
            let s = val / 1000;
            return ~~(s / 60) + "分" + ~~(s % 60) + "秒";
        },
    },
    methods: {
        loadRank: function() {
            // 重置Máy chủ
            this.server = "";
            this.loading = true;

            // 已请求
            if (this.rank[this.active]) {
                this.loading = false;
                return;
            }

            // 新请求
            let cid = this.nav[this.active];
            return getDateRank(cid)
                .then((res) => {
                    let data = res.data.data;
                    data.forEach((item) => {
                        item.active = false;
                        item.visible = true;
                    });
                    this.$set(this.rank, this.active, res.data.data);
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        highlight: function(i) {
            if (i < 10) {
                return "t1";
            } else if (i >= 10 && i < 20) {
                return "t2";
            } else if (i >= 20 && i < 30) {
                return "t3";
            }
        },
        showMembers: function(val) {
            let member_arr = val.split(";");
            let members = [];
            member_arr.forEach((member) => {
                let g = member.split(",");
                members.push(`<span class="u-member"><em><img src="${__imgPath}image/xf/${g[1]}.png"></em><b>${g[0]}</b></span>`);
            });
            return members.join("");
        },
        view(item) {
            this.$set(item, "active", !item.active);
        },
        serverFilter() {
            if (!this.rank[this.active]) return;

            let currentList = this.rank[this.active];

            if (this.server && this.server != "全部") {
                currentList.forEach((item) => {
                    if (item.Server == this.server) {
                        item.visible = true;
                    } else {
                        item.visible = false;
                    }
                });
            } else if (this.server == "全部") {
                currentList.forEach((item) => {
                    item.visible = true;
                });
            }
        },
    },
    mounted: function() {
        if (this.nav) {
            this.active = this.first;
            this.loadRank().then(() => {
                this.ready = true;
            });
        }
    },
};
</script>

<style lang="less">
@import "../assets/css/rank.less";
</style>
