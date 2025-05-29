<!-- eslint-disable vue/require-default-prop -->
<template>
  <div class="header-main-box" :style="{ background: bgColor }">
    <div class="background-blur" :style="{ filter: `blur(${opacity}px)` }"></div>
    <div class="header-logo-search-box">
      <div class="header-logo-box">
        <img v-if="state.switchTheme" src="/src/assets/images/logo-transparent.png" alt="" />
        <img v-else src="/src/assets/images/logo-transparent-night.png" alt="" />
      </div>
      <n-button @click="jumpPage('/bms/overview')">管理后台</n-button>
      <div class="search-box">
        <n-popselect
          v-model:value="state.searchQuery"
          :options="state.searchOptions"
          trigger="click"
        >
          <n-input
            placeholder="文章/图库/日记/资源..."
            clearable
            size="large"
            v-model:value="state.searchQuery"
            @keyup.enter="handleGlobalSearch"
          >
            <template #prefix>
              <n-icon>
                <img src="/src/assets/images/Search.svg" />
              </n-icon>
            </template>
          </n-input>
          <template #header>
            <div v-if="state.searchHistory.length > 0" class="search-history">历史搜索记录</div>
            <p v-for="(item, idx) in state.searchHistory" :key="idx">{{ item }}</p>
          </template>
          <template #empty>
            <n-empty description="暂无数据">
              <template #extra> </template>
            </n-empty>
          </template>
          <template #action>
            <div><n-button @click="clearHistory">清除历史记录</n-button></div>
          </template>
        </n-popselect>
      </div>
    </div>
    <div class="header-menu-box">
      <div class="menu-item-box" v-for="(item, idx) in routerPage" :key="idx">
        <div
          :class="state.activeRouter == idx ? 'menu-item-text active' : 'menu-item-text'"
          @click="jumpPage(item.path, idx)"
        >
          {{ item.title }}
        </div>
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
          <template #checked-icon>
            <img src="/src/assets/images/LightModeFilled.svg" />
          </template>
          <template #unchecked-icon>
            <img src="/src/assets/images/NightlightRoundSharp.svg" />
          </template>
        </n-switch>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, reactive, onMounted, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useScroll } from '@vueuse/core'
import { useThemeStore } from '@/stores/themeStore'
import { useGlobalSearchStore } from '@/stores/globalSearch'
import { useMessage } from 'naive-ui'

const router = useRouter()
const themeStore = useThemeStore()
const globalSearchStore = useGlobalSearchStore()
const message = useMessage()
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
  },
]

const state = reactive({
  activeRouter: 0,
  searchQuery: '',
  switchTheme: false,
  searchHistory: [],
  searchOptions: [],
  headerColorTheme: '',
})
const handleChangeTheme = (value: boolean) => {
  if (value) {
    state.headerColorTheme = '#fff'
  } else {
    state.headerColorTheme = '#000'
  }
  themeStore.setTheme(value ? 'light' : 'dark')
  bgColorInit(y.value)
}

const handleGlobalSearch = async () => {
  if (state.searchQuery) {
    await globalSearchStore.setSearch(state.searchQuery)
    handleSearchHistory()
  }
}

// 清空搜索记录
const clearHistory = () => {
  state.searchHistory = []
  localStorage.removeItem('globalSearch')
  message.success('已清空搜索记录')
}

const jumpPage = (path: string, idx?: number | undefined) => {
  router.push(path)
  if (idx != undefined) {
    state.activeRouter = idx
  }
}

const activeRouterInit = () => {
  const currentPath = router.currentRoute.value.path
  const index = routerPage.findIndex((item) => item.path === currentPath)
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

// 初始化主题开关
const initTheme = () => {
  const theme = localStorage.getItem('app-theme')
  state.switchTheme = theme === 'light'
  if (state.switchTheme) {
    state.headerColorTheme = '#fff'
  } else {
    state.headerColorTheme = '#000'
  }
}

const bgColorInit = (value: number) => {
  const maxOpacityScroll = 100
  if (value >= maxOpacityScroll) {
    opacity.value = Math.min(value / maxOpacityScroll, 30)
    bgColor.value = state.headerColorTheme
  } else {
    bgColor.value = 'transparent'
  }
}

watch(y, (newVal) => {
  bgColorInit(newVal)
})
onBeforeMount(() => {
  y.value = 0
  initTheme()
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
      img {
        cursor: pointer;
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
        color: var(--text-color);
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

      > span {
        margin-left: 10px;
        cursor: pointer;
        color: var(--text-color);
        &:hover {
          color: #409eff;
        }
      }
    }
  }
}
</style>
