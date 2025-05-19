/**
 *
 * @description 邮箱自定义校验
 * @param {string}
 * @returns {callback}
 */
export const validateEmail = (
  rule: unknown,
  value: string,
  callback: (error?: Error) => void,
): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    callback(new Error('请输入正确的邮箱地址'))
  } else {
    callback()
  }
}

/**
 *
 * @description 用户名称自定义校验
 * @param {string}
 * @returns {callback}
 */
export const validateUsername = (
  rule: unknown,
  value: string,
  callback: (error?: Error) => void,
): void => {
  const reg = /^[A-Za-z0-9]{2,10}$/g
  if (!reg.test(value)) {
    callback(new Error('用户名只能为2-10位数字或字母组合'))
  } else if (value.length < 1) {
    callback(new Error('用户名不能为空'))
  } else {
    callback()
  }
}
/**
 *
 * @description 密码自定义校验
 * @param {string}
 * @returns {callback}
 */
export const validatePassword = (
  rule: unknown,
  value: string,
  callback: (error?: Error) => void,
): void => {
  const reg = /[\u4e00-\u9fa5]/g
  if (value.length < 1) {
    callback(new Error('请输入密码！'))
  } else if (value.length < 6 || value.length > 16) {
    callback(new Error('密码长度为：6-16位！'))
  } else if (reg.test(value)) {
    callback(new Error('密码为数字、字母、符号'))
  } else {
    callback()
  }
}
/**
 *
 * @description 验证码自定义校验
 * @param {string}
 * @returns {callback}
 */
export const validateCode = (
  rule: unknown,
  value: string,
  callback: (error?: Error) => void,
): void => {
  if (!value || value.length != 6) {
    callback(new Error('请输入6位验证码'))
  } else {
    callback()
  }
}
