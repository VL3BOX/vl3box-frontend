// 获取作品ID
function getAppId() {
    let url = location.href?.split("/");
    let len = url.length;
    let id = url[len] || url[len - 1];
    return ~~id;
}

export { getAppId };
