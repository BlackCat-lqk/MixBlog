import request from '@/utils/request'

/**
 * 获取笔记列表数据
 * @param {Object} params - 注册参数
 * @returns {Promise}
 */
export function apiNotesList() {
  return request.get('/notes/list')
}

/**
 * 获取单个笔记详情
 * @param {Object} params - 注册参数
 * @returns {Promise}
 */
export function apiNotesDetail(id: string) {
  return request.get(`/notes/id=${id}`)
}
