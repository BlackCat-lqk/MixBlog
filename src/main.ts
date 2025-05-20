import './assets/style/main.scss'
import naive from 'naive-ui'
import { useMessage } from 'naive-ui'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 将 message 挂载到全局属性上
app.config.globalProperties.$naiveMessage = useMessage()

app.use(createPinia())
app.use(router)
app.use(naive)

app.mount('#app')
