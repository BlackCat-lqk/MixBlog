import request from '@/utils/request'

/**
 * 新建Feedback
 * @param {Object} params
 * @returns {Promise}
 */
export function upsertFeedbackApi(params: object) {
  return request.post('/createFeedback', params)
}

/**
 * 更新Feedback状态
 * @param {Object} params
 * @returns {Promise}
 */
export function feedbackStatusApi(params: string, data: object) {
  return request.put(`/feedback/${params}/status`, data)
}

/**
 * 获取Feedback
 * @returns {Promise}
 */
export function getFeedbackApi() {
  return request.get('/getAllFeedback')
}
