import request from '@/utils/request'

/**
 * 新建或更新slogan配置
 * @param {Object} params - 新建或更新slogan配置参数
 * @returns {Promise}
 */
export function upsertSloganApi(params: {
  logoPicture: string
  logoName: string
  sloganTitle: string
  sloganSub1: string
  sloganSub2: string
  cover: string
}) {
  return request.post('/upsertSlogan', params)
}

/**
 * 查询Slogan配置
 * @param {Object} params - 查询Slogan配置参数
 * @returns {Promise}
 */
export function getSloganApi() {
  return request.get('/getSlogan')
}
