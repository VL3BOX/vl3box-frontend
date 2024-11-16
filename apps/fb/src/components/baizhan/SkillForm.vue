<template>
    <el-dialog class="m-skill-dialog" :visible.sync="show" :title="title" :before-close="close">
        <el-form class="m-skill-form" ref="form" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="Cấp độ kỹ năng" prop="level">
                <el-select v-model="form.level" placeholder="Vui lòng chọn số lần kỹ năng" style="width: 100%">
                    <el-option v-for="item in maxLevel" :key="item" :value="item" :label="`Thứ ${item} Lần`"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Thời gian hồi kỹ năng" prop="cooldown" style="width: 100%">
                <el-select v-model="form.cooldown" placeholder="请选择Thời gian hồi kỹ năng">
                    <el-option :value="60" label="Cấp 3 - 60 giây"></el-option>
                    <el-option :value="30" label="Cấp 2 - 30 giây"></el-option>
                    <el-option :value="10" label="Cấp 1 - 10 giây"></el-option>
                    <el-option :value="0" label="Kỹ năng bị động"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Sát thương" prop="damage">
                <el-input v-model="form.damage" placeholder="请填写Sát thương数值" />
            </el-form-item>
            <el-form-item label="Tiêu hao tinh lực" prop="cost_vigor">
                <el-input v-model="form.cost_vigor" placeholder="请填写Tiêu hao tinh lực" />
            </el-form-item>
            <el-form-item label="Tiêu hao nội lực" prop="cost_endurance">
                <el-input v-model="form.cost_endurance" placeholder="请填写Tiêu hao nội lực" />
            </el-form-item>
            <el-form-item label="Đòn đánh tinh lực" prop="hit_vigor">
                <el-input v-model="form.hit_vigor" placeholder="请填写Đòn đánh tinh lực" />
            </el-form-item>
            <el-form-item label="Đòn đánh nội lực" prop="hit_endurance">
                <el-input v-model="form.hit_endurance" placeholder="请填写Đòn đánh nội lực" />
            </el-form-item>
            <el-form-item label="Liên kết hướng dẫn" prop="link">
                <el-input v-model="form.link" placeholder="请填写Liên kết hướng dẫn" />
            </el-form-item>
            <el-form-item label="Ghi chú" prop="remarks">
                <el-input type="textarea" v-model="form.remarks" placeholder="请填写Ghi chú" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close">Hủy</el-button>
                <el-button type="primary" :loading="loading" @click="submitForm()">Xác nhận定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
import { addSkillInfo } from "@/service/baizhan";
import { cloneDeep } from "lodash";

const form = {
    user_id: 0,
    skill_id: 0,
    level: 5,
    cooldown: 0,
    damage: 0,
    cost_vigor: 0,
    cost_endurance: 0,
    hit_vigor: 0,
    hit_endurance: 0,
    link: "",
    remarks: "",
};

export default {
    name: "SkillForm",
    props: ["staged"],
    data: () => ({
        show: false,
        loading: false,
        form: cloneDeep(form),
        rules: {},
    }),
    computed: {
        maxLevel() {
            return ~~this.staged?.InSkill?.MaxLevel || 5;
        },
        title() {
            return `百战技能数据维护/${this.staged.szSkillName}/${this.staged.szBossName}`;
        },
    },
    watch: {
        visible: {
            immediate: true,
            handler: function (val) {
                this.show = val;
            },
        },
    },
    methods: {
        open(addon) {
            this.form = {
                ...form,
                ...addon,
            };
            this.show = true;
        },
        // 关闭
        close() {
            this.show = false;
            this.$refs.form.resetFields();
        },
        submitForm() {
            this.$refs.form.validate((valid, fields) => {
                if (valid) {
                    this.edit();
                } else {
                    console.log("error submit!!!", fields);
                }
            });
        },
        // 编辑
        edit() {
            if (this.loading) return;
            this.loading = true;
            addSkillInfo(this.form)
                .then((res) => {
                    this.$notify({
                        type: "success",
                        message: "修改成功!",
                    });
                    const { data } = res.data || {};
                    this.$emit("update", data);
                })
                .finally(() => {
                    this.loading = false;
                    this.close();
                });
        },
    },
};
</script>
