<template>
    <div class="c-admin-drop">
        <el-dropdown trigger="click" @command="handleCommand">
            <el-button type="primary" class="c-admin-button c-admin-drop__button" :size="buttonSize" icon="Setting"
                > Quản lý <el-icon style="margin-left: 5px;"><ArrowDown></ArrowDown></el-icon>
            </el-button>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item v-if="isEditor" command="toggleAdminPanel" icon="Setting">
                        <span>Cài đặt</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="isEditor" command="directMessage" icon="Message">
                        <span>Tin nhắn riêng</span>
                    </el-dropdown-item>
                    <el-dropdown-item icon="UploadFilled" command="designTask" v-if="hasPermission('push_banner')">
                        <span>Đẩy thông báo</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>

        <design-task v-model="showDesignTask" :post="post"></design-task>
    </div>
</template>

<script>
import Bus from "../../utils/bus";
import User from "@jx3box/jx3box-common/js/user";
import DesignTask from "./DesignTask.vue";
import { sendMessage } from "../../service/admin";
export default {
    name: "AdminDrop",
    components: {
        DesignTask
    },
    props: {
        buttonSize: {
            type: String,
            default: "default",
        },
        post: {
            type: Object,
            default: () => {},
        },
        userId: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            showDesignTask: false,
        }
    },
    computed: {
        isEditor() {
            return User.isEditor();
        },
        sourceId() {
            return this.post?.ID
        },
        sourceType() {
            return this.post?.post_type
        },
    },
    methods: {
        handleCommand(command) {
            this[command]();
        },
        toggleAdminPanel() {
            Bus.emit("toggleAdminPanel");
        },
        directMessage() {
            this.$prompt("请输入Tin nhắn riêng内容", "Quản lýTin nhắn riêng", {
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Hủy bỏ",
                inputPlaceholder: "请输入Tin nhắn riêng内容",
                inputValidator: (value) => {
                    if (!value) {
                        return "请输入Tin nhắn riêng内容";
                    }
                },
                beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                        const data = {
                            source_id: String(this.sourceId),
                            source_type: this.sourceType,
                            user_id: this.userId,
                            content: "Thông báo từ quản lý:" + instance.inputValue,
                            type: "system",
                            subtype: "admin_message"
                        };
                        sendMessage(data).then(() => {
                            this.$message.success("Tin nhắn riêng成功");
                            done();
                        })
                    } else {
                        done();
                    }
                }
            }).catch(() => {})
        },
        designTask() {
            this.showDesignTask = true;
        },
        hasPermission(permission) {
            return User.hasPermission(permission);
        }
    }
};
</script>

<style lang="less">
.c-admin-drop {
    float: right;
    margin-top: -2px;
    margin-right: 10px;
}
.c-admin-drop__button {
    padding: 8px 18px !important;
    align-items: center;
}
</style>
