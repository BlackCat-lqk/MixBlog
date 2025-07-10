import request from '@/utils/request'
/**
 * 上传书籍文件
 * @param {Object}
 * @returns {Promise}
 */
export function uploadBookDocApi(params: unknown) {
  return request.post('/upload', params)
}

/**
 * 获取书籍文件
 * @param {Object}
 * @returns {Promise}
 */
export function getBookDocApi() {
  return request.get('/files')
}

/**
 * 删除书籍文件
 * @param {Object}
 * @returns {Promise}
 */
export function deleteBookDocApi(params: unknown) {
  return request.delete(`/files/${params}`)
}

