<template>
    <el-dialog custom-class="m-dps-form" :visible="modelValue" @close="close" append-to-body :title="title">
        <el-form :model="form" :rules="rules" label-position="left" label-width="80px" ref="form">
            <el-form-item label="Tâm pháp" prop="mount">
                <el-select
                    v-model="form.mount"
                    placeholder="请选择Tâm pháp"
                    style="width: 100%"
                    popper-class="m-mount-select"
                    filterable
                >
                    <el-option
                        v-for="item in options.mount_filters"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                    >
                        <div class="u-option">
                            <img class="u-xf-icon" :src="showMountIcon(item.value)" />
                            <span class="u-xf-name">{{ showMountName(item.value) }}</span>
                        </div>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Tác phẩm liên quan" prop="url">
                <el-select
                    v-model="form.url"
                    placeholder="Nhập từ khóa để tìm kiếm"
                    style="width: 100%"
                    filterable
                    :filter-method="loadData"
                    @change="onPostChange"
                >
                    <el-option
                        v-for="item in list"
                        :key="item.ID"
                        :value="`/tool/${item.ID}`"
                        :label="item.post_title"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Khách hàng" prop="client">
                <el-select v-model="form.client" placeholder="请选择Khách hàng" style="width: 100%">
                    <el-option
                        v-for="item in options.client_filters"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Loại" prop="type">
                <el-select v-model="form.type" placeholder="请选择Loại" style="width: 100%">
                    <el-option
                        v-for="item in options.type_filters"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Người đóng góp" prop="contributors">
                <el-input v-model="form.contributors" placeholder="请输入除自己外的其余Người đóng góp魔盒UID，用半角逗号,隔开"></el-input>
            </el-form-item>
            <el-form-item label="Ghi chú" prop="remark">
                <el-input v-model="form.remark" placeholder="(Không bắt buộc)"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit">Gửi</el-button>
                <el-button @click="close">Hủy</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import xfids from "@jx3box/jx3box-data/data/xf/xfid.json";
import { showMountIcon } from "@jx3box/jx3box-common/js/utils";
import { getMyPost } from "@/service/post";
import { addDpsRegistry, updateDpsRegistry } from "@/service/dps";
import { debounce } from "lodash";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "dps-form",
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        options: {
            type: Object,
            default: () => ({}),
        },
        data: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ["update:modelValue"],
    data() {
        return {
            form: {
                mount: "",
                name: "",
                url: "",
                client: this.client,
                type: "",
                contributors: "",
                remark: "",
            },
            rules: {
                mount: [{ required: true, message: "请选择Tâm pháp", trigger: "blur" }],
                name: [{ required: true, message: "Vui lòng nhập tên", trigger: "blur" }],
                url: [{ required: true, message: "Vui lòng nhập liên kết", trigger: "blur" }],
                client: [{ required: true, message: "请选择Khách hàng", trigger: "blur" }],
                type: [{ required: true, message: "请选择Loại", trigger: "blur" }],
            },

            list: [],
            saveLoading: false,
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        title() {
            return this.data ? "Yêu cầu chỉnh sửa máy tính" : "Yêu cầu thêm máy tính";
        }
    },
    mounted() {
        this.loadData();
    },
    watch: {
        client: {
            handler() {
                this.form.client = this.client;
            },
            immediate: true,
        },
        modelValue(val) {
            if (val && this.data) {
                this.form = {
                    mount: this.data.mount,
                    name: this.data.name,
                    url: this.data.url,
                    client: this.data.client,
                    type: this.data.type,
                    contributors: this.data.contributors,
                    remark: this.data.remark,
                }
            }
            if (!val) {
                this.$refs.form.resetFields();
                this.form = {
                    mount: "",
                    name: "",
                    url: "",
                    client: this.client,
                    type: "",
                    contributors: "",
                    remark: "",
                }
            }
        }
    },
    methods: {
        showMountIcon,
        close() {
            this.$emit("update:modelValue", false);
        },
        showMountName: function (mount_id) {
            return xfids[mount_id];
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.saveLoading = true;
                    const fn = this.data ? updateDpsRegistry(this.data.id, this.form) : addDpsRegistry(this.form);
                    fn.then((res) => {
                            this.$message.success("Gửi成功");
                            this.close();
                        })
                        .finally(() => {
                            this.saveLoading = false;
                        });
                }
            });
        },
        loadData: debounce(function (title) {
            const params = {
                page: 1,
                per: 10,
                title,
                client: this.client,
                type: "bps",
            };
            User.isLogin() && getMyPost(params).then((res) => {
                this.list = res.data.data?.list || [];
            });
        }, 500),
        onPostChange() {
            this.form.name = this.list.find((item) => item.ID == this.form.url.split("/").pop()).post_title;
        },
    },
};
</script>

<style lang="less">
.m-dps-form {
}
.m-mount-select {
    .u-option {
        .flex;
        align-items: center;
        .u-xf-icon {
            width: 24px;
            height: 24px;
        }
        .u-xf-name {
            margin-left: 10px;
        }
    }
}
</style>
