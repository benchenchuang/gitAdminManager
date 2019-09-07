import * as axiosApi from './axios'
export default{
    createRobots:(num)=>{
        return axiosApi.getAxios(`robot/addRobot/${num}`)
    },
    getRobotsList:(params)=>{
        return axiosApi.postAixos('robot/robotList',params)
    }
}