import i18n from '@/locales/index'
const { t } = i18n.global
/**
 *
 * @description 邮箱自定义校验
 * @param {String}
 * @returns {Boolean | Error}
 */
export const validateEmail = (rule:unknown, value: string): boolean | Error => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (value === '') {
    return new Error(t('validate.emailError'))
  }else if(!emailRegex.test(value)){
    return new Error(t('validate.emailError1'))
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
    return new Error(t('validate.nameError1'))
  }else if(!reg.test(value)){
    return new Error(t('validate.nameError2'))
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
    return new Error(t('validate.pwdError1'))
  }else if(reg.test(value)){
    return new Error(t('validate.pwdError2'))
  }else if(value.length < 6 || value.length > 20) {
    return new Error(t('validate.pwdError3'))
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
    return new Error(t('validate.codeError'))
  }else {
    return true
  }
}
