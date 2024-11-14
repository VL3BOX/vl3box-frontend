import { $helper, $cms, $node } from "@jx3box/jx3box-common/js/https";

// 获取列表
function getItemPlans(params) {
    return $cms()
        .get(`/api/cms/app/item-plan`, { params })
        .then((res) => {
            return res.data.data;
        });
}
// 单个清单搜索
function getItemPlanID(id) {
    return $cms()
        .get(`/api/cms/app/item-plan/${id}`)
        .then((res) => {
            return res.data.data;
        });
}
// 删除清单
function delItemPlan(id) {
    return $cms().delete(`/api/cms/app/item-plan/${id}`);
}

// 多个清单搜索
// function searchItemsID(params) {
// 	return $helper()
// 		.get(`/api/items`, { params })
// 		.then((res) => {
// 			return res.data.data;
// 		});
// }

// 获取我的清单
function getMyPlans(params) {
    return $cms()
        .get(`/api/cms/app/item-plan/mine`, { params })
        .then((res) => {
            return res.data.data;
        });
}
function updatePlan(id, data) {
    return $cms().put(`/api/cms/app/item-plan/${id}`, data);
}

// 新增清单
function addMyPlan(data) {
    return $cms().post(`/api/cms/app/item-plan`, data);
}

export { getItemPlans, getItemPlanID, delItemPlan, getMyPlans, updatePlan, addMyPlan };
