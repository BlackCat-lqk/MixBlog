import request from '@/utils/request'

/**
 * 注册用户
 * @param {Object} params - 注册参数
 * @returns {Promise}
 */
export function registerUser(params: {
  userName: string
  email: string
  code: string
  password: string
}) {
  return request.post('/register', params)
}
