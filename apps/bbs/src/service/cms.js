import { $cms } from "@jx3box/jx3box-common/js/https";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import axios from "axios";

function getMenu(key) {
    return $cms().get(`/api/cms/config/menu/${key}`);
}

function getAuthorInfo() {}

// 获取自定义主题
function getTopicBucket(params) {
    return $cms().get(`/api/cms/topic/bucket`, { params });
}

const getConfigBanner = (params) => {
    return $cms().get(`api/cms/config/banner`, {
        params,
    });
};

//获取装扮
function getDecoration(params) {
    return $cms().get(`/api/cms/user/decoration`, {
        params,
    });
}

const getUserList = (params) => $cms().get(`/api/cms/user/list`, { params });

export { getMenu, getAuthorInfo, getTopicBucket, getConfigBanner, getUserList, getDecoration };
