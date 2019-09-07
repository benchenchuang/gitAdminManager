import * as axiosApi from './axios'
//海报库分类列表
const mekeList = (params) => axiosApi.postAixos('manager/mekeList', params);
//标签列表
const labelList = () => axiosApi.getAxios('manager/getCircleMekeLabel');
//作品详情
const mekeInfo = (params) => axiosApi.postAixos('manager/mekeInfo', params);
//编辑作品
const editMekeInfo = (params) => axiosApi.postAixos('manager/editMekeInfo', params);
//第一级评论列表&&flag传1代表删除
const mekeCommentFirst = (params) => axiosApi.postAixos('manager/mekeCommentLog', params);
//子评论列表&&flag传1代表删除
const mekeCommentSon = (params) => axiosApi.postAixos('manager/mekeCommentLogReply', params);
//撤回作品
const backMekeInfo = (params) => axiosApi.postAixos('manager/checkMekeInfo', params);
//帮他发布
const circle = (params) => axiosApi.postAixos('manager/postCircle', params);
//置顶
const circleMekeSort = (params) => axiosApi.postAixos('Circle/getCircleMekeSort', params);
//取消置顶
const cancelcircleMekeSort = (id) => axiosApi.deleteAixos(`Circle/getCircleMekeSort/${id}`);
//获取人工审核开关状态
const manMadeStatus = () => axiosApi.getAxios('manager/getAutoCheck');
/**
 * 切换人工审核开关状态
 * @params
 * Integer id
 * 1代表开启，0为关闭
 */
const checkManMadeStatus = (id) => axiosApi.postAixos(`manager/autoCheck/${id}`);

/**
 * 刷僵尸粉数据
 */
//点赞
const jsZan = (params) => axiosApi.postAixos('robot/addCircleZan', params,1);
//收藏
const jsCollect = (params) => axiosApi.postAixos('robot/addCircleCollect', params,1);
//分享
const jsShare = (params) => axiosApi.postAixos('robot/addCircleShare', params,1);
//阅读量
const jsRead = (params) => axiosApi.postAixos('robot/addCircleReadCount', params,1);
//评论量
const jsComment = (params) => axiosApi.postAixos('robot/addCircleComment', params,1);
export default {
  mekeList,
  labelList,
  backMekeInfo,
  mekeInfo,
  editMekeInfo,
  mekeCommentFirst,
  mekeCommentSon,
  circle,
  circleMekeSort,
  cancelcircleMekeSort,
  manMadeStatus,
  checkManMadeStatus,

  jsZan,
  jsCollect,
  jsShare,
  jsRead,
  jsComment
}
