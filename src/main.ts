import './assets/style/main.scss'
import naive from '@/NaiveUI/index' // 全局按需导入UI库
import { createApp } from 'vue'
import pinia from './stores/index'
import { useThemeStore } from '@/stores/themeStore'
import App from './App.vue'
import router from './router'
import i18n from './locales'
import { versionChecker } from '@/utils/versionCheck'


// 注册指令
import vPreventScrollPassthrough from './directives/preventScrollPassthrough'
import vLoading from './directives/loading'
const app = createApp(App)

// 精确过滤掉 marquee 相关的插槽警告，等待naive-ui官方修复
app.config.warnHandler = (msg, instance, trace) => {
  // 只过滤特定的插槽警告
  if (msg.includes('Non-function value encountered for default slot') &&
      (trace.includes('Marquee') || trace.includes('marquee'))) {
    return // 静默处理
  }
  // 其他警告正常显示
  console.warn(`[Vue warn]: ${msg}`, trace)
}

// 注册指令（滚动条禁止透传）
app.directive('prevent-scroll-passthrough', vPreventScrollPassthrough)
app.directive('loading', vLoading)
app.use(i18n)
app.use(pinia)
app.use(router)
app.use(naive)
app.mount('#app')

// pinia挂载后再进行主题初始化
const themeStore = useThemeStore()
themeStore.setTheme(themeStore.currentTheme)

// 开始版本检查
versionChecker.start()
