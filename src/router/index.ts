import { createRouter, createWebHistory } from 'vue-router'
import { isMobileDevice } from '@/utils/deviceUtils'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'mixMain',
      // 根据设备类型动态加载组件
      component: () => import(`@/views/${isMobileDevice() ? 'MobileMixMain' : 'MixMain'}.vue`),
    },
    {
      path: '/register-login',
      name: 'register',
      component: () =>
        import(
          `@/views/RegisterLogin/${isMobileDevice() ? 'MobileRegisterLogin' : 'RegisterLogin'}.vue`
        ),
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
    },
    {
      path: '/bms/overview',
      name: 'Overview',
      component: () => import('@/views/BMS/Overview/OverView.vue'),
    },
    {
      path: '/bms/article',
      name: 'Article',
      component: () => import('@/views/BMS/BlogArticle/BlogArticle.vue'),
    },
    {
      path: '/bms/editarticle',
      name: 'CreateArticle',
      component: () => import('@/views/BMS/BlogArticle/CreateArticle.vue'),
    },
    {
      path: '/bms/photo',
      name: 'Photo',
      component: () => import('@/views/BMS/ImageLibrary/ImageLibrary.vue'),
    },
    {
      path: '/bms/editPhoto',
      name: 'CreatePhoto',
      component: () => import('@/views/BMS/ImageLibrary/CreatePhoto.vue'),
    },
    {
      path: '/bms/notes',
      name: 'BmsNotes',
      component: () => import('@/views/BMS/RandomNotes/RandomNotes.vue'),
    },
    {
      path: '/bms/userSet',
      name: 'BmsUserSet',
      component: () => import('@/views/BMS/UserSet/UerSet.vue'),
    },
    {
      path: '/bms/bannerSet',
      name: 'BmsBannerSet',
      component: () => import('@/views/BMS/Banner/BannerSet.vue'),
    },
    {
      path: '/bms/userManagement',
      name: 'BmsUserManagement',
      component: () => import('@/views/BMS/UserManagement/UserManagement.vue'),
    }
  ],
})

export default router
