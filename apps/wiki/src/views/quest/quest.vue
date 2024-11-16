<template>
    <DefaultLayout
        name="Bách khoa nhiệm vụ"
        slug="quest"
        root="/quest"
        without-right
        :publishEnable="true"
        :feedbackEnable="true"
        :crumbEnable="false"
    >
        <template #left>
            <CommonNav>
                <QuestNav> </QuestNav>
            </CommonNav>
        </template>
        <div class="m-search-wrap">
            <Search :placeholder="placeholder" @search="search">
                <div>
                    <el-tooltip content="Để xem chuỗi nhiệm vụ, bạn cần nhập tên nhiệm vụ đầy đủ hoặc ID nhiệm vụ." placement="top">
                        <el-checkbox v-model="chain">Xem chuỗi nhiệm vụ</el-checkbox>
                    </el-tooltip>
                    <el-tooltip class="u-tips" effect="dark" placement="bottom">
                        <div slot="content">
                            <span>※ Hỗ trợ tìm kiếm nhiệm vụ theo tên chính xác hoặc mơ hồ</span> <br />
                            <span>※ Hỗ trợ tìm kiếm tên đồ vật liên quan đến nhiệm vụ chính xác</span> <br />
                            <span>※ Hỗ trợ tìm kiếm tên thành tựu chính xác</span> <br />
                        </div>
                        <el-button type="text" icon="el-icon-question"></el-button>
                    </el-tooltip>
                </div>
            </Search>
            <el-popover popper-class="u-player-setting-popover" placement="top" width="160" v-model="settingVisible">
                <el-input v-model="playerName" placeholder="Danh xưng" @input="handlePlayerInfoChange" size="mini"
                    ><template #prepend>Danh xưng</template></el-input
                >
                <el-input v-model="playerBody" placeholder="Thể hình" @input="handlePlayerInfoChange" size="mini"
                    ><template #prepend>Thể hình</template></el-input
                >
                <div style="text-align: right; margin: 0">
                    <el-button type="primary" size="mini" @click="settingVisible = false">Xác nhận</el-button>
                </div>
                <div class="u-player" slot="reference">
                    <span class="u-player-name">{{ playerName }}</span
                    >|
                    <span class="u-player-body">{{ playerBody }}</span>
                    <el-button type="text" icon="el-icon-setting"></el-button>
                </div>
            </el-popover>
        </div>
        <router-view></router-view>
    </DefaultLayout>
</template>

<script>
import Search from "@/components/common/search.vue";
import CommonNav from "@/components/common/nav.vue";
import QuestNav from "@/components/quest/nav.vue";
import DefaultLayout from "@/layout/default-layout.vue";

import { getPlayerName } from "@/utils/quest";
export default {
    name: "Quest",
    components: { QuestNav, CommonNav, DefaultLayout, Search },
    data() {
        return {
            placeholder: "Nhập từ khóa nhiệm vụ (có thể bao gồm ngoặc vuông),「Enter」để tìm kiếm",
            chain: false,
            settingVisible: false,
            playerName: "侠士",
            playerBody: "少侠",
        };
    },
    methods: {
        search(keyword) {
            this.$router.push({
                name: "result",
                query: { keyword: keyword, chain: this.chain },
            });
        },
        handlePlayerInfoChange() {
            localStorage.setItem("QuestWiki:playerName", this.playerName);
            localStorage.setItem("QuestWiki:playerBody", this.playerBody);
        },
    },
    mounted() {
        const { playerName, playerBody } = getPlayerName();
        this.playerName = playerName;
        this.playerBody = playerBody;
    },
};
</script>
<style lang="less">
@import "~@/assets/css/app.less";
.m-search-wrap {
    .flex;
    width: 100%;
    align-items: center;

    @media screen and (min-width: 768px) {
        .el-input-group__append {
            .u-input-button__small {
                .none;
            }
        }
    }

    @media screen and (max-width: 768px) {
        .el-input-group__append {
            .u-input-button__normal {
                .none;
            }
        }
    }

    & > span:last-of-type {
        flex-shrink: 0;
    }
    .u-player {
        .flex;
        padding: 0 12px 10px 12px;
        align-items: center;
        .fz(14px, 1.5);
        .el-button {
            .ml(2px);
        }
    }

    .u-tips {
        margin: 0 0 0 8px !important;
    }
}

.u-player-setting-popover {
    .el-input {
        margin-bottom: 6px;
    }
}
@media screen and (max-width: @phone) {
    .m-search-wrap .u-player {
        .none;
    }
}
</style>
