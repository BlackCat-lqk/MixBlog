<!-- eslint-disable vue/require-default-prop -->
<template>
  <div class="header-main-box" :style="{ background: bgColor }">
    <div class="background-blur" :style="{ filter: `blur(${opacity}px)` }"></div>
    <div class="header-logo-search-box">
      <div class="header-logo-box">
        <img src="/src/assets/images/logo-transparent.png" alt="" />
      </div>
      <div class="search-box">
        <n-popselect v-model:value="state.searchQuery" :options="state.searchOptions" trigger="click">
          <n-input placeholder="文章/图库/日记/资源..." clearable size="large" v-model:value="state.searchQuery"
            @keyup.enter="handleGlobalSearch">
            <template #prefix>
              <n-icon>
                <img src="/src/assets/images/Search.svg" />
              </n-icon>
            </template>
          </n-input>
          <template #header>
            <div>历史记录</div>
            <p v-for="(item, idx) in state.searchHistory" :key="idx">{{ item }}</p>
          </template>
          <template #empty>
            没啥看的，这里是空的
          </template>
          <template #action>
            清除历史记录
          </template>
        </n-popselect>
      </div>
    </div>
    <div class="header-menu-box">
      <div class="menu-item-box" v-for="(item, idx) in routerPage" :key="idx">
        <div :class="state.activeRouter == idx ? 'menu-item-text active' : 'menu-item-text'"
          @click="jumpPage(item.path, idx)">{{
            item.title }}</div>
      </div>
    </div>
    <div class="oprate-box">
      <div class="user-info-box">
        <n-avatar round :size="40">
          <n-icon>
            <img src="/src/assets/images/UserAvatarFilled.svg" />
          </n-icon>
        </n-avatar>
        <span @click="jumpPage('/register-login')">去登录</span>
      </div>
      <div class="switch-theme-box">
        <n-switch v-model:value="state.switchTheme" size="large" @update:value="handleChangeTheme">
          <template #checked>
            <img src="/src/assets/images/LightModeFilled.svg" />
          </template>
          <template #unchecked>
            <img src="/src/assets/images/NightlightRoundSharp.svg" />
          </template>
        </n-switch>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useScroll } from '@vueuse/core'
import { useThemeStore } from '@/stores/themeStore'
import { useGlobalSearchStore } from '@/stores/globalSearch'

const router = useRouter()
const themeStore = useThemeStore()
const globalSearchStore = useGlobalSearchStore()
const { y } = useScroll(window)
const opacity = ref(0)
const bgColor = ref('transparent')
const routerPage = [
  {
    path: '/',
    title: '首页',
  },
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
  }
]

const state = reactive({
  activeRouter: 0,
  searchQuery: '',
  switchTheme: false,
  searchHistory: [],
  searchOptions: [{
    label: 'Drive My Car',
    value: 'Drive My Car'
  }]
})
const handleChangeTheme = (value: boolean) => {
  themeStore.setTheme(value ? 'light' : 'dark')
}

const handleGlobalSearch = () => {
  if (state.searchQuery) {
    globalSearchStore.setSearch(state.searchQuery)
  }
}

const jumpPage = (path: string, idx: number) => {
  router.push(path)
  state.activeRouter = idx

}

const activeRouterInit = () => {
  const currentPath = router.currentRoute.value.path
  const index = routerPage.findIndex(item => item.path === currentPath)
  if (index !== -1) {
    state.activeRouter = index
  }
}

// 初始化搜索历史
const handleSearchHistory = () => {
  const historyValue = localStorage.getItem('globalSearch')
  const historyObj = historyValue ? JSON.parse(historyValue) : null
  state.searchHistory = historyObj?.search ?? []
}

watch(y, (newVal) => {
  const maxOpacityScroll = 200
  if (newVal >= maxOpacityScroll) {
    opacity.value = Math.min(newVal / maxOpacityScroll, 30)
    bgColor.value = '#f4f2ec'
  } else {
    bgColor.value = 'transparent'
  }
})
onMounted(() => {
  activeRouterInit()
  handleSearchHistory()
})
</script>
<style scoped lang="scss">
.header-main-box {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  transition: all 0.3s;
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;

  .header-logo-search-box {
    z-index: 1;
    @include g.flexCenter;
    height: 100%;

    .header-logo-box {
      width: 120px;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .search-box {
      .n-input__state-border {
        border: none;
        border-radius: 10px;
      }
    }
  }

  .header-menu-box {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    .menu-item-box {
      margin: 0 20px;

      .menu-item-text {
        padding-bottom: 10px;
        cursor: pointer;
      }

      .active {
        border-bottom: 2px solid #409eff;
      }
    }
  }

  .background-blur {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    opacity: v-bind('opacity > 0 ? 0.8 : 0');
    z-index: -1;
    transition: filter 0.3s ease;
  }

  .oprate-box {
    z-index: 1;
    display: flex;
    align-items: center;
    margin-right: 20px;

    .user-info-box {
      @include g.flexCenter;
      margin-right: 30px;

      >span {
        margin-left: 10px;
        cursor: pointer;

        &:hover {
          color: #409eff;
        }
      }
    }
  }
}
</style>
