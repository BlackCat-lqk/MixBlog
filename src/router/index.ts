import { createRouter, createWebHistory } from 'vue-router'
import { useUserInfoStore } from '@/stores/userInfo'
import { verifyUserApi } from '@/http/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'mixMain',
      component: () => import('@/views/MixMain.vue'),
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
    },
    {
      path: '/book-doc',
      name: 'BookDoc',
      component: () => import('@/views/BookDoc/DocumentView.vue'),
    },
    {
      path: '/site-navigation',
      name: 'SiteNav',
      component: () => import('@/views/SiteNav/SiteNav.vue'),
    },
    {
      path: '/cover-illustration',
      name: 'CoverIllustration',
      component: () => import('@/views/CoverIllustration/CoverIllustration.vue'),
    },
    {
      path: '/d-chat',
      name: 'DeepSeekChat',
      component: () => import('@/views/Chat/DeepSeekChat.vue'),
    },
    {
      path: '/mixlab',
      name: 'MixLab',
      component: () => import('@/views/MixLab/MixLab.vue'),
    },
    {
      path: '/unauthorized',
      name: 'Unauthorized',
      component: () => import('@/views/UnAuthorized.vue'),
    },
    {
      path: '/bms/LogCenter',
      name: 'LogCenter',
      component: () => import('@/views/BMS/LogsCenter/LogView.vue'),
      meta: { requiresAdmin: true, requiresAuth: true, dynamic: true },
    },
    {
      path: '/bms/overview',
      name: 'Overview',
      component: () => import('@/views/BMS/Overview/OverView.vue'),
      meta: { requiresAdmin: true, requiresAuth: true, dynamic: true },
    },
    {
      path: '/bms/article',
      name: 'Article',
      component: () => import('@/views/BMS/BlogArticle/BlogArticle.vue'),
      meta: { requiresAdmin: true, requiresAuth: true, dynamic: true },
    },
    {
      path: '/bms/editarticle',
      name: 'CreateArticle',
      component: () => import('@/views/BMS/BlogArticle/CreateArticle.vue'),
      meta: { requiresAdmin: true, requiresAuth: true, dynamic: true },
    },
    {
      path: '/bms/photo',
      name: 'Photo',
      component: () => import('@/views/BMS/ImageLibrary/ImageLibrary.vue'),
      meta: { requiresAdmin: true, requiresAuth: true, dynamic: true },
    },
    {
      path: '/bms/editPhoto',
      name: 'CreatePhoto',
      component: () => import('@/views/BMS/ImageLibrary/CreatePhoto.vue'),
      meta: { requiresAdmin: true, requiresAuth: true, dynamic: true },
    },
    {
      path: '/bms/notes',
      name: 'BmsNotes',
      component: () => import('@/views/BMS/RandomNotes/RandomNotes.vue'),
      meta: { requiresAdmin: true, requiresAuth: true, dynamic: true },
    },
    {
      path: '/bms/userSet',
      name: 'BmsUserSet',
      component: () => import('@/views/BMS/UserSet/UerSet.vue'),
      meta: { requiresAdmin: true, requiresAuth: true, dynamic: true },
    },
    {
      path: '/bms/bannerSet',
      name: 'BmsBannerSet',
      component: () => import('@/views/BMS/Banner/BannerSet.vue'),
      meta: { requiresAdmin: true, requiresAuth: true, dynamic: true },
    },
    {
      path: '/bms/userManagement',
      name: 'BmsUserManagement',
      component: () => import('@/views/BMS/UserManagement/UserManagement.vue'),
      meta: { requiresAdmin: true, requiresAuth: true, dynamic: true },
    },
    {
      path: '/bms/book-doc',
      name: 'BmsBookDoc',
      component: () => import('@/views/BMS/BookDoc/BookDoc.vue'),
      meta: { requiresAdmin: true, requiresAuth: true, dynamic: true },
    },
    {
      path: '/bms/site-nav',
      name: 'BmsSiteNav',
      component: () => import('@/views/BMS/SiteNav/SiteNav.vue'),
      meta: { requiresAdmin: true, requiresAuth: true, dynamic: true },
    },
    // 通配符路由必须放在最后
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const requiresAdmin = to.meta.requiresAdmin
  const userStore = useUserInfoStore()
  // 白名单放行
  if (!requiresAuth) {
    return next()
  }
  // 获取身份信息
  try {
    const response = await verifyUserApi()
    const res = response.data
    if (res.success) {
      // 如果已经是管理员且访问的路由需要校验
      if (res.isAdmin && requiresAdmin) {
        return next()
      } else {
        return next({ name: 'Unauthorized' })
      }
    } else {
      userStore.removeUserInfo()
      return next({ name: 'register' })
    }
  } catch (error) {
    console.log('🚀 ~ error:', error)
    userStore.removeUserInfo()
    return next({ name: 'register' })
  }
})
export default router
