import { axios, $, $cms } from "./axios";
import { __cms } from "@jx3box/jx3box-common/data/jx3box.json";
import User from "@jx3box/jx3box-common/js/user";

function checkEmail(email) {
    return $.get("api/cms/user/account/email/valid", {
        params: {
            email: email,
        },
    });
}

function registerByEmail(data) {
    return $cms({
        headers: {
            "user-device-fingerprint": User.getDeviceFingerprint(),
        },
    }).post("api/cms/user/account/email/register", {
        email: data.email,
        password: data.pass,
        invitation: data.invite,
    }, { params: { app: 'jx3box' } });
}

function loginByEmail(data) {
    return $cms({
        headers: {
            "user-device-fingerprint": User.getDeviceFingerprint(),
        },
    }).post("api/cms/user/account/email/login", {
        email: data.email,
        password: data.pass,
    }, { params: { app: 'jx3box' } });
    // 必须以携带模式请求
}

function verifyEmail(data) {
    return $.put("api/cms/user/account/email/active", {
        token: data.token,
    });
}

export { checkEmail, registerByEmail, loginByEmail, verifyEmail };
