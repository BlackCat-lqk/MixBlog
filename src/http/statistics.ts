import request from '@/utils/request'

/**
 * 总数据统计
 * @returns {Promise} - Promise对象
 */
export function getStatisticsApi() {
  return request.get('/getStatistics')
}

/**
 * 获取访问详细信息
 * @returns {Promise} - Promise对象：userAgent, ipAddress，设备类型和IP地址
 */
export function getAllVisitDetailApi() {
  return request.get('/all-visits')
}
