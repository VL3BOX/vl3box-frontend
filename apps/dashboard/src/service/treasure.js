import { $team } from "@jx3box/jx3box-common/js/https";

// 获取个人团队成绩证书列表
function teamCertificationRecordList(params) {
    return $team().get("/api/team/team-certification-record/list", { params });
}

export { teamCertificationRecordList };
