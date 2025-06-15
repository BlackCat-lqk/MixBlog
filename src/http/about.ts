import request from '@/utils/request'

/**
 * 新建或更新About配置
 * @param {Object} params - 新建或更新About配置参数
 * @returns {Promise}
 */
export function upsertAboutApi(params: {
  uId: string
  email: string
  intro: string
  tags: string
  modules: object[]
  cover: string
}) {
  return request.post('/upsertAbout', params)
}

/**
 * 查询About配置
 * @param {Object} params - 查询About配置参数
 * @returns {Promise}
 */
export function getAboutConfigApi(params: { email: string; uId: string }) {
  return request.post('/getAbout', params)
}
