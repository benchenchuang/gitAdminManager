import * as axiosApi from './axios'

export default{
    //首页获取每日人数
    getDailyNum:()=>axiosApi.getAxios('duration/dailyNum'),
    //首页获取指定日期人数
    getNumByDay:(date)=>axiosApi.getAxios(`duration/aggNumByDay?day=${date}`),
    //新增间隔时间段
    addDuration:(params)=>axiosApi.postAixos('duration/addDuration',params),
    //查询所有日期段
    getDayTimes:(params)=>axiosApi.postAixos('duration/queryDuration',params),
    //查询所有日期
    getAllDays:()=>axiosApi.getAxios('duration/queryDay'),
    //查询某天时间段
    getOneDay:(params)=>axiosApi.getAxios('duration/queryDuration',params),
    //查询所有用户信息
    getAllUsers:(params)=>axiosApi.postAixos(`user/queryAll`,params),
    //修改预约人数
    updateLimitedNum:(params)=>axiosApi.getAxios(`duration/updateLimitedNum`,params),
    //删除某个时间段
    delDayTime:(params)=>axiosApi.getAxios(`duration/deleteById`,params),
    //提示信息获取与更新
    getTipMessages:()=>axiosApi.getAxios('tip/queryTip'),
    saveTipMessages:(params)=>axiosApi.postAixos('tip/updateTip',params),
}