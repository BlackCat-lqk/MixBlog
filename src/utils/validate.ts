/**
 *
 * @description 邮箱自定义校验
 * @param {String}
 * @returns {Boolean | Error}
 */
export const validateEmail = (rule:unknown, value: string): boolean | Error => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (value === '') {
    return new Error('请输入邮箱地址')
  }else if(!emailRegex.test(value)){
    return new Error('请输入正确的邮箱地址')
  }else {
    return true
  }
}

/**
 *
 * @description 用户名称自定义校验
 * @param {String}
 * @returns {Boolean | Error}
 */
export const validateUsername = (rule:unknown, value: string): boolean | Error => {
  const reg = /^[A-Za-z0-9]{2,10}$/g
  if (value === '') {
    return new Error('用户名不能为空')
  }else if(!reg.test(value)){
    return new Error('用户名只能为2-10位数字或字母组合')
  }else {
    return true
  }
}
/**
 *
 * @description 密码自定义校验
 * @param {String}
 * @returns {Boolean | Error}
 */
export const validatePassword = (rule:unknown, value: string): boolean | Error => {
  const reg = /[\u4e00-\u9fa5]/g
  if (value === '') {
    return new Error('请输入密码！')
  }else if(reg.test(value)){
    return new Error('密码为数字、字母、符号')
  }else if(value.length < 6 || value.length > 20) {
    return new Error('密码长度为：6-16位！')
  }else {
    return true
  }
}
/**
 *
 * @description 验证码自定义校验
 * @param {String}
 * @returns {Boolean | Error}
 */
export const validateCode = (rule:unknown, value: string): boolean | Error => {
  if (!value || value.length != 6) {
    return new Error('请输入6位验证码')
  }else {
    return true
  }
}
