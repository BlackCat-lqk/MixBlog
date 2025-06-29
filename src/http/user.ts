import request from '@/utils/request'
import axios from 'axios'

/**
 * 新增用户
 * @param {Object} params - 新增参数
 * @returns {Promise}
 */
export function createUser(params: { userName: string; email: string; password: string }) {
  return request.post('/createUser', params)
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
  data: Partial<{
    userName: string
    role: string
    status: string
    avatar: string
    sex: string
    birthday: null
    desc: string
    updatedAt: string
  }>,
) {
  return request.put(`/updateUsers/${email}`, data)
}

/**
 * 用户登录
 * @returns {Promise}
 */
export function loginUserApi(params: { email: string; password: string }) {
  return request.post('/login', params)
}

/**
 * 用户注册
 * @returns {Promise}
 */
export function registerUserApi(params: {
  userName: string
  email: string
  code: string
  password: string
}) {
  return request.post('/register', params)
}

/**
 * 用户获取邮箱验证码（注册）
 * @returns {Promise}
 */
export function getEmailCodeApi(params: { email: string }) {
  return request.post('/getEmailCode', params)
}

/**
 * 用户获取邮箱验证码（找回密码）
 * @returns {Promise}
 */
export function getResetEmailCodeApi(params: { email: string }) {
  return request.post('/getResetEmailCode', params)
}

/**
 * 校验邮箱和验证码（找回密码）
 * @returns {Promise}
 */
export function getVerifyEmailCodeApi(params: { email: string; code: string }) {
  return request.post('/verifyEmailCode', params)
}

/**
 * 重置密码接口
 * @returns {Promise}
 */
export function resetPasswordApi(params: { email: string; code: string; newPassword: string }) {
  return request.post('/resetPassword', params)
}

/**
 * 用户退出登录
 * @returns {Promise}
 */
export function logOutUserApi() {
  return request.post('/logOutUser')
}

// 校验用户身份
export function verifyUserApi() {
  return request.get('/verifyIdentity')
}
