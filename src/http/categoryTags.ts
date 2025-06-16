import request from '@/utils/request'

/**
 * 新增分类标签
 * @param {Object} params - 新增参数
 * @returns {Promise}
 */
export function upsertCategoryTags(params: object) {
  return request.post('/upsertCategoryTags', params)
}
