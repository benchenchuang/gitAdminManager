import axios from 'axios';

axios.defaults.timeout = 5000;
export const baseUrl = axios.defaults.baseURL = process.env.api;

import router from '../router/index'
import {webStorage} from './webStorage'
//发送拦截
axios.interceptors.request.use(
  config => {
    let sessionId = webStorage.getLocal('sessionId') || '';
    config.headers.session_id = sessionId;
    return config;
  }, err => {
    return Promise.reject(err);
  }
);
//接收拦截
axios.interceptors.response.use(
  response => {
    if (response.data.errorCode == 102) {
      // 清除token
      webStorage.clearOneLocal('sessionId');
      setTimeout(() => {
        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        });
      }, 1000);
    }
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.errorCode) {
        case 401:
          router.replace({
            path: "/login",
            query: {
              redirect: router.currentRoute.fullpath
            }
          });
          break;
        case 102:
          // 清除token
          setTimeout(() => {
            router.replace({
              path: '/login',
              query: {
                redirect: router.currentRoute.fullPath
              }
            });
          }, 1000);
          break;
        // 其他错误
        default:
          break;
      }
    }
    return Promise.reject(error.response.data)
  }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function getAxios(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(`/V2.0/${url}`, {
      params: params
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function postAixos(url, data = {}, timeOut = 0) {
  return new Promise((resolve, reject) => {
    axios.post(`/V2.0/${url}`, data, {timeout: timeOut == 0 ? 5000 : 1000 * 60 * 2})
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function deleteAixos(url) {
  return new Promise((resolve, reject) => {
    axios.delete(`/V2.0/${url}`)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patchAxios(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(`/V2.0/${url}`, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function putAxios(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(`/V2.0/${url}`, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}
