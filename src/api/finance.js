import * as axiosApi from './axios'
export default{
    //获取佣金列表
    getFinanceList:(params)=>{
        return axiosApi.postAixos('distribution/listWithdrawalRecord',params);
    },
    //佣金列表导出
    exporRecord:()=>{
        return axiosApi.postAixos('distribution/exportWithdrawalRecord');
    },
    //查询对账信息 是否有审核人的信息
    getDealStatus:(id)=>{
        return axiosApi.getAxios(`distribution/queryDistributionCheck/${id}`);
    },
    //提交审核 checkStatus  handleRemark withdrawalRecordId
    postDealRecord:(params)=>{
        return axiosApi.postAixos('distribution/updateWithdrawalRecord',params)
    }
}
