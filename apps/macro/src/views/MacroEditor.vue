<template>
    <app-layout slug="macroeditor" className="m-macroeditor">
        <h1 class="m-macroeditor-title">
            Trình chỉnh sửa macro thông minh
            <a href="/tool/265" target="_blank" class="u-help el-button el-button--success is-plain el-button--mini">
                <i class="el-icon-s-management"></i> Sổ tay tham khảo cú pháp macro
            </a>
        </h1>
        <div class="m-editor">
            <el-row>
                <el-col :span="12">
                    <div class="m-col m-col-left">
                        <h2 class="u-subtitle"><img class svg-inline src="@/assets/img/macro/cube1.svg" />Chèn nhanh</h2>
                        <el-form class="u-cmds" ref="form" :model="form" label-width="80px">
                            <el-form-item label="Cách giải phóng">
                                <el-radio-group v-model="castType">
                                    <el-radio label="cast">Giải phóng(cast)</el-radio>
                                    <el-radio label="fcast">Thi triển bắt buộc(fcast)</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="Tên kỹ năng">
                                <el-input v-model="skill"></el-input>
                            </el-form-item>
                            <el-form-item label="条件Giải phóng">
                                <el-switch v-model="isConditional"></el-switch>
                                <template v-if="isConditional && conditions.length > 2">
                                    <span class="btn-help">
                                        <!-- <el-tooltip
                                        content="Nhấn để xem mối quan hệ logic thực tế"
                                        placement="right"
                                        effect="light"
                                        :manual="true"
                                        :value="true"
                                    >
                                        <el-link :underline="false" @click="showRealLogic" style="font-size: 24px;">
                                            💡Nhấn để xem mối quan hệ logic thực tế
                                        </el-link>
                      </el-tooltip>-->
                                        <el-button plain icon="el-icon-info" @click="showRealLogic"
                                            >Nhấn để xem mối quan hệ logic thực tế</el-button
                                        >
                                    </span>
                                    <el-alert
                                        title="请注意，此处选择的逻辑将不做处理，直接转换为宏中的 & 和 | "
                                        type="warning"
                                    ></el-alert>
                                    <el-dialog
                                        title="Logic thực tế"
                                        :visible.sync="logicDialogVisible"
                                        :width="Math.min(640, this.windowInnerWidth * 0.9) + 'px'"
                                    >
                                        <span>{{ logicDialog }}</span>
                                        <span slot="footer" class="dialog-footer">
                                            <el-button type="primary" @click="logicDialogVisible = false"
                                                >Xác nhận</el-button
                                            >
                                        </span>
                                    </el-dialog>
                                </template>
                            </el-form-item>
                            <template v-if="isConditional">
                                <el-form-item
                                    v-for="(condition, index) of conditions"
                                    :key="index"
                                    :label="`条件${index + 1}`"
                                >
                                    <template v-if="index >= 1">
                                        <el-form-item label>
                                            <el-radio-group v-model="condition.logic">
                                                <el-radio label="&amp;">Và(and)</el-radio>
                                                <el-radio label="|">Hoặc(or)</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </template>
                                    <el-row :gutter="6">
                                        <el-col :span="16">
                                            <el-select
                                                v-model="condition.name"
                                                placeholder="Các mục điều kiện"
                                                @change="onConditionChange(index)"
                                            >
                                                <el-option label="Bản thân có hiệu ứng tăng giảm" value="buff"></el-option>
                                                <el-option label="Bản thân có hiệu ứng tăng giảm层数" value="buff_level"></el-option>
                                                <el-option label="Mục tiêu có hiệu ứng tăng giảm" value="tbuff"></el-option>
                                                <el-option label="Mục tiêu có hiệu ứng tăng giảm层数" value="tbuff_level"></el-option>
                                                <el-option label="Thời gian hiệu lực của hiệu ứng tăng giảm bản thân" value="bufftime"></el-option>
                                                <el-option label="Thời gian hiệu lực của hiệu ứng tăng giảm mục tiêu" value="tbufftime"></el-option>
                                                <el-option label="Bản thân không có hiệu ứng tăng giảm nào đó" value="nobuff"></el-option>
                                                <el-option label="Mục tiêu không có hiệu ứng tăng giảm nào đó" value="tnobuff"></el-option>
                                                <el-option label="目标NPC强度等级" value="npclevel"></el-option>
                                                <el-option label="Tỷ lệ giữa điểm số sức khỏe và máu tối đa" value="life"></el-option>
                                                <el-option label="Tỷ lệ giữa điểm nội lực và nội lực tối đa" value="mana"></el-option>
                                                <el-option label="Giá trị kiếm khí / khí đao / ý chiến / giận dữ" value="rage"></el-option>
                                                <el-option
                                                    label="Điểm khí thuần dương / Thiền pháp Thiếu Lâm / Giá trị vũ điệu kiếm Bảy Hoa"
                                                    value="qidian"
                                                ></el-option>
                                                <el-option label="Giá trị cơ khí thần / khí đao sương tre / giá trị chặn" value="energy"></el-option>
                                                <el-option label="Giá trị linh hồn mặt trời / khí đao màn vàng" value="sun"></el-option>
                                                <el-option label="Giá trị Nguyệt hồn" value="moon"></el-option>
                                                <el-option label="Trạng thái Mãn Nhật" value="sun_power"></el-option>
                                                <el-option label="Trạng thái Mãn Nguyệt" value="moon_power"></el-option>
                                                <el-option
                                                    label="Số lớp tích năng của kỹ năng đang được nạp"
                                                    value="skill_energy"
                                                ></el-option>
                                                <el-option label="存在某技能/奇穴ID" value="skill"></el-option>
                                                <el-option label="不存在某技能/奇穴ID" value="noskill"></el-option>
                                                <el-option
                                                    label="该宏最后一次Giải phóng的技能"
                                                    value="last_skill"
                                                ></el-option>
                                                <el-option label="Số lượng kẻ địch trong phạm vi 3 thước" value="nearby_enemy"></el-option>
                                                <el-option label="Kỹ năng đã hồi xong" value="skill_notin_cd"></el-option>
                                                <el-option label="Điểm dược tính" value="yaoxing"></el-option>
                                            </el-select>
                                            <el-row :gutter="2">
                                                <el-col
                                                    :span="10"
                                                    v-if="needsConditionParams.subname.includes(condition.name)"
                                                >
                                                    <el-input v-model="condition.subname" placeholder="Tên"></el-input>
                                                </el-col>
                                                <el-col
                                                    :span="7"
                                                    v-if="needsConditionParams.relation.includes(condition.name)"
                                                >
                                                    <el-select
                                                        v-model="condition.relation"
                                                        v-if="
                                                            !needsConditionParams.relationRestricted.includes(
                                                                condition.name
                                                            )
                                                        "
                                                    >
                                                        <el-option label="=" value="="></el-option>
                                                        <el-option label="＜" value="<"></el-option>
                                                        <el-option label="＞" value=">"></el-option>
                                                        <el-option label="≥" value=">="></el-option>
                                                        <el-option label="≤" value="<="></el-option>
                                                        <el-option label="≠" value="~="></el-option>
                                                    </el-select>
                                                    <el-select v-model="condition.relation" v-else>
                                                        <el-option label="=" value="="></el-option>
                                                        <el-option label="≠" value="~="></el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col
                                                    :span="7"
                                                    v-if="needsConditionParams.value.includes(condition.name)"
                                                >
                                                    <el-input v-model="condition.value" placeholder="Giá trị"></el-input>
                                                </el-col>
                                            </el-row>
                                        </el-col>
                                        <el-col :span="7">
                                            <el-button
                                                type="danger"
                                                plain
                                                circle
                                                icon="el-icon-minus"
                                                @click="clickMinusCondition(index)"
                                                v-if="conditions.length > 1"
                                            ></el-button>
                                            <el-button
                                                type="primary"
                                                plain
                                                circle
                                                icon="el-icon-plus"
                                                @click="clickPlusCondition"
                                                style="margin-left: 2px"
                                                v-if="index === conditions.length - 1"
                                            ></el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </template>
                        </el-form>
                        <div class="u-submit">
                            <el-button type="primary" icon="el-icon-right" class="u-btn" @click="insertLine"
                                >Chèn</el-button
                            >
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="m-col m-col-right">
                        <h2 class="u-subtitle"><img class svg-inline src="@/assets/img/macro/cube2.svg" />Khu vực chỉnh sửa macro</h2>
                        <p class="u-tips">Nhấn phím Tab để tự động hoàn thành</p>
                        <codemirror v-model="code" :options="cmOptions" @input="onCmCodeChange" ref="cmEditor" />
                        <div class="u-count">
                            <b :class="{ warning: code.length > maxCodeLength }">{{ code.length }}</b>
                            / {{maxCodeLength}}
                            <em>(Còn lại {{ maxCodeLength - code.length }} chữ)</em>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </app-layout>
</template>

<script>
import { codemirror } from "vue-codemirror";
import CodeMirror from "codemirror";
// import base style
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/edit/matchbrackets.js";
import "@/utils/z-macro.js";
import AppLayout from "@/layout/AppLayout.vue";
export default {
    name: "MacroEditor",
    data: function () {
        return {
            windowInnerWidth: window.innerWidth,
            castType: "cast",
            form: null,
            skill: "",
            isConditional: false,
            needsConditionParams: {
                subname: [
                    "buff",
                    "buff_level",
                    "nobuff",
                    "bufftime",
                    "skill_energy",
                    "skill",
                    "noskill",
                    "skill_notin_cd",
                    "tbuff",
                    "tbuff_level",
                    "tnobuff",
                    "tbufftime",
                ],
                relation: [
                    "buff_level",
                    "tbuff_level",
                    "bufftime",
                    "life",
                    "mana",
                    "rage",
                    "qidian",
                    "energy",
                    "sun",
                    "moon",
                    "skill_energy",
                    "last_skill",
                    "npclevel",
                    "nearby_enemy",
                    "tbufftime",
                    "yaoxing",
                ],
                value: [
                    "buff_level",
                    "tbuff_level",
                    "bufftime",
                    "life",
                    "mana",
                    "rage",
                    "qidian",
                    "energy",
                    "sun",
                    "moon",
                    "skill_energy",
                    "last_skill",
                    "npclevel",
                    "nearby_enemy",
                    "tbufftime",
                    "yaoxing",
                ],
                relationRestricted: ["skill", "noskill", "last_skill"],
            },
            conditions: [
                {
                    name: "",
                    relation: "=",
                    value: "",
                    logic: "&",
                    subname: "",
                },
            ],
            conditionValueName: {
                buff: "存在增减益效果",
                buff_level: "增减益效果层数",
                nobuff: "不存在某增减益效果",
                bufftime: "增减益效果持续时间",
                life: "Tỷ lệ giữa điểm số sức khỏe và máu tối đa",
                mana: "Tỷ lệ giữa điểm nội lực và nội lực tối đa",
                rage: "Giá trị kiếm khí / khí đao / ý chiến / giận dữ",
                qidian: "纯阳气点",
                energy: "Giá trị cơ khí thần / khí đao sương tre / giá trị chặn",
                sun: "Giá trị linh hồn mặt trời / khí đao màn vàng",
                moon: "Giá trị Nguyệt hồn",
                sun_power: "Trạng thái Mãn Nhật",
                moon_power: "Trạng thái Mãn Nguyệt",
                skill_energy: "Số lớp tích năng của kỹ năng đang được nạp",
                skill: "存在某技能/奇穴ID",
                noskill: "不存在某技能/奇穴ID",
                last_skill: "该宏最后一次Giải phóng的技能",
                npclevel: "目标NPC强度等级",
                nearby_enemy: "自身Số lượng kẻ địch trong phạm vi 3 thước",
                skill_notin_cd: "Kỹ năng đã hồi xong",
                tbuff: "Mục tiêu có hiệu ứng tăng giảm",
                tbuff_level: "Mục tiêu có hiệu ứng tăng giảm层数",
                tnobuff: "Mục tiêu không có hiệu ứng tăng giảm nào đó",
                tbufftime: "Thời gian hiệu lực của hiệu ứng tăng giảm mục tiêu",
            },
            logicDialogVisible: false,
            logicDialog: "",
            region: "",
            cmOptions: {
                tabSize: 4,
                lineNumbers: true,
                line: true,
                styleActiveLine: true,
                lineNumbers: true,
                mode: "text/x-macro",
                extraKeys: { Tab: "autocomplete" },
                matchBrackets: true,
                hintOptions: {
                    completeSingle: false,
                },
                // more CodeMirror options...
            },
            code: "",
        };
    },
    computed: {
        codemirror() {
            return this.$refs.cmEditor.codemirror;
        },
        client() {
            return this.$store.state.client;
        },
        maxCodeLength() {
            return this.client == 'std' ? 128 : 255;
        },
    },
    methods: {
        clickPlusCondition() {
            this.conditions.push({
                name: "",
                relation: "=",
                value: "",
                logic: "&",
                subname: "",
            });
        },
        clickMinusCondition(index) {
            this.conditions.splice(index, 1);
        },
        onConditionChange(index) {
            let thisName = this.conditions[index].name;
            let thisRelation = this.conditions[index].relation;
            if (thisName === "skill" || thisName === "noskill" || thisName === "last_skill") {
                if (thisRelation !== "=" && thisRelation !== "≠") {
                    // // 修改判断符号为等号
                    // let tmpArr = this.conditions
                    // tmpArr[index].relation = '='
                    // this.conditions = tmpArr
                    this.conditions[index].relation = "=";
                }
            }
        },
        insertLine() {
            let line = "/" + this.castType + " ";
            if (this.isConditional) {
                let allConditions = "[";
                for (let i = 0; i < this.conditions.length; ++i) {
                    let condition = this.conditions[i];
                    if (i !== 0) {
                        allConditions += condition.logic;
                    }
                    allConditions += condition.name;
                    if (this.needsConditionParams.subname.includes(condition.name)) {
                        allConditions = allConditions + ":" + condition.subname;
                    }
                    if (this.needsConditionParams.relation.includes(condition.name)) {
                        allConditions = allConditions + condition.relation;
                    }
                    if (this.needsConditionParams.value.includes(condition.name)) {
                        allConditions = allConditions + condition.value;
                    }
                }
                allConditions += "]";
                line = line + allConditions + " ";
            }
            line = line + this.skill + "\n";
            this.code += line.replace(/buff_level/g, "buff");
        },
        onCmCodeChange(value) {
            // this.codemirror.showHint();
        },
        showRealLogic() {
            if (this.conditions <= 2) {
                return false;
            } else {
                let allConditions = "";
                for (let i = 0; i < this.conditions.length; ++i) {
                    let condition = this.conditions[i];
                    if (i === this.conditions.length - 1) {
                        allConditions +=
                            // condition.logic === "&" ? " Và " : " Hoặc ";
                            condition.logic === "&" ? " & " : " | ";
                    } else if (i !== 0) {
                        allConditions +=
                            // condition.logic === "&" ? " Và（" : " Hoặc（";
                            condition.logic === "&" ? " &（" : " |（";
                    }
                    // allConditions += this.conditionValueName[condition.name];
                    allConditions += condition.name;
                    if (this.needsConditionParams.subname.includes(condition.name)) {
                        allConditions = allConditions + ":" + condition.subname;
                    }
                    if (this.needsConditionParams.relation.includes(condition.name)) {
                        allConditions = allConditions + condition.relation;
                    }
                    if (this.needsConditionParams.value.includes(condition.name)) {
                        allConditions = allConditions + condition.value;
                    }
                }
                for (let parenthesis = 0; parenthesis < this.conditions.length - 2; ++parenthesis) {
                    allConditions += "）";
                }
                this.logicDialog = allConditions.replace(/buff_level/g, "buff");
                this.logicDialogVisible = true;
            }
        },
        getUserId() {
            if (User.isLogin()) {
                this.uid = User.getInfo().uid;
            }
        },
    },
    components: {
        codemirror,
        AppLayout,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/macroeditor.less";
</style>
