import { $next } from "@jx3box/jx3box-common/js/https";

const API_PREFIX = `/api/next2`;
// 发布
function push(params) {
    return $next().post(`${API_PREFIX}/community/discussion/topic`, params);
}

function update(id, params) {
    return $next().put(`${API_PREFIX}/community/discussion/my/topic/item/${id}`, params);
}

function getMyList(params) {
    return $next().get(`${API_PREFIX}/community/discussion/my/topic/list`, { params });
}
function del(id) {
    return $next().delete(`${API_PREFIX}/community/discussion/my/topic/item/${id}`);
}

function pull(id) {
    return $next().get(`${API_PREFIX}/community/discussion/my/topic/item/${id}`);
}

function getAllCommunity(params) {
    return $next().get(`${API_PREFIX}/community/discussion/topic/list`, { params });
}

// 设置可见性
function setVisibility(id, status) {
    return $next().put(`${API_PREFIX}/community/discussion/my/topic/item/${id}/self-visit/${status}`);
}

// =============  我的回帖 =============

// 获取回帖列表
function getMyReplyList(params) {
    return $next().get(`${API_PREFIX}/community/discussion/my/reply/list`, { params });
}

// 获取我的回帖
function getMyReply(id) {
    return $next().get(`${API_PREFIX}/community/discussion/my/reply/item/${id}`);
}

// 删除我的回帖
function deleteMyReply(id) {
    return $next().delete(`${API_PREFIX}/community/discussion/my/reply/item/${id}`);
}

// 更新我的回帖
function updateMyReply(id, data) {
    return $next().put(`${API_PREFIX}/community/discussion/my/reply/item/${id}`, data);
}

// =============  我的评论 =============

// 获取评论列表
function getMyCommentList(params) {
    return $next().get(`${API_PREFIX}/community/discussion/my/comment/list`, { params });
}

// 删除我的评论
function deleteMyComment(id) {
    return $next().delete(`${API_PREFIX}/community/discussion/my/comment/item/${id}`);
}

export {
    push,
    getMyList,
    getAllCommunity,
    setVisibility,
    del,
    pull,
    update,
    getMyReplyList,
    getMyReply,
    deleteMyReply,
    updateMyReply,
    getMyCommentList,
    deleteMyComment,
};
