import * as axiosApi from './axios'
//修改账户信息
const editUserCount=(params)=>axiosApi.postAixos('system/accountSetting',params)
//获取群发信息
const getMassGroup= (params) => axiosApi.postAixos('system/getMassGroup',params);
//行业
const industry= (params) => axiosApi.postAixos('global/industry',params);
//举报
const report= (params) => axiosApi.postAixos('global/report',params);
//兴趣爱好
const interest= (params) => axiosApi.postAixos('global/interest',params);
//提交佣金比例
const saveDistributionCfg= (params) => axiosApi.putAxios('global/saveDistributionCfg',params);
//查询佣金比例
const queryDistributionCfg = () => axiosApi.getAxios('global/queryDistributionCfg');

export default{
    editUserCount,
    getMassGroup,
    industry,
    report,
    interest,
    saveDistributionCfg,
    queryDistributionCfg
}