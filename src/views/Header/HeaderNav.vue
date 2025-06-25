<!-- eslint-disable vue/require-default-prop -->
<template>
  <div class="header-main-box" :style="{ background: bgColor }">
    <div class="background-blur" :style="{ filter: `blur(${opacity}px)` }"></div>
    <div class="header-logo-search-box">
      <div class="header-logo-box">
        <img v-if="state.switchTheme" :src="sloganStore.sloganConfig.logoPicture" alt="" />
        <img v-else src="@/assets/images/logo-transparent-night.png" alt="" />
      </div>
      <span style="padding-right: 10px">{{ sloganStore.sloganConfig.logoName }}</span>
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
      <n-button type="primary" @click="dingyue">订阅</n-button>
      <n-button type="info" @click="jumpPage('/bms/overview')">管理后台</n-button>
      <div class="user-info-box">
        <div v-if="state.userInfo.userName">
          <n-dropdown :options="state.avatarOptions" @select="handleAvatarClick">
            <n-avatar round :size="40">
              <n-icon>
                <img :src="state.userInfo.avatar" />
              </n-icon>
            </n-avatar>
          </n-dropdown>
          <span class="has-user-name">{{ state.userInfo.userName }}</span>
        </div>
        <div v-else>
          <n-avatar round :size="40">
            <n-icon>
              <img :src="state.userInfo.avatar" />
            </n-icon>
          </n-avatar>
          <span class="user-name" @click="jumpPage('/register-login')">去登录</span>
        </div>
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
import { useUserInfoStore } from '@/stores/userInfo'
import { useGlobalSearchStore } from '@/stores/globalSearch'
import { useMessage } from 'naive-ui'
import { logOutUserApi } from '@/http/user'
import { useSloganInfoStore } from '@/stores/configInfo'
const sloganStore = useSloganInfoStore()

const router = useRouter()
const userInfoStore = useUserInfoStore()
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
  userInfo: {
    avatar: '',
    userName: '',
  },
  avatarOptions: [
    {
      label: '个人设置',
      key: 0,
    },
    {
      label: '切换账号',
      key: 1,
    },
    {
      label: '退出登录',
      key: 2,
    },
  ],
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
// 用户头像菜单select回调
const handleAvatarClick = async (key: string | number) => {
  if (key === 0) {
    console.log('个人设置')
  } else if (key === 1) {
    router.push('/register-login')
  } else if (key === 2) {
    const response = await logOutUserApi()
    const res = response.data
    if (res.code === 200) {
      //清除有关用户的全部数据
      userInfoStore.removeUserInfo()
      router.push('/register-login')
      message.success(res.message)
    } else {
      message.error(res.message)
    }
  }
}
// 用户数据初始化
const initUserData = () => {
  const userInfo = userInfoStore.data.user
  if (userInfo) {
    state.userInfo = userInfo
    if (userInfo.avatar.length <= 0) {
      state.userInfo.avatar = '/src/assets/images/UserAvatarFilled.svg'
    }
  }
}
// 订阅
const dingyue = () => {
  const channel = new BroadcastChannel('dingyue')
  channel.postMessage({ greeting: 'Hello from page 1!' })
  channel.onmessage = (event) => {
    message.success('订阅成功', event.data)
  }
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
  initUserData()
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
    > .n-button {
      margin-right: 10px;
      background: -webkit-linear-gradient(to right, #12c2e9, #c471ed, #f64f59);
      background: linear-gradient(to right, #12c2e9, #c471ed, #f64f59);
    }
    .user-info-box {
      @include g.flexCenter;
      margin-right: 30px;
      > div {
        display: flex;
        align-items: center;
      }
      .n-avatar {
        img {
          object-fit: cover;
          border-radius: 50%;
        }
      }
      .user-name,
      .has-user-name {
        margin-left: 10px;
        cursor: pointer;
        color: var(--text-color);
      }
      .user-name {
        &:hover {
          color: #409eff;
        }
      }
    }
  }
}
</style>
