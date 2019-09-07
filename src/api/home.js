import * as axiosApi from './axios'

export default{
    //用户登录
    userLogin:(params) => axiosApi.postAixos('system/login',params),
    //用户登出
    loginOut:()=> axiosApi.getAxios('system/login'),
    //获取待处理事务
    getDealEvents : () =>axiosApi.getAxios('index/dataCenter'),
    //用户登录日志
    getLogs:(params) => axiosApi.postAixos('system/getLoginLog',params),
    //获取用户信息
    getUserInfo : (id)=>axiosApi.getAxios(`system/getInformation/${id}`),
    //获取实时概况
    getTotalInfo:()=> axiosApi.getAxios('index/dataTop'),
    //获取首页echarts //1今日 2本周 3本月 4 自定义时间
    getEchartsData :(params)=>axiosApi.postAixos('index/dataEchaets',params),
    //成员管理
    getMemberList: (params) => axiosApi.postAixos('system/getAdminSelect',params),
    //更改成员启用状态
    changeMemberStatus : (id,status) => axiosApi.getAxios(`system/accounStatus?id=${id}&status=${status}`),
    //删除成员
    delMember : (id) => axiosApi.getAxios(`system/delAccount/${id}`),
    //添加/编辑成员
    addMember : (params) => axiosApi.postAixos('system/addAdmin',params),
    //企业申请列表
    getEnterpriseList:(params) => axiosApi.postAixos('enterprise/getEnterpriseList',params)
}