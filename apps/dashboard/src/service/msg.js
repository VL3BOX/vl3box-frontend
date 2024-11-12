import { $next } from "@jx3box/jx3box-common/js/https";
import qs from "qs";

function getMsgs(params) {
    return $next().get(`/api/messages`, { params });
}

function readMsg(id) {
    return $next().put(`/api/messages/read/${id}`);
}

function readAll() {
    return $next().put(`/api/messages/read`);
}

function removeMsg(id) {
    return $next().delete(`/api/messages/${id}`);
}

function getMsgUnread() {
    return $next({ mute: true }).get("/api/letter/unread/count");
}

function getCommentMsgDetail(id) {
    return $next().get(`/api/next2/comment/item/${id}`);
}

export { getMsgs, readMsg, readAll, removeMsg, getMsgUnread, getCommentMsgDetail };
