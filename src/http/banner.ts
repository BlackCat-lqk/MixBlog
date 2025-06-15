import request from '@/utils/request'

/**
 * 新建Banner配置
 * @param {Object} params - 新建Banner配置参数
 * @returns {Promise}
 */
export function createBanner(params: {
  uId: string
  email: string
  sub: string
  introduction: string
  mainBtnName: string
  childBtnName: string
  mainBtnUrl: string
  childBtnUrl: string
  cover: string
}) {
  return request.post('/createBanner', params)
}

/**
 * 查询Banner配置
 * @param {Object} params - 新建Banner配置参数
 * @returns {Promise}
 */
export function getAllBanners() {
  return request.get('/getBanner')
}

/**
 * 删除Banner配置
 * @param {Object} params - 删除Banner配置参数
 * @returns {Promise}
 */
export function deleteBanner(params: { ids: unknown }) {
  return request.post('/deleteBanner', params)
}

/**
 * 更新Banner配置
 * @param {Object} params - 更新Banner配置参数
 * @returns {Promise}
 */
export function updateBanner(
  _id: String,
  data: Partial<{
    title: string
    sub: string
    introduction: string
    mainBtnName: string
    childBtnName: string
    mainBtnUrl: string
    childBtnUrl: string
    cover: string
  }>,
) {
  return request.put(`/updateBanner/${_id}`, data)
}

/**
 * 上传Banner图片
 * @param {Object} params - 上传Banner图片参数
 * @returns {Promise}
 */
export function uploadBannerCoverApi(params: unknown) {
  return request.post('upload-banner-cover', params)
}
