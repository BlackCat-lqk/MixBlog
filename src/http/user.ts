import request from '@/utils/request'

/**
 * 注册/新增用户
 * @param {Object} params - 注册/新增参数
 * @returns {Promise}
 */
export function registerUser(params: { userName: string; email: string; password: string }) {
  return request.post('/register', params)
}

/**
 * 获取所有用户
 * @returns {Promise}
 */
export function getAllUsers() {
  return request.get('/getAllUsers')
}

/**
 * 批量删除用户
 * @returns {Promise}
 */
export function deleteUsers(params: { ids: unknown }) {
  return request.post('/deleteUsers', params)
}

/**
 * 根据邮箱更新用户信息
 * @returns {Promise}
 */
export function updateUsers(
  email: string,
  data: Partial<{ userName: string; role: string; status: string }>,
) {
  return request.put(`/updateUsers/${email}`, data)
}

/**
 * 用户登录
 * @returns {Promise}
 */
export function loginUserApi(params: { email: string; password: string}) {
  return request.post('/login', params)
}
