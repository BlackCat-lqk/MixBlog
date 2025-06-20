import request from '@/utils/request'

/**
 * 上传博客文章封面图片
 * @param {Object} params - 上传博客文章封面片参数
 * @returns {Promise}
 */
export function uploadArticleCoverApi(params: unknown) {
  return request.post('/upload-article-cover', params)
}

/**
 * 新建BlogArtile文章
 * @param {Object} params - 新建BlogArtile配置参数
 * @returns {Promise}
 */
export function createBlogArtileApi(params: {
  uid: string
  email: string
  category: string
  tags: (string | number)[]
  cover: string
  title: string
  intro: string
  content: string
  status: string
}) {
  return request.post('/createBlogArticle', params)
}

// 获取所有BlogArticle文章
export function getAllBlogArticleApi() {
  return request.get('/articles-with-stats')
}

/**
 * 删除博客文章封面图片
 * @param {Object} params - 删除博客文章封面片参数
 * @returns {Promise}
 */
export function deleteBlogArticleApi(params: { _id: string }) {
  return request.post('/deleteBlogArticle', params)
}

/**
 * 更新博客文章
 * @param {Object} 根据_id更新 - 更新博客文章参数
 * @returns {Promise}
 */
export function updateBlogArticleApi(params: Object) {
  return request.post('/updateBlogArticle', params)
}
