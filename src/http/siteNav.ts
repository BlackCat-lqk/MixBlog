import request from '@/utils/request'

/**
 * 创建站点导航数据
 * @param {Object} params - 创建参数
 * @returns {Promise}
 */
export function createSiteApi(params: object) {
  return request.post('/createSiteNav', params)
}

/**
 * 获取站点导航数据
 * @returns {Promise}
 */
export function getSiteApi() {
  return request.get('/getSiteNav')
}
