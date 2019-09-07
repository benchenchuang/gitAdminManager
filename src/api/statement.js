import * as axiosApi from './axios'
export default{
    //觅客圈统计
    getCircleList:(params)=>{
        return axiosApi.postAixos('submitMeke',params);
    },
    downLoadCircle:(params)=>{
        return axiosApi.postAixos('manager/meke/export',params)
    },
    //交易数据
    getTradeData:(params)=>{
        return axiosApi.postAixos('distribution/queryBusinessUp',params)
    },
    //用户交易构成
    getCustomData:(params)=>{
        return axiosApi.postAixos('distribution/queryBusinessDown',params)
    },
    //搜索统计
    getSearchList:(params)=>{
        return axiosApi.postAixos('cream/queryCreamSearch',params)
    }
}