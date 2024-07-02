//import { Notification } from 'element-ui';
import { __Links, __next } from "@jx3box/jx3box-common/data/jx3box.json"
import { Notification } from "element-ui"
import { $pay } from "@jx3box/jx3box-common/js/https"


export const GET = function (url, queryParams) {
    let options = {
        "method": "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }
    return __fetch(url, queryParams, options)
}

var postRecord = {}

export const POST = function (url, queryParams, body) {

    if (!postRecord[url]) {
        postRecord[url] = {
            lastest: Date.now(),
            count: 0
        }
        // 60 秒内发送评论超过10条
    } else if (Date.now() - postRecord[url].lastest < 60 * 1000) {

        if (postRecord[url].count >= 6) {
            Notification.warning({
                title: "系统",
                message: "你单身多久了? 动作这么快, 系统处理不过来 ( T_T )",
                duration: 3000,
                position: "bottom-right"
            })
            return new Promise((reslove, reject) => {
                reject()
            })
        } else {
            postRecord[url].count = postRecord[url].count + 1
        }

    } else if (Date.now() - postRecord[url].lastest > 60 * 1000) {
        postRecord[url] = {
            lastest: Date.now(),
            count: 0
        }
    }
    let options = {
        "method": "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
    return __fetch(url, queryParams, options)
}
export const PUT = function (url, queryParams, body) {
    let options = {
        "method": "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
    return __fetch(url, queryParams, options)
}

export const DELETE = function (url, queryParams) {
    let options = {
        "method": "DELETE"
    }
    return __fetch(url, queryParams, options)
}

function __fetch(url, queryParams, options) {
    let domain = process.env.NODE_ENV == "production" ? __next : "/"
    if (domain[domain.length - 1] == "/") {
        domain = domain.substring(0, domain.length - 1)
    }
    url = domain + url
    url = url.replace("/api/", "/api/next2/")
    options.credentials = 'include'
    if (queryParams) {
        let queryQueue = []
        Object.keys(queryParams).forEach((key) => {
            queryQueue.push(key + "=" + queryParams[key])
        })
        let domain = __next
        if (domain[domain.length - 1] == "/") {
            domain = domain.substring(0, domain.length - 1)
        }
        url = url + "?" + queryQueue.join("&")
    }
    return fetch(url, options).then((resp) => {
        switch (resp.status) {
            case 200:
                break
            case 401:
                window.location.href = __Links.account.login + "?redirect=" + encodeURIComponent(window.location.href)
                throw new Error("错误:" + resp.statusText)
            case 403:
                window.location.href = __Links.account.login + "?redirect=" + encodeURIComponent(window.location.href)
                throw new Error("错误:" + resp.statusText)
            case 423:
                window.location.href = __Links.account.email_verify + "?redirect=" + encodeURIComponent(window.location.href)
                throw new Error("错误:" + resp.statusText)
            case 406:
                resp.text().then((body) => {
                    Notification.warning({
                        title: "系统",
                        message: body || "提交内容不合法,请重新提交",
                        duration: 3000,
                        position: "bottom-right"
                    })
                })

                throw new Error("错误:" + resp.statusText)
            default:
                resp.text().then((body) => {
                    Notification.error({
                        title: "系统:" + resp.statusText,
                        message: body || "系统错误,请稍后重试!",
                        duration: 3000,
                        position: "bottom-right"
                    })
                })

                throw new Error("错误:" + resp.statusText)
        }
        let contentType = resp.headers.get("Content-Type")
        contentType = contentType && contentType.split(";").shift()
        switch (contentType) {
            case "application/json":
                return resp.json().then((data) => {
                    if (data && data.code > 0 && data.msg != "") {
                        Notification.warning({
                            title: "提示",
                            message: data.code + ":" + data.msg,
                            duration: 3000,
                            position: "bottom-right"
                        })
                        return null
                    }
                    return data
                })
            default:
                return resp.text()
        }
    })
}

export const getHistorySummary = (postType, postId) => {
    return $pay().get(`/api/inspire/article/${postType}/${postId}/history/summary`)
}