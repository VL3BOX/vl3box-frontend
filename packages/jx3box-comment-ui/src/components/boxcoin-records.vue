<template>
    <el-dialog :visible="modelValue" @close="onClose" title="打赏记录" width="1002px">
        <boxcoin-records :postType="postType" :postId="postId" :postClient="client" mode="normal"></boxcoin-records>
    </el-dialog>
</template>

<script>
import boxcoin_records from '@jx3box/jx3box-common-ui/src/interact/boxcoin_records.vue';
import "@jx3box/jx3box-common-ui/assets/css/thx.less";
export default {
    name: "BoxcoinRecords",
    components: {
        'boxcoin-records': boxcoin_records,
    },
    props: {
        postType: String,
        postId: String,
        client: String,
        modelValue: Boolean,
    },
    model: {
        prop: "modelValue",
        event: "update:modelValue"
    },
    methods: {
        onClose() {
            this.$emit('update:modelValue', false);
        }
    }
}
</script>

<style lang="less">
// @import "@jx3box/jx3box-common-ui/assets/css/thx.less";
</style>