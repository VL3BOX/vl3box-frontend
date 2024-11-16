<template>
    <el-drawer
        class="c-admin"
        title="Bảng điều khiển quản lý"
        v-model="dialog_visible"
        :before-close="close"
        append-to-body
        :with-header="true"
        v-if="hasRight"
        :close-on-click-modal="true"
    >
        <div class="c-admin-wrapper" ref="adminDrawer">
            <!-- <template v-if="isAdmin"> -->
            <el-divider content-position="left">Thay đổi trạng thái</el-divider>
            <el-radio-group v-model="post_status" class="c-admin-status">
                <el-radio-button v-for="(option, key) in status_options" :label="key" :key="key">{{
                    option
                }}</el-radio-button>
            </el-radio-group>
            <!-- </template> -->

            <el-divider content-position="left">Thay đổi khả năng hiển thị</el-divider>
            <el-radio-group v-model="visible" class="c-admin-status">
                <el-radio-button v-for="(option, key) in visible_options" :label="key" :key="key">{{
                    option
                }}</el-radio-button>
            </el-radio-group>

            <el-divider content-position="left">Dấu hiệu đề xuất</el-divider>
            <el-checkbox-group v-model="mark" class="c-admin-mark">
                <el-checkbox v-for="(option, key) in mark_options" :label="key" :key="key">{{ option }}</el-checkbox>
            </el-checkbox-group>

            <el-divider content-position="left">Nổi bật và ghim lên đầu</el-divider>
            <el-checkbox class="c-admin-highlight-checkbox" v-model="isSticky">Ghim lên đầu</el-checkbox>
            <el-checkbox class="c-admin-highlight-checkbox" v-model="isHighlight">Bật nổi bật</el-checkbox>
            <template v-if="isHighlight">
                <el-color-picker
                    class="c-admin-highlight-block"
                    v-model="color"
                    :predefine="color_options"
                ></el-color-picker>
                <span class="c-admin-highlight-preview" :style="{ color: color }">Xem trước hiệu ứng nổi bật</span>
            </template>

            <el-divider content-position="left">Áo bìa poster</el-divider>
            <div class="c-admin-banner">
                <el-upload
                    class="c-admin-upload el-upload--picture-card"
                    :action="uploadurl"
                    :with-credentials="true"
                    :show-file-list="false"
                    :on-success="uploadSuccess"
                    :on-error="uploadFail"
                >
                    <img v-if="post_banner" :src="post_banner" />
                    <el-icon><Plus /></el-icon>
                </el-upload>
                <el-input class="u-banner" v-model="post_banner">
                    <template #prepend>
                        <span>Địa chỉ poster</span>
                    </template>
                    <template #append>
                        <span>
                            <span class="u-btn" @click="removeBanner">
                                <el-icon><CircleClose /></el-icon> Xóa hình ảnh bìa
                            </span>
                        </span>
                    </template>
                </el-input>
            </div>

            <el-divider content-position="left">Thông tin metadata</el-divider>
            <div class="c-admin-info">
                <div class="w-select c-admin-type">
                    <div class="u-select-label">Mục</div>
                    <el-select
                        v-model="post_type"
                        placeholder="Vui lòng chọn mục"
                        style="width: 100%"
                        class="u-select drawer-item-content"
                        :disabled="appDisabled"
                    >
                        <el-option
                            v-for="type in type_options"
                            :key="type.value"
                            :label="type.label"
                            :value="type.value"
                        ></el-option>
                    </el-select>
                </div>
                <div class="c-admin-author">
                    <el-input v-model="post_author" placeholder="Vui lòng nhập ID tác giả" class="input-author drawer-item-content">
                        <template #prepend>
                            <span class="u-keyword">ID tác giả</span>
                        </template>
                    </el-input>
                </div>
            </div>

            <div class="c-admin-buttons">
                <el-button type="primary" @click="submit" :loading="pushing">Gửi</el-button>
                <el-button plain @click="close">Hủy</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script>
import Bus from "../../utils/bus";
import * as utilModule from "@jx3box/jx3box-common/js/utils";
const { getRewrite } = utilModule;
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { getSetting, postSetting } from "../../service/admin";
import User from "@jx3box/jx3box-common/js/user";
import CMS_MARKS from "@jx3box/jx3box-common/data/mark.json";
import { getTopicBucket } from "../../service/cms";

const { cms: marks } = CMS_MARKS;
// import { onClickOutside } from "@vueuse/core";
export default {
    name: "BreadAdmin",
    emits: ["update"],
    props: {
        marksOptions: {
            type: Object,
            default: () => {},
        },
        // 入口是否是后台管理/list
        fromList: {
            type: Boolean,
            default: false,
        },
        show: {
            type: Boolean,
            default: false,
        },
        postId: {
            type: [Number, String],
            default: 0,
        },
        // 是否禁止Mục选择
        appDisabled: {
            type: Boolean,
            default: false,
        },
        showExtend: {
            type: Boolean,
            default: false,
        },
        subtypeMap: {
            type: Object,
            default: () => {},
        },
        app: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            // 可视
            dialog_visible: false,

            // 数据
            pulled: false,
            pushing: false,

            // 权限
            hasRight: false,
            pid: 0,
            channel: "",

            // 状态
            post_status: "publish",
            status_options: {
                publish: "Mặc định",
                draft: "Bản nháp",
                pending: "Chờ duyệt",
                dustbin: "Xóa",
            },
            visible: "0",
            visible_options: JX3BOX.__visibleMap,

            // 角标
            mark: [],

            // 高亮
            isHighlight: false,
            color: "rgb(255,0,1)",
            color_options: [
                "rgb(255,0,1)",
                "rgb(2,209,248)",
                "rgb(147,217,25)",
                "rgb(255,154,2)",
                "rgb(255,44,142)",
                "rgb(142,46,255)",
            ],

            // Ghim lên đầu
            isSticky: false,
            sticky: 0,
            isStar: 0,

            // 海报
            uploadurl: JX3BOX.__cms + "api/cms/upload",
            banner_preview: "",
            post_banner: "",

            // Loại
            post_type: "",
            type_options: [],
            post_subtype: "",
            topics: [],
            tags: [],

            // 作者
            post_author: "",
        };
    },
    computed: {
        data: function () {
            return {
                ID: this.pid,
                post_status: this.post_status || "publish",
                visible: this.visible || "0",
                post_author: this.post_author || 1,
                post_type: this.post_type || "bbs",
                post_banner: this.post_banner || "",
                color: this.isHighlight ? this.color : "",
                mark: this.mark || [],
                sticky: this.isSticky ? Date.now() : null,
                star: this.isStar,
                topics: this.topics,
                post_subtype: this.post_subtype,
            };
        },
        isAdmin: function () {
            return User.isAdmin();
        },
        mark_options: function () {
            return this.marksOptions && Object.keys(this.marksOptions)
                ? Object.assign({}, marks, this.marksOptions)
                : marks;
        },
    },
    methods: {
        // 是否有权限
        checkHasRight: function () {
            this.hasRight = User.isEditor();
        },
        // 获取pid
        checkPostID: function () {
            this.pid = getRewrite("pid") || (this.$route && this.$route.params && this.$route.params.id) || 0;
        },
        // 获取type
        checkChannel: function () {
            this.channel = location.pathname.split("/")[1];
        },
        // 加载Loại选项
        initTypeOptions: function () {
            let types = [];
            for (let key in JX3BOX.__postType) {
                types.push({
                    value: key,
                    label: JX3BOX.__postType[key],
                });
            }
            this.type_options = types;
        },
        // 上传
        uploadSuccess: function (res, file) {
            this.banner_preview = URL.createObjectURL(file.raw);
            this.post_banner = res.data[0];
        },
        uploadFail: function (err) {
            this.$message.error("Tải lên không thành công");
            console.log(err);
        },
        removeBanner: function () {
            this.post_banner = "";
        },
        // 关闭
        close() {
            this.dialog_visible = false;
            this.$emit("update", {
                show: false,
            });
        },
        // 拉
        pull: function () {
            getSetting(this.pid).then((data) => {
                let { ID, color, mark, post_status, post_author, sticky, post_banner, post_type, visible, star, post_subtype, topics } = data;
                this.pid = ID;
                this.post_status = post_status;
                this.visible = visible;
                this.post_author = post_author;
                this.post_type = post_type;
                this.post_banner = post_banner;
                this.color = color;
                if (this.color) this.isHighlight = true;
                this.mark = mark || [];
                this.sticky = sticky || 0;
                if (this.sticky) this.isSticky = true;

                this.isStar = star || 0;
                this.topics = topics?.map(item => item.topic) || [];
                this.post_subtype = post_subtype || "";

                // 设置加载完成标识
                this.pulled = true;
            });
        },
        // Gửi
        submit: function () {
            this.pushing = true;
            this.push();
        },
        // 推
        push: function () {
            postSetting(this.data)
                .then(() => {
                    this.$emit("update", {
                        show: false,
                        data: this.data,
                    });
                    this.$message({
                        message: "Cài đặt thành công",
                        type: "success",
                    });
                })
                .finally(() => {
                    this.pushing = false;
                    this.close();
                });
        },
        // 获取topic标签
        loadTopic() {
            getTopicBucket({ type: "bbs" }).then((res) => {
                const data = res.data.data?.map((item) => item.name) || [];
                this.tags = data;
            });
        },
    },
    watch: {
        "$route.params.id": function () {
            this.checkPostID();
        },
        show: {
            immediate: true,
            handler(bol) {
                if (this.fromList) {
                    this.dialog_visible = bol;
                    if (bol) {
                        this.pid = this.postId;
                        this.pull();
                    }
                }
            },
        },
    },
    created: function () {
        // 是否mount
        this.checkHasRight();
        // 预设信息
        this.initTypeOptions();
    },
    mounted: function () {
        // 基本信息
        this.checkPostID();
        this.checkChannel();

        // 绑定监听
        Bus.on("toggleAdminPanel", () => {
            this.dialog_visible = !this.dialog_visible;
            this.checkPostID();
            // 文章Loại的加载
            if (this.pid && this.hasRight) {
                this.pull();
            }

            if (this.showExtend && this.app && this.dialog_visible) {
                this.loadTopic();
            }
        });
    },
};
</script>

<style lang="less">
@import "../../assets/css/admin.less";
</style>
