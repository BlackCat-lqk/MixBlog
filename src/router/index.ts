import { createRouter, createWebHistory } from 'vue-router'
import { isMobileDevice } from '@/utils/deviceUtils'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'mixMain',
      // component: () => import('@/views/MixMain.vue'),
      // 根据设备类型动态加载组件
      component: () => import(`@/views/${isMobileDevice() ? 'MobileMixMain' : 'MixMain' }.vue`),
    },
    {
      path: '/register-login',
      name: 'register',
      component: () => import(`@/views/RegisterLogin/${isMobileDevice() ? 'MobileRegisterLogin' : 'RegisterLogin' }.vue`),
    },
    {
      path: '/articles',
      name: 'Articles',
      component: () => import('@/views/Article/ArticleView.vue'),
    },
    {
      path: '/image-library',
      name: 'ImageLibrary',
      component: () => import('@/views/ImageLibrary/ImageLibrary.vue'),
    },
    {
      path: '/random-notes',
      name: 'RandomNotes',
      component: () => import('@/views/RandomNotes/RandomNotes.vue'),
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/About/AboutView.vue'),
    }
  ],
})

export default router
