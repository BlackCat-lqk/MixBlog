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
