<template>
  <div class="mobile-header-nav-main-box">
    <div class="logo-header-box">
      <img src="@/assets/images/logo-transparent.png" alt="logo" />
    </div>
    <div class="header-tabs-box">
      <div
        v-for="(item, idx) in routerPage"
        :key="idx"
        @click="jumpPage(item.path, idx)"
        :class="state.activeRouter == idx ? 'menu-item-text active' : 'menu-item-text'"
      >
        <span>{{ item.title }}</span>
      </div>
    </div>
    <div class="header-search-box">
      <img src="@/assets/images/Search.svg" alt="Search" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const routerPage = [
  {
    path: '/articles',
    title: '文章',
  },
  {
    path: '/image-library',
    title: '图库',
  },
  {
    path: '/random-notes',
    title: '随记',
  },
  {
    path: '/about',
    title: '关于',
  },
]
const state = reactive({
  activeRouter: 0,
})

const jumpPage = (path: string, idx?: number | undefined) => {
  router.push(path)
  if (idx != undefined) {
    state.activeRouter = idx
  }
}
</script>

<style lang="scss" scoped>
.mobile-header-nav-main-box {
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo-header-box {
    width: 25px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .header-tabs-box {
    flex: 0.7;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 5px 10px;
    .menu-item-text {
      padding-bottom: 10px;
      cursor: pointer;
      color: var(--text-color);
    }

    .active {
      border-bottom: 2px solid #409eff;
    }
  }
  .header-search-box {
    width: 25px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
