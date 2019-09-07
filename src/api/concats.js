import * as axiosApi from './axios'
//人脉宝藏列表
const concatsList = (params) => axiosApi.postAixos('cream/personList', params);
//分类列表
const typeList = () => axiosApi.postAixos('cream/getCreamCategory');
//操作状态
const handel = (params) => axiosApi.postAixos('cream/handel', params);

export default {
  concatsList,
  typeList,
  handel
}
