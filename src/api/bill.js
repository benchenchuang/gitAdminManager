import * as axiosApi from './axios'
//海报库分类列表
const galleryList = (params) => axiosApi.postAixos('personal/findPostersGalleryBySelect', params);
//删除海报库分类
const delPostersGallery = (id) => axiosApi.deleteAixos(`personal/deletePostersGallery/${id}`);
//添加海报库分类
const addPostersGallery = (params) => axiosApi.postAixos(`personal/addPostersGallery`, params);
//修改海报库分类
const editPostersGallery = (params) => axiosApi.putAxios(`personal/updatePostersGallery`, params);
//海报库分类=>图片列表
const galleryImgList = (params) => axiosApi.postAixos(`personal/findPostersGalleryImg`, params);
//海报库分类=>批量删除图片
const delPostersGalleryImg = (params) => axiosApi.putAxios(`personal/deletePostersGalleryImg`, params);
//海报库分类=>批量添加图片
const addPostersGalleryImg = (params) => axiosApi.postAixos(`personal/addPostersGalleryImg`, params);
export default {
  galleryList,
  delPostersGallery,
  addPostersGallery,
  editPostersGallery,
  galleryImgList,
  delPostersGalleryImg,
  addPostersGalleryImg
}
