import { createRouter, createWebHistory } from 'vue-router'
import MixMain from '@/views/MixMain.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'mixMain',
      component: MixMain,
    },
    {
      path: '/register-login',
      name: 'register',
      component: () => import('@/views/RegisterLogin/RegisterLogin.vue'),
    },
  ],
})

export default router
