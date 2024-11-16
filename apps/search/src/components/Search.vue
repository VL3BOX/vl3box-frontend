<template>
	<div class="m-search">
		<el-input placeholder="Vui lòng nhập nội dung" v-model="q" class="input-with-select" @change="search" clearable>
			<el-select v-model="type" slot="prepend" placeholder="Vui lòng chọn" class="m-search-type">
				<el-option label="Tất cả" value="all">Tất cả</el-option>
				<el-option label="Tác phẩm" value="post">Tác phẩm</el-option>
				<el-option label="Bách khoa" value="wiki">Bách khoa</el-option>
				<el-option label="Người dùng" value="author">Người dùng</el-option>
				<el-option label="Google" value="google">Google</el-option>
			</el-select>
			<el-button slot="append" icon="el-icon-search"></el-button>
		</el-input>
	</div>
</template>

<script>
export default {
	name: "Search",
	props: [],
	data: function () {
		return {
			//搜索词
			q: "",
			//类型
			type: "",
		};
	},
	watch: {
		type: function () {
			this.$store.commit("changeType", this.type);
		},
	},
	methods: {
		search() {
			if (!this.q) return;
			this.$store.commit("changeQuery", this.q);
		},
		init() {
			let params = new URLSearchParams(location.search);
			this.q = params.get("q") || "";
			this.type = params.get("type") || "all";
			this.search();
		},
	},
	mounted: function () {
		this.init();
	},
};
</script>

<style lang="less">
//搜索框
.el-input-group__prepend .el-select {
	width: 80px;
}
.el-select-dropdown__item img {
	width: @space;
	vertical-align: middle;
	position: relative;
	top: -2px;
	margin-right: 5px;
}
@media screen and (max-width: @ipad-y) {
	.m-search-type {
		display: none;
	}
}
</style>
