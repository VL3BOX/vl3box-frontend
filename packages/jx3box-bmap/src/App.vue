<template>
    <div id="app">
        <BMap></BMap>
    </div>
</template>

<script>
import BMap from "./components/BMap.vue";
export default {
    name: "App",
    components: {
        BMap,
    },
    props: [],
    data: function () {
        return {};
    },
    computed: {},
    methods: {},
};
</script>
