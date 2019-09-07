import axios from 'axios'

const MODULE = '/v1.0'

export default {
  /**
   * 一张图片上传
   * @param {*} phone
   */
  uploadImage(data) {
    return axios({
      url: `${MODULE}/upload`,
      method: 'POST',
      data,
      responseType: 'json'
    })
  },
  /**
   * 七牛上传配置URL
   * @param {*} type
   */
  getQiniuTokenUrl(type) {
    return `/V1.0/common/qiniu/${type}/qiniu_token`
  },
  getServerConfig(type = 1) {
    return axios({
      url: this.getQiniuTokenUrl(type),
      method: 'GET',
      responseType: 'json'
    }).then(res => {
      let data = res
      return {
        domain: data.data.domain_url,
        zoneUrl: this.getZoneUrl(data.data.qiniu_zone.up_urls),
        token: data.data.token
      }
    })
  },
  /**
   * 取七牛上传地址
   * @param {*} qiniuZone
   */
  getZoneUrl(qiniuZone) {
    if (Array.isArray(qiniuZone)) {
      return qiniuZone[0]
    }
    return String(qiniuZone)
  },
  /**
   * 生成url地址
   * @param {*} data
   * @param {*} response
   */
  generalUrl(data, response) {
    return `${data.domain}/${response.hash}`
  }
}
