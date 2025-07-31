<template>
  <div class="naviga-menu-box">
    <n-button
      strong
      tertiary
      v-for="(item, index) in menu"
      :key="index"
      :class="{ active: item.active }"
      @click="() => router.push(item.path)"
    >
      <img :src="item.icon" alt="侧边栏导航icon" />
      {{ item.name }}
    </n-button>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const menu = reactive(
  [
    {
      name: '总览',
      path: '/bms/overview',
      icon: new URL('@/assets/images/overview.svg', import.meta.url).href,
    },
    {
      name: '博客文章',
      path: '/bms/article',
      icon: new URL('@/assets/images/Article.svg', import.meta.url).href,
    },
    {
      name: '摄影图库',
      path: '/bms/photo',
      icon: new URL('@/assets/images/PhotoLibrary.svg', import.meta.url).href,
    },
    {
      name: '随笔随记',
      path: '/bms/notes',
      icon: new URL('@/assets/images/Notes.svg', import.meta.url).href,
    },
    {
      name: 'Banner',
      path: '/bms/bannerSet',
      icon: new URL('@/assets/images/StarBanner.svg', import.meta.url).href,
    },
    {
      name: '用户设置',
      path: '/bms/userSet',
      icon: new URL('@/assets/images/UserSet.svg', import.meta.url).href,
    },
    {
      name: '用户管理',
      path: '/bms/UserManagement',
      icon: new URL('@/assets/images/UserManagement.svg', import.meta.url).href,
    },
    {
      name: '文件上传',
      path: '/bms/book-doc',
      icon: new URL('@/assets/images/file/file.svg', import.meta.url).href,
    },
    {
      name: '站点收录',
      path: '/bms/site-nav',
      icon: new URL('@/assets/images/Site.svg', import.meta.url).href,
    },
    {
      name: '日志中心',
      path: '/bms/LogCenter',
      icon: new URL('@/assets/images/LogCenter.svg', import.meta.url).href,
    },
  ].map((item) => ({
    ...item,
    active: computed(() => route.path === item.path),
  })),
)
</script>

<style lang="scss" scoped>
.naviga-menu-box {
  display: flex;
  flex-direction: column;
  width: 200px;
  .n-button {
    justify-content: flex-start;
    height: 64px;
    margin: 5px 0;
    border-radius: 8px;
    align-items: center;
    img {
      width: 28px;
      height: 28px;
      object-fit: contain;
      margin-right: 10px;
    }
  }
  .active {
    background-color: #2b5aed;
    color: #fff;
  }
}
</style>
