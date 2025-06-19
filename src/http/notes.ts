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

/**
 * 上传Note图片
 * @param {Object} params - 上传Note参数
 * @returns {Promise}
 */
export function uploadNoteImageApi(params: unknown) {
  return request.post('/upload-note-image', params)
}

/**
 * 删除Note图片
 * @param {Object} params - 删除Note参数
 * @returns {Promise}
 */
export function delteNoteApi(params: unknown) {
  return request.post('/deleteNotes', params)
}

