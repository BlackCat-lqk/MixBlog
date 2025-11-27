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
export function getBookDocApi(params: object) {
  return request.get(`/files`, { params })
}

/**
 * 获取私有书籍文件
 * @param {Object}
 * @returns {Promise}
 */
export function getPrivateBookDocApi(params: object) {
  return request.get(`/privateFiles`, { params })
}

/**
 * 删除书籍文件
 * @param {Object}
 * @returns {Promise}
 */
export function deleteBookDocApi(params: unknown) {
  return request.delete(`/files/${params}`)
}
