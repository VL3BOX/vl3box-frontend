<template>
    <div class="m-notice-phone u-notice-box">
        <div class="u-notice-value">
            <span class="u-address" v-if="phone">{{ phoneStr(phone) }}</span>
            <el-tag class="u-notice-status" :type="phone ? 'success' : 'info'" size="small">{{
                phone ? "已绑定" : "未绑定"
            }}</el-tag>
        </div>
        <el-button type="primary" :circle="isPhone" class="u-bind-button" @click="visible = true" icon="el-icon-edit">{{
            phone ? "修改手机" : "绑定手机"
        }}</el-button>
        <el-dialog
            title="绑定手机"
            :visible.sync="visible"
            :width="isPhone ? '95%' : '400px'"
            custom-class="m-notice-phone__dialog"
            :before-close="handleClose"
        >
            <div class="m-phone-content" v-loading="loading">
                <img class="u-qr" src="../../assets/img/bindphone.jpg" />
                <i class="u-tip">打开微信扫一扫，{{ phone ? "修改" : "绑定" }}手机号</i>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getProfile } from "@/service/profile";
export default {
    name: "phone",
    data: function () {
        return {
            visible: false,

            phone: "",

            isPhone: window.innerWidth < 768,

            loading: false,
        };
    },
    methods: {
        phoneStr: function (phone) {
            if (!phone) return "";
            return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
        },
        onUpdate: function () {
            this.visible = false;
        },
        handleClose: function () {
            this.visible = false;
        },
    },
    mounted: function () {
        getProfile().then((res) => {
            this.phone = res.data.data.user_phone;
        });
    },
};
</script>

<style lang="less">
.m-notice-phone {
    .flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.m-notice-phone__dialog {
    .m-phone-content {
        .flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        .u-qr {
            .flex;
            align-items: center;
            justify-content: center;
            .size(180px);
            .el-image__inner {
                .full;
            }
        }
        .u-error {
            .fz(120px);
        }
    }
}
@media screen and (max-width: @phone) {
    .m-notice-phone {
        .u-value {
            font-size: 12px;
        }
        .u-bind-button {
            span {
                .none;
            }
        }
    }
}
</style>
