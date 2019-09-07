import * as axiosApi from './axios'
//获取分销列表
const listDistribution=(params)=>axiosApi.postAixos('distribution/listDistribution',params)
//查看
const queryDistributionDetail=(params)=>axiosApi.postAixos('distribution/queryDistributionDetail',params)
//邀请一级客户
const queryCustomer=(params)=>axiosApi.postAixos('distribution/queryCustomer',params)
// const exportDistributors = () => axiosApi.getAxios('distribution/exportDistributors');
export default{
    listDistribution,
    queryDistributionDetail,
    queryCustomer,
    // exportDistributors
}