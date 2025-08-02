import { createI18n } from 'vue-i18n'
import { zhCN, enUS } from 'naive-ui/lib/locales'
import zh from './messages/zh-CN'
import en from './messages/en-US'

// 合并Naive UI和自定义语言包
const messages = {
  'zh-CN': { ...zh, ...zhCN },
  'en-US': { ...en, ...enUS }
}

// 获取本地存储的语言设置或浏览器默认语言
function getDefaultLanguage() {
  const savedLang = localStorage.getItem('locale')
  if (savedLang) {
    // 设置html的lang属性
    if (typeof document !== 'undefined') {
      document.documentElement.lang = savedLang
    }
    return savedLang
  }

  const browserLang = navigator.language
  let defaultLang = 'en-US'
  if (browserLang.startsWith('zh')) defaultLang = 'zh-CN'
  
  // 设置html的lang属性
  if (typeof document !== 'undefined') {
    document.documentElement.lang = defaultLang
  }
  
  return defaultLang
}

const i18n = createI18n({
  legacy: false, // 必须关闭Vue2兼容模式
  locale: getDefaultLanguage(),
  fallbackLocale: 'en-US',
  globalInjection: true, // 全局注入$t方法
  messages
})

export default i18n
