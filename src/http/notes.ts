import request from '@/utils/request'


/**
 * 新建Notes
 * @param {Object} params - 新建Notes参数
 * @returns {Promise}
 */
export function createNotesApi(params: Object) {
  return request.post('/createNote', params)
}

/**
 * 查询Notes
 * @param {Object} params - 查询Notes参数
 * @returns {Promise}
 */
export function getNotesApi(params: Object) {
  return request.post('/getNotes', params)
}

