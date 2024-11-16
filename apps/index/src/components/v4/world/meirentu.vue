<template>
    <tr>
        <td>Mỹ nhân đồ</td>
        <td :title="server">
            {{ server }}
        </td>
        <td>
            <el-tooltip class="item" effect="dark" :content="(meirentu && meirentu.desc) || 'Không'" placement="bottom">
                <div>
                    {{ (meirentu && meirentu.name) || "Hôm nay tạm thời chưa có chân dung" }}
                </div>
            </el-tooltip>
        </td>
    </tr>
</template>

<script>
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
import { getMeirentu } from "@/service/spider";
export default {
    data() {
        return {
            meirentu: null,
        };
    },
    props: ["server"],
    computed : {
        client: function () {
            return this.$store.state.client || 'std';
        },
        servers: function () {
            if (this.client == "std") {
                return servers_std;
            } else {
                return servers_origin;
            }
        },
    },
    watch: {
        server: {
            immediate: true,
            handler(val) {
                val && this.loadMeirentu();
            },
        },
    },
    methods: {
        // 获取Mỹ nhân đồ
        loadMeirentu() {
            getMeirentu(this.server).then((res) => {
                this.meirentu = res.data.data;
            });
        },
    },
};
</script>
