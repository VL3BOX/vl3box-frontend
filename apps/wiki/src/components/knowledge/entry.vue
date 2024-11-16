<template>
    <div class="m-knowledge-panel">
        <div class="m-title">
            <span class="u-title-left"><i class="el-icon-location-information"></i><span> Điều hướng nhanh</span></span>
            <!-- <a class="u-title-right" target="_blank" :href="feedback">反馈建议 &raquo;</a> -->
        </div>
        <div class="m-entry m-panel">
            <a class="u-entry" v-for="(item, index) in list" :key="index" :href="item.link" target="_blank">
                <i :class="item.icon"></i>
                <span>{{ item.name }}</span>
            </a>
        </div>
    </div>
</template>
<script>
import { feedback } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "Entry",
    data: function () {
        return {
            feedback,
            list: [
                {
                    link: "/cj",
                    name: "Bách khoa thành tựu",
                    icon: "el-icon-medal",
                },
                {
                    link: "/item",
                    name: "Bách khoa vật phẩm",
                    icon: "el-icon-apple",
                },
                {
                    link: "#/pet",
                    name: "Bách khoa sủng vật",
                    icon: "el-icon-pear",
                },
                {
                    link: "/quest",
                    name: "Bách khoa nhiệm vụ",
                    icon: "el-icon-discover",
                },
            ],
        };
    },
};
</script>

<style scoped lang="less">
.m-entry {
	.flex;
	.u-entry {
		.mr(20px);
		.db;
		.r(4px);
		.color(#fff);
		padding: 8px 20px;
		background-color: #3a97eb;
		i {
			.mr(5px);
		}
		&:hover {
			filter: brightness(110%);
		}
	}
}
</style>
