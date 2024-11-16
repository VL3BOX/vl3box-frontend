<template>
Tết trung thu <div class="m-card" @click.stop>
Tết trung thuTết trung thu  <span class="u-close" @click="close"></span>
Tết trung thuTết trung thu  <div class="u-card" @click="change">
Tết trung thuTết trung thuTết trung thuTết trung thu<img v-if="!show" :src="`${imgLink}midAutumn/one.png`" alt="中秋节快乐！" />
Tết trung thuTết trung thuTết trung thuTết trung thu<img
Tết trung thuTết trung thuTết trung thuTết trung thuTết trung thu v-else
Tết trung thuTết trung thuTết trung thuTết trung thuTết trung thu class="animation"
Tết trung thuTết trung thuTết trung thuTết trung thuTết trung thu :class="show ? 'flipInY' : ''"
Tết trung thuTết trung thuTết trung thuTết trung thuTết trung thu :src="`${imgLink}midAutumn/two.png`"
Tết trung thuTết trung thuTết trung thuTết trung thuTết trung thu alt="中秋节快乐！"
Tết trung thuTết trung thuTết trung thuTết trung thu/>
Tết trung thuTết trung thuTết trung thuTết trung thu<span class="u-username" v-if="!show">{{ username }} 侠士</span>
Tết trung thuTết trung thuTết trung thuTết trung thu<span v-else class="u-fontCount animation" :class="show ? 'fadeInDown' : ''">{{ fontCount }}</span>
Tết trung thuTết trung thu  </div>
Tết trung thu </div>
</template>
<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
Tết trung thu name: "flipScreen",
Tết trung thu props: ["username", "fontCount"],
Tết trung thu data: function () {
Tết trung thuTết trung thu  return {
Tết trung thuTết trung thuTết trung thuTết trung thushow: false,
Tết trung thuTết trung thu  };
Tết trung thu },
Tết trung thu computed: {
Tết trung thuTết trung thu  imgLink() {
Tết trung thuTết trung thuTết trung thuTết trung thureturn __imgPath + `topic/festival/`;
Tết trung thuTết trung thu  },
Tết trung thu },
Tết trung thu watch: {},
Tết trung thu methods: {
Tết trung thuTết trung thu  change() {
Tết trung thuTết trung thuTết trung thuTết trung thuthis.show = true;
Tết trung thuTết trung thu  },
Tết trung thuTết trung thu  close() {
Tết trung thuTết trung thuTết trung thuTết trung thuthis.$emit("close");
Tết trung thuTết trung thu  },
Tết trung thu },
};
</script>
