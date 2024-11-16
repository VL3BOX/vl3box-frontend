<template>
    <div class="m-lanternFestival">
        <div class="u-lanternFestival-card" :class="show ? 'u-card-on' : 'u-card-off'" @click="change">
            <img class="u-card-bg" :src="`${imgLink}/lanternFestival/BG.png`" alt="Lễ hội đèn lồng!" />
            <img class="u-card-bg02" :src="`${imgLink}/lanternFestival/Frame01.png`" alt="Lễ hội đèn lồng!" />
            <img class="u-card-button" :src="`${imgLink}/lanternFestival/button.png`" alt="Lễ hội đèn lồng!" />
            <img class="u-card-icon" :src="`${imgLink}/lanternFestival/Frame02.png`" alt="Lễ hội đèn lồng!" />
            <img class="u-card-icon02" :src="`${imgLink}/lanternFestival/debut.png`" alt="Lễ hội đèn lồng!" />
            <img class="u-card-content" :src="`${imgLink}/lanternFestival/Frame03.png`" alt="Lễ hội đèn lồng!" />
            <div class="u-card-count">{{ fontCount }}</div>
        </div>
    </div>
</template>
<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "lanternFestival",
    props: ["fontCount"],
    computed: {
        imgLink() {
            return __imgPath + `topic/festival/`;
        },
    },
    data() {
        return {
            show: false,
        };
    },
    methods: {
        change() {
            if (this.show) {
                this.$emit("close");
            }
            this.show = !this.show;
        },
    },
};
</script>
