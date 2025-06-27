import request from '@/utils/request'

/**
 * 总数据统计
 * @returns {Promise} - Promise对象
 */
export function getStatisticsApi() {
  return request.get('/getStatistics')
}
