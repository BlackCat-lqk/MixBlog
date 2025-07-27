import request from '@/utils/request'

/**
 * 新建图库数据
 * @param {Object}
 * @returns {Promise}
 */
export function createPhotoLibraryApi(params: Object) {
  return request.post('/createPhotoLibrary', params)
}

/**
 * 查询图库数据
 * @param {Object}
 * @returns {Promise}
 */
export function getPhotoLibraryApi() {
  return request.get('/getPhotoLibrary')
}

/**
 * 上传图库图片
 * @param {Object}
 * @returns {Promise}
 */
export function uploadPhotoImageApi(params: unknown) {
  return request.post('/upload-photo-library-image', params)
}

/**
 * 删除图库数据
 * @param {Object}
 * @returns {Promise}
 */
export function deletePhotoLibraryApi(params: unknown) {
  return request.delete(`/deletePhotoLibrary/${params}`)
}

/**
 * 博客图库添加评论
 * @param {Object}
 * @returns {Promise}
 */
export function addPhotoCommentApi(params: object) {
  return request.post('/photoLibrary/addComment', params)
}

/**
 * 博客图库删除评论
 * @param {Object}
 * @returns {Promise}
 */
export function delPhotoCommentApi(params: object) {
  return request.post('/photoLibrary/deleteComment', params)
}

/**
 * 博客图库点赞/取消点赞
 * @param {Object}
 * @returns {Promise}
 */
export function likePhotoApi(params: object) {
  return request.post('/photoLibrary/like', params)
}

/**
 * 博客图库新增浏览
 * @param {Object}
 * @returns {Promise}
 */
export function viewPhotoApi(params: object) {
  return request.post('/photoLibrary/view', params)
}
