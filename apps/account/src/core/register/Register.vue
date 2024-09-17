<template>
    <div class="m-card" id="app">
        <el-card class="box-card">
            <CardHeader />
            <Msg />
            <main v-if="success == null" class="m-main">
                <form ref="registerForm">
                    <!-- 账号 -->
                    <div class="u-email">
                        <el-input class="u-text u-email" v-model="email" placeholder="邮箱地址" minlength="3" maxlength="50" type="email" @change="checkEmail">
                            <template slot="prepend">
                                <i class="el-icon-message"></i>
                                <!-- <img class="i-mail" svg-inline src="../../assets/img/mail.svg" /> -->
                            </template>
                        </el-input>
                        <i v-show="email_available == true" class="el-icon-success u-ok"></i>
                        <div class="u-tip">
                            <el-alert v-show="email_validate == false" :title="email_validate_tip" type="error" show-icon :closable="false"></el-alert>
                            <el-alert v-show="email_available == false" :title="email_available_tip" type="error" show-icon :closable="false"></el-alert>
                        </div>
                    </div>

                    <!-- 密码 -->
                    <div class="u-pass">
                        <el-input class="u-text" placeholder="输入密码" v-model="pass" show-password @input="checkPass">
                            <template slot="prepend">
                                <i class="el-icon-lock"></i>
                                <!-- <img class="i-pass" svg-inline src="../../assets/img/pass.svg" /> -->
                            </template>
                        </el-input>
                        <div class="u-tip">
                            <el-alert v-show="pass_validate == false" :title="pass_validate_tip" type="error" show-icon :closable="false"></el-alert>
                        </div>
                    </div>

                    <!-- 邀请码 -->
                    <div class="u-invite">
                        <el-input class="u-text" placeholder="邀请码（非必填）" v-model="invite">
                            <template slot="prepend">
                                <i class="el-icon-present"></i>
                            </template>
                        </el-input>
                    </div>

                    <div class="u-terms">
                        <el-checkbox v-model="agreement" class="u-checkbox">
                          我已阅读并同意
                          <a href="/about/license" target="_blank">《用户协议》</a>、<a href="/about/privacy" target="_blank">《隐私政策》</a>、<a href="/about/treaty" target="_blank">《创作公约》</a>
                        </el-checkbox>
                    </div>

                    <!-- 提交 -->
                    <el-button class="u-submit u-button" type="primary" @click="submit" :disabled="!ready">
                      注册
                    </el-button>
                </form>
                <footer class="m-footer">
                    <p class="u-login">
                      已有账号?
                      <a :href="login_url">登录 &raquo;</a>
                    </p>
                    <p class="u-resetpwd">
                        <a href="../password_reset">忘记密码?</a>
                    </p>
                </footer>
            </main>

            <main v-if="success == true" class="m-main">
                <el-alert title="注册成功" type="success" description="一封邮箱验证的邮件已发送至您的邮箱,请注意查收" show-icon :closable="false"> </el-alert>
                <a class="u-skip el-button u-button el-button--primary" :href="login_url">立即登录</a>
            </main>

            <main v-if="success == false" class="m-main">
                <el-alert title="注册失败" type="error" :description="failtips" show-icon :closable="false"> </el-alert>
                <el-button class="u-button u-submit" type="primary" @click="reset">返回</el-button>
            </main>
        </el-card>
        <Bottom />
    </div>
</template>

<script>
const { validator } = require("sterilizer");
import CardHeader from "@/components/CardHeader.vue";
import {checkEmail, registerByEmail} from "@/service/email.js";
import {__Root} from "@jx3box/jx3box-common/data/jx3box.json";
import Msg from "@/components/Msg.vue";

export default {
    name: "Register",
    data: function () {
        return {
            email: "",
            email_validate: null,
            email_validate_tip: "必须为有效的Email,长度限3-50个字符",
            email_available: null,
            email_available_tip: "邮箱地址已被使用",

            pass: "",
            pass_validate: null,
            pass_validate_tip: "密码有效长度为6-50个字符",

            invite: "",

            success: null,
            failtips: "请求异常,请重试",

            homepage: __Root,
            redirect: "",

            agreement: false,
        };
    },
    computed: {
        ready: function () {
            return this.email_validate && this.email_available && this.pass_validate && this.agreement;
        },
        login_url: function () {
            return "../login?redirect=" + this.redirect;
        },
    },
    methods: {
        checkEmail: function () {
            // 如果为空
            if (this.email == "") {
                this.email_validate = null;
                this.email_available = null;
                return;
            }

            // 校验格式
            let result = validator(this.email, {
                isEmail: true,
                len: [3, 50],
            });
            this.email_validate = result;

            // 检查可用性
            if (result) {
                checkEmail(this.email).then((res) => {
                    this.email_available = !res.data.data.isExist;
                });
            } else {
                this.email_available = null;
            }
        },
        checkPass: function () {
            // 如果为空
            if (this.pass == "") {
                this.pass_validate = null;
                return;
            }

            // 校验格式
          this.pass_validate = validator(this.pass, {
              len: [6, 50],
            });
        },
        submit: function () {
            if (this.ready) {
                registerByEmail({
                    email: this.email,
                    pass: this.pass,
                    invite: this.invite,
                })
                    .then((res) => {
                        if (!res.data.code) {
                            this.success = true;
                        } else {
                            this.success = false;
                            this.failtips = res.data.msg;
                        }
                    })
                    .catch((err) => {
                        this.success = false;
                        this.failtips = "网络请求异常,请稍后重试";
                    });
            }
        },
        reset: function () {
            this.success = null;
            this.agreement = false;
        },
        checkDirect: function () {
            let search = new URLSearchParams(document.location.search);
            let redirect = search.get("redirect");
            this.redirect = redirect ? redirect : this.homepage;
            /*if (redirect) {
                this.redirect = redirect;
            } else {
                this.redirect = this.homepage;
            }*/
        },
    },
    filters: {},
    mounted: function () {
        this.checkDirect();
    },
    components: {
        CardHeader,
        Msg,
    },
};
</script>

<style lang="less">
@import "../../assets/css/common.less";
@import "../../assets/css/card.less";
@import "../../assets/css/register.less";
</style>
