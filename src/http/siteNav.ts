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
export function getSiteApi(params: object) {
  return request.get('/getSiteNav', { params })
}

/**
 * 获取站点导航数据,管理员用
 * @returns {Promise}
 */
export function getSiteAdminApi() {
  return request.get('/getSiteNavAdmin')
}

/**
 * 批量删除站点导航数据
 * @param {Object}
 * @returns {Promise}
 */
export function delSiteNavApi(params: object) {
  return request.post('/deleteSiteNav', params)
}

/**
 * 根据ID更新导航数据
 * @param {Object}
 * @returns {Promise}
 */
export function updateSiteNavApi(id: string, params: object) {
  return request.post(`/updateSiteNav/id=${id}`, params)
}
