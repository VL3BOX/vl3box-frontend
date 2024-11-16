<template>
    <div class="m-icons-search">
        <!-- 搜索框 -->
        <el-input placeholder="Nhập điều kiện tìm kiếm, ví dụ: 3089, 1-100, Nhị Nguyệt Loạn Hoa" v-model="search" class="input-with-select" @keyup.enter.native="onSearch" @change.once="useSearchIcon">
            <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
        </el-input>
        <!-- 如何搜索图片（文字） -->
        <div class="m-icon-search-tip">
            <ul>
                <li>Nhập một số, ví dụ 1, trả về biểu tượng có IconID là 1;</li>
                <li>Nhập nhiều số, ví dụ 2,4,6 (hỗ trợ dấu phẩy “,”, dấu chấm “、”, dấu gạch chéo “/”, dấu gạch đứng “|”), trả về ba biểu tượng có IconID lần lượt là 2,4,6;|Nhập nhiều số, ví dụ 2,4,6 (hỗ trợ dấu phẩy “,”, dấu chấm “、”, dấu gạch chéo “/”, dấu gạch đứng “|”), trả về ba biểu tượng có IconID lần lượt là 2,4,6;</li>
                <li>Nhập khoảng phạm vi, ví dụ 1~100 hoặc 1-100, trả về 100 biểu tượng có IconID từ 1 đến 100;</li>
                <li>Có thể nhập đồng thời nhiều số và nhiều phạm vi, ví dụ 2,3,11-14,17, trả về 7 biểu tượng có IconID lần lượt là 2,3,11,12,13,14,17;</li>
                <li>Nhập tên một biểu tượng, có thể tìm kiếm biểu tượng liên quan theo tên, ví dụ: Nhị Nguyệt, Nhị Nguyệt Loạn Hoa.</li>
                <li>Giới hạn 500 biểu tượng mỗi lần</li>
            </ul>
        </div>

        <!-- 展示图标 -->
        <el-alert class="m-icons-tips" v-if="isNewbie" title="Dưới đây là một số biểu tượng, vui lòng tùy chỉnh phạm vi tìm kiếm ở trên, nhấp vào biểu tượng để yêu thích." type="warning" center show-icon></el-alert>
        <el-alert class="m-icons-tips" v-if="!searchList.length" title="Không tìm thấy biểu tượng tương ứng, vui lòng nhập lại từ khóa để tìm kiếm biểu tượng." type="info" center show-icon></el-alert>

        <div class="m-icons-matrix m-icons-matrix-main" v-if="searchList.length>0">
            <icon-item v-for="(icon, index) in searchList" :icon="icon" :isFav="false" :key="index"></icon-item>
        </div>

        <div class="m-more" v-if="isNumber">
            <el-button @click="searchMore">500 biểu tượng sau khi tìm kiếm</el-button>
        </div>
    </div>
</template>
<script>
import iconItem from "./item.vue";
import { getIconsByName } from "@/service/icons.js";
import default_list from "@/assets/data/design/default.json";
export default {
    name: "search",
    props: [],
    components: {
        iconItem,
    },
    data: function() {
        return {
            search: "",
            searchList: [],
            isNewbie: true,

            isNumber: false,

            page: 1
        };
    },
    computed: {
        client: function() {
            return this.$store.state.client;
        },
        favList: function() {
            return this.$store.state.favList || [];
        },
    },
    methods: {
        useSearchIcon() {
            this.isNewbie = false;
        },
        onSearch() {
            if (!this.search) return;
            this.getSearchData(this.search);
        },
        async getSearchData(query) {
            if (query == this.searchKey) return;
            // 如果出现空格、全角逗号、顿号、斜杠、飘键进行替换
            query = query
                .replace(/\s/g, "")
                .replace(/，|、|\/|\||\\/g, ",")
                .replace(/~/g, "-");

            // 如果没有分隔符，先判断是不是按照名字搜索的文字
            let numberReg = /^[0-9]+$/;

            // 按照名称搜索 请求接口
            if (!query.includes(",") && !query.includes("-") && !numberReg.test(query)) {
                this.searchList = await this.searchIconByName(query);
                this.isNumber = false;
                return;
            }

            let searchList = [];
            let iconTmp = [];
            this.searchList=[] //数据置空
            // 如果同时出现逗号和杠，先拆逗号，再拆杠
            if (query.includes(",")) {
                iconTmp = query.split(",");
            }
            if (!iconTmp.length) {
                iconTmp = [query];
            }

            iconTmp.forEach((item) => {
                if (item.includes("-")) {
                    const [min, max] = item
                        .split("-")
                        .map(Number)
                        .sort();

                    if (!isNaN(min) && !isNaN(max)) {
                        for (let i = min; i <= max; i++) {
                            if (!searchList.includes(i)) {
                                searchList.push(i);
                            }
                        }
                    }
                } else {
                    if (!isNaN(parseInt(item))) {
                        searchList.push(parseInt(item));
                    }
                }
            });
            //置空数据界面渲染结束后赋值，防止复制插件data-clipboard-click-handler等不被重新渲染
            this.$nextTick(()=>{
                this.searchList = searchList.slice(0, 500);
                this.isNumber = true;
            })

        },
        async searchIconByName(name) {
            return getIconsByName(name, this.client)
                .then((res) => {
                    const { item, skill, buff } = res;

                    const list = [...item, ...skill, ...buff];
                    const idList = [];
                    const tmpList = [];

                    list.forEach((item) => {
                        if (item.iconID) {
                            let iconId = String(item.iconID);

                            if (!idList.includes(iconId)) {
                                idList.push(iconId);
                                tmpList.push({ id: iconId, name: item.Name });
                            }
                        }
                    });

                    return tmpList;
                })
                .catch((e) => {
                    console.log("Error:", e);
                });
        },
        searchMore() {
            let searchList = this.searchList;
            let lastId = searchList[searchList.length - 1];
            let newSearchList = [];
            for (let i = lastId + 1; i <= lastId + 500; i++) {
                newSearchList.push(i);
            }
            this.searchList = [...newSearchList];

            // 滚动至顶部
            document.documentElement.scrollTop = 0;
        }
    },
    created: function() {
        this.searchList = default_list
    },
};
</script>
