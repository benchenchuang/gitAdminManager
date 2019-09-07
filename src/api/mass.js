import * as axiosApi from './axios'
export default{
    //添加 编辑模板
    addMessage:(params)=>{
        return axiosApi.postAixos('addOrChangeMessageLog',params);
    },
    //获取模板消息列表
    getMessageList:(params)=>{
        return axiosApi.postAixos('getMessageLog/list',params);
    },
    //查询模板消息
    getMessageInfo:(params)=>{
        return axiosApi.postAixos(`getMessageLogById`,params);
    }
}