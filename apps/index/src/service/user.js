import { $cms } from "@jx3box/jx3box-common/js/https";

function getProfile() {
    return $cms({ mute: true })
        .get("/api/cms/user/my/profile")
        .then((res) => {
            return res.data.data;
        });
}

function getMeta(key) {
    return $cms({ mute: true }).get("/api/cms/user/my/meta", {
        params: {
            key: key,
        },
    });
}

function setMeta(key, val) {
    return $cms({ mute: true }).post(
        "/api/cms/user/my/meta",
        { val: val },
        {
            params: {
                key: key,
            },
        }
    );
}

export { getProfile, getMeta, setMeta };
