import request from '@/utils/request'

/**
 * 注册/新增用户
 * @param {Object} params - 注册/新增参数
 * @returns {Promise}
 */
export function registerUser(params: {
  userName: string
  email: string
  password: string
}) {
  console.log(params)
  return request.post('/register', params)
}
