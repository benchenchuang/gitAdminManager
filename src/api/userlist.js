import * as axiosApi from './axios'
//获取用户列表
const getUserList = (params) => axiosApi.postAixos('system/getUserList',params)
//获取所有行业
const getIndustryList=()=> axiosApi.getAxios('system/getIndustryList');
//改变状态值
const changeStauts = (params) => axiosApi.postAixos('system/changeStauts',params)
//获取二维码
 const createWxAqrCode=(id)=> axiosApi.getAxios(`mini/createWxAqrCode/${id}`);
//获取查看页详情
const getUserInfo=(id)=> axiosApi.getAxios(`system/getUserInfo/${id}`);
//获取邀请记录
const getOrderLog = (params) => axiosApi.postAixos('system/getOrderLog',params)
//获取行业和兴趣爱好
const getIndustryAndHobby=()=> axiosApi.getAxios('system/getIndustryAndHobby');
//提交
const changeUserInfoDetails = (params) => axiosApi.postAixos('system/changeUserInfoDetails',params)
//加粉丝数
const addFans = (params) => axiosApi.postAixos('robot/addFans',params)

//报名列表
const getList = (params) => axiosApi.postAixos('mgMadForSong/getList',params)
//获取所有省份
const dataGetProvince=()=> axiosApi.getAxios('mgMadForSong/dataGetProvince');
//获取所有市区
const dataGetCity=(id)=> axiosApi.getAxios(`mgMadForSong/dataGetCity/${id}`);
export default{
    getUserList,
    getIndustryList,
    changeStauts,
    createWxAqrCode,
    getUserInfo,
    getOrderLog,
    getIndustryAndHobby,
    changeUserInfoDetails,
    addFans,
    getList,
    dataGetProvince,
    dataGetCity
}