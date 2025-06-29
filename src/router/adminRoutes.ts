import type { RouteRecordRaw } from 'vue-router'

// 权限路由（权限控制，动态注册路由）
export const adminRoutes: Array<RouteRecordRaw> = [
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
]
