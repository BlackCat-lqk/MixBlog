import './assets/style/main.scss'
import naive from '@/NaiveUI/index' // 全局按需导入UI库
import { createApp } from 'vue'
import pinia from './stores/index'
import { useThemeStore } from '@/stores/themeStore'
import App from './App.vue'
import router from './router'
import i18n from './locales'

// 注册指令
import vPreventScrollPassthrough from './directives/preventScrollPassthrough'
const app = createApp(App)
// 注册指令（滚动条禁止透传）
app.directive('prevent-scroll-passthrough', vPreventScrollPassthrough)
app.use(i18n)
app.use(pinia)
app.use(router)
app.use(naive)
app.mount('#app')

// pinia挂载后再进行主题初始化
const themeStore = useThemeStore()
themeStore.setTheme(themeStore.currentTheme)
