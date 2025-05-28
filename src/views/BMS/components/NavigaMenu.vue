<template>
  <div class="naviga-menu-box">
    <n-button strong tertiary v-for="(item,index) in menu" :key="index" @click="() => $router.push(item.path)" >
      <n-icon>
        <img :src="item.icon">
      </n-icon>
      {{ item.name }}
    </n-button>
  </div>
</template>

<script setup lang="ts">
const menu = [
  {
    name: '总览',
    path: '/bms/overview',
    icon: new URL('@/assets/images/overview.svg', import.meta.url).href
  },
  {
    name: '博客文章',
    path: '/bms/article',
    icon: new URL('@/assets/images/Article.svg', import.meta.url).href
  },
  {
    name: '摄影图库',
    path: '/',
    icon: new URL('@/assets/images/PhotoLibrary.svg', import.meta.url).href
  },
  {
    name: '随笔随记',
    path: '/bms/article',
    icon: new URL('@/assets/images/Notes.svg', import.meta.url).href
  },
  {
    name: 'Banner',
    path: '/bms/article',
    icon: new URL('@/assets/images/StarBanner.svg', import.meta.url).href
  },
  {
    name: '用户设置',
    path: '/bms/article',
    icon: new URL('@/assets/images/UserSet.svg', import.meta.url).href
  }

]
</script>

<style lang="scss" scoped>
.naviga-menu-box {
  display: flex;
  flex-direction: column;
  width: 150px;
  .n-button{
    justify-content: flex-start;
    height: 40px;
    margin: 5px 0;
    border-radius: 8px;
  }
}
</style>
