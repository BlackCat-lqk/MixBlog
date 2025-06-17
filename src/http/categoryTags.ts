import request from '@/utils/request'

/**
 * 新增分类标签
 * @param {Object} params - 新增参数
 * @returns {Promise}
 */
export function upsertCategoryTags(params: object) {
  return request.post('/upsertCategoryTags', params)
}

/**
 * 查询分类标签
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getCategoryTagsApi(params: string) {
  return request.get(`/getCategoryTags?type=${params}`)
}
