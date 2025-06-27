import request from '@/utils/request'
import axios from 'axios'

/**
 * 统计访问量记录
 * @param {Object} params - 统计访问量参数
 * @returns {Promise} - Promise对象：userAgent, ipAddress，设备类型和IP地址
 */
export function recordVisitApi(params: object) {
  return request.post('/record-visit', params)
}

/**
 * 获取统计访问量（今天和总数）
 * @param {Object} params - 统计访问量参数
 * @returns {Promise} - Promise对象：userAgent, ipAddress，设备类型和IP地址
 */
export function getVisitStatsApi() {
  return request.get('/visit-stats')
}


/**
 * 查询访问IP
 * @returns {Promise} - Promise对象
 */
export function getVisitorIpApi() {
  const service = axios.create({
  baseURL: '',
  timeout: 30000, // 请求超时时间
})
  return service.get('https://ipinfo.io/json')
}
