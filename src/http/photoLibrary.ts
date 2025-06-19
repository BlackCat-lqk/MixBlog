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

