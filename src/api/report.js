import * as axiosApi from './axios'
//举报列表
const reportList = (params) => axiosApi.postAixos('mgToReport/reportList', params);
//举报类型列表 1为名片举报，2为作品举报
const reportTypeList = (num) => axiosApi.getAxios(`mgToReport/getReport/${num}`);
//处理举报
const handelReport = (params) => axiosApi.postAixos('mgToReport/handelReport', params);
export default {
  reportList,
  reportTypeList,
  handelReport
}
