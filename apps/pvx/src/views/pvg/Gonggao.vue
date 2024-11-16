<template>
    <div class="p-gonggao">
        <CommonToolbar class="m-gonggao-tabs" color="#53b27f" :types="tabs" @update="updateToolbar" />
        <div class="m-content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { getMyFocusServers, getAllServers } from "@/service/server.js";
import CommonToolbar from "@/components/common/toolbar.vue";
export default {
    name: "Gonggao",
    components: { CommonToolbar },
    data() {
        return {
            tabs: [
                {
                    value: "daily",
                    label: "Tổng quan",
                },
                {
                    value: "calendar",
                    label: "Lịch sự kiện",
                },
                {
                    value: "server",
                    label: "Trạng thái máy chủ",
                },
            ],
            serverList: [],
            heatStateArr: [
                {
                    value: "6",
                    label: "Ổn định",
                    class: "is-open",
                },
                {
                    value: "7",
                    label: "Đông đúc",
                    class: "is-busy",
                },
                {
                    value: "8",
                    label: "Quá tải",
                    class: "is-full-load",
                },
                {
                    value: "3",
                    label: "Bảo trì",
                    class: "is-close",
                },
            ],
        };
    },
    computed: {
        active() {
            return this.$route.name;
        },
        tab() {
            return this.tabs[this.active].key;
        },
        uid() {
            return this.$store.state.uid;
        },
    },
    methods: {
        // 获取服务器列表
        loadAllServers() {
            getAllServers().then((res) => {
                let mainServerList = res.data?.map((server) => {
                    return {
                        ...server,
                        connect_state_name: this.heatStateArr.find((item) => item.value === server.heat)?.label || "",
                        connect_state_class: this.heatStateArr.find((item) => item.value === server.heat)?.class || "",
                    };
                });

                this.serverList = mainServerList;
                this.$store.commit("setServerList", this.serverList);
                if (this.uid) {
                    getMyFocusServers().then((data) => {
                        this.serverFav(data);
                    });
                }
            });
        },
        //转服务器数据 str转换成obj
        serverFav(data) {
            if (!data) return;
            data = data.split(",");
            const favList = [];
            this.serverList.forEach((k) => {
                if (data.includes(k.main_server)) {
                    favList.push(k);
                }
            });
            this.$store.commit("setFavList", favList);
        },
        updateToolbar(data) {
            const { type } = data;
            this.$router.push({
                path: `/gonggao/${type}`,
            });
        },
    },
    created() {
        this.loadAllServers();
    },
};
</script>

<style lang="less">
.p-gonggao {
    .pt(40px);
    .m-content {
        .pt(20px);
    }
}
</style>
