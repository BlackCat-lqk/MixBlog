import './assets/style/main.scss'
import naive from 'naive-ui'
import Vant from 'vant'
import 'vant/lib/index.css'
import { createApp } from 'vue'
import pinia from './stores/index'
import { useThemeStore } from '@/stores/themeStore'
import { setRem } from '@/utils/deviceUtils'
import App from './App.vue'
import router from './router'
import i18n from './locales'
// 注册指令
import vPreventScrollPassthrough from './directives/preventScrollPassthrough'

setRem()

const app = createApp(App)
app.directive('prevent-scroll-passthrough', vPreventScrollPassthrough)
app.use(i18n)
app.use(pinia)
app.use(router)
app.use(naive)
app.use(Vant)

// // 只在开发环境启用 mirage
// if (import.meta.env.MODE === 'development') {
//   import('./mirage/index').then(({ default: makeServer }) => {
//     makeServer()
//     console.log('Mirage server started')
//   }).catch((error) => {
//     console.error('Failed to start Mirage server:', error)
//   })
// }

app.mount('#app')

// pinia挂载后再进行主题初始化
const themeStore = useThemeStore()
themeStore.setTheme(themeStore.currentTheme)
