import './assets/style/main.scss'
import naive from 'naive-ui'
import Vant from 'vant'
import 'vant/lib/index.css'

import { createApp } from 'vue'
import pinia from './stores/index'
import { useThemeStore } from '@/stores/themeStore'
import '@/mock/randomNotes.ts'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(naive)
app.use(Vant)

app.mount('#app')

// pinia挂载后再进行主题初始化
const themeStore = useThemeStore()
themeStore.setTheme(themeStore.currentTheme)
