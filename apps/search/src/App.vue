<template>
	<div id="app">
		<header>
			<Top />
			<Search />
		</header>
		<main v-if="q">
			<Namespace />
			<All v-if="type == 'all'" />
			<Post v-if="type == 'post'" />
			<Author v-if="type == 'author'" />
			<Wiki v-if="type == 'wiki'" />
			<!-- <Item v-if="type == 'item'" /> -->
			<Google v-if="type == 'google'" />
		</main>
		<footer v-show="q">
			<Bottom />
		</footer>
	</div>
</template>

<script>
import Top from "@/components/Top.vue";
import Bottom from "@/components/Bottom.vue";
import Search from "@/components/Search.vue";
import Wiki from "@/components/Wiki.vue";
import Post from "@/components/Post.vue";
import Namespace from "@/components/Namespace.vue";
import Author from "@/components/Author.vue";
import All from "@/components/All.vue";
// import Cj from '@/components/Cj.vue'
// import Item from '@/components/Item.vue'
import Google from "@/components/Google.vue";

export default {
	name: "App",
	data: function () {
		return {};
	},
	computed: {
		type: function () {
			return this.$store.state.type;
		},
		q: function () {
			return this.$store.state.q;
		},
	},
	components: {
		Top,
		Bottom,
		Search,
		Wiki,
		Namespace,
		Post,
		Author,
		All,
		// Cj,
		// Item,
		Google,
	},
};
</script>

<style lang="less">
@import "../node_modules/@jx3box/jx3box-common/css/preset.css";
@import "./assets/css/layout.less";
@import "./assets/css/post.less";
</style>
