import http from '../http/request'
//获取部门列表
export async function getBankNameListApi(params) {
    return await http.getRestApi("/api/outlets/getBankNameByDeptId",params)
}
export async function getBranchNameListApi(params) {
    return await http.getRestApi("/api/outlets/getBrachNameByBankId",params)
}
export async function addbankvisitApi(params) {
    return await http.post("/api/outlets",params)
}
export async function getCalendarDataByUserIdApi(params) {
    return await http.getRestApi("/api/outlets/getCalendarByUserIdData",params)
}