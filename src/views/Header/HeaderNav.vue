<!-- eslint-disable vue/require-default-prop -->
<template>
  <div class="header-main-box">
    <div class="background-blur"></div>
    <div class="header-logo-search-box">
      <div class="header-logo-box">
        <img v-if="themeStore.currentTheme == 'light'" :src="logoLight" />
        <img v-else :src="logoNight" />
      </div>
      <span class="logo-name-text" style="padding-right: 10px">{{
        sloganStore.sloganConfig.logoName
      }}</span>
      <!-- <div class="search-box">
        <n-popselect
          v-model:value="state.searchQuery"
          :options="state.searchOptions"
          trigger="click"
        >
          <n-input
            :placeholder="$t('header.search.placeholder')"
            clearable
            size="large"
            v-model:value="state.searchQuery"
            @keyup.enter="handleGlobalSearch"
          >
            <template #prefix>
              <n-icon>
                <img width="20px" src="/src/assets/images/searchIconfont.svg" />
              </n-icon>
            </template>
          </n-input>
          <template #header>
            <div v-if="state.searchHistory.length > 0" class="search-history">
              {{ t('header.search.tip1') }}
            </div>
            <p v-for="(item, idx) in state.searchHistory" :key="idx">{{ item }}</p>
          </template>
          <template #empty>
            <n-empty :description="$t('header.search.tip2')">
              <template #extra> </template>
            </n-empty>
          </template>
          <template #action>
            <div>
              <n-button @click="clearHistory">{{ t('header.search.tip3') }}</n-button>
            </div>
          </template>
        </n-popselect>
      </div> -->
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
      <div class="menu-item-box">
        <div class="menu-item-text">
          <n-dropdown trigger="hover" :options="moreData" @select="handleMoreSelect">
            <div class="more-item-box">
              <img src="@/assets/images/moreiconfont.svg" />
            </div>
          </n-dropdown>
        </div>
      </div>
    </div>
    <div class="oprate-box">
      <!-- <n-button type="primary" @click="dingyue">订阅</n-button> -->
      <n-button
        v-if="state.userInfo.role === 'admin' && state.userInfo.isLogin"
        type="info"
        @click="jumpPage('/bms/overview')"
        >{{ t('header.btnText') }}</n-button
      >
      <div class="user-info-box">
        <div v-if="state.userInfo.isLogin">
          <n-dropdown :options="state.avatarOptions" @select="handleAvatarClick">
            <n-avatar round :size="40">
              <n-icon>
                <img v-if="state.userInfo.isLogin" :src="state.userInfo.avatar" />
                <img v-else src="@/assets/images/UserAvatarFilled.svg" />
              </n-icon>
            </n-avatar>
          </n-dropdown>
          <span class="has-user-name">{{ state.userInfo.userName }}</span>
        </div>
        <div v-else>
          <n-avatar round :size="40">
            <n-icon>
              <img v-if="state.userInfo.isLogin" :src="state.userInfo.avatar" />
              <img v-else src="@/assets/images/UserAvatarFilled.svg" />
            </n-icon>
          </n-avatar>
          <span class="user-name" @click="jumpPage('/register-login')">{{ t('header.text') }}</span>
        </div>
      </div>
      <div class="language-select-box">
        <n-select v-model:value="locale" :options="languages" @update:value="changeLanguage" />
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
      <div
        class="address-img-box"
        @click="redirectToExternal('https://github.com/BlackCat-lqk/MixBlog')"
      >
        <n-icon size="24">
          <img
            width="24px"
            v-if="themeStore.currentTheme == 'light'"
            src="@/assets/images/Github.svg"
          />
          <img width="24px" v-else src="@/assets/images/GithubWhite.svg" />
        </n-icon>
      </div>
      <div
        class="address-img-box"
        @click="redirectToExternal('https://space.bilibili.com/154164424?spm_id_from=333.1007.0.0')"
      >
        <n-icon size="24">
          <img
            width="24px"
            v-if="themeStore.currentTheme == 'light'"
            src="@/assets/images/Blibli.svg"
          />
          <img width="24px" v-else src="@/assets/images/BlibliWhite.svg" />
        </n-icon>
      </div>
    </div>
  </div>
  <SetUserInfo v-model:show="showSetUserModal"></SetUserInfo>
  <ForgotPwd
    v-model:show="showForgotPwdModal"
    @update:show="showForgotPwdModal = $event"
  ></ForgotPwd>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeMount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useScroll } from '@vueuse/core'
import { useThemeStore } from '@/stores/themeStore'
import { useUserInfoStore } from '@/stores/userInfo'
// import { useGlobalSearchStore } from '@/stores/globalSearch'
import { useMessage } from 'naive-ui'
import { logOutUserApi } from '@/http/user'
import { useSloganInfoStore } from '@/stores/configInfo'
import SetUserInfo from './components/SetUserInfo.vue'
import ForgotPwd from '@/views/RegisterLogin/components/ForgotPwd.vue'
import { useI18n } from 'vue-i18n'
const { locale, t } = useI18n()
// import { clearDynamicRoutes } from '@/router'
const sloganStore = useSloganInfoStore()
const router = useRouter()
const userInfoStore = useUserInfoStore()
const themeStore = useThemeStore()
// const globalSearchStore = useGlobalSearchStore()
const message = useMessage()
const { y } = useScroll(window)
const languages = [
  { label: 'English', value: 'en-US' },
  { label: '中文', value: 'zh-CN' },
]
const showForgotPwdModal = ref(false)
const logoNight = '/uploads/defalut/logo-transparent-night.png'
const logoLight = '/uploads/defalut/logo-transparent.png'
const changeLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}
const moreData = [
  {
    label: '书籍文档',
    key: '/book-doc',
  },
  {
    label: '站点收录',
    key: '/site-navigation',
  },
  {
    label: '封面立绘',
    key: '/cover-illustration',
  },
  {
    label: 'MIX AI',
    key: '/d-chat',
  },
]
// 选择更多选项
const handleMoreSelect = (key: string) => {
  router.push(key)
  state.activeRouter = -1
}
const redirectToExternal = (url: string) => {
  window.open(url, '_blank')
}
const routerPage = reactive([
  {
    path: '/',
    title: computed(() => t('header.navigation1')),
  },
  {
    path: '/articles',
    title: computed(() => t('header.navigation2')),
  },
  {
    path: '/image-library',
    title: computed(() => t('header.navigation3')),
  },
  {
    path: '/random-notes',
    title: computed(() => t('header.navigation4')),
  },
  {
    path: '/about',
    title: computed(() => t('header.navigation5')),
  },
])
const showSetUserModal = ref(false)
const state = reactive({
  activeRouter: -1,
  searchQuery: '',
  switchTheme: false,
  searchHistory: [],
  searchOptions: [],
  headerColorTheme: '',
  userInfo: {
    avatar: '',
    userName: '',
    role: '',
    isLogin: false,
  },
  avatarOptions: [
    {
      label: computed(() => t('header.person.menu1')),
      key: 0,
    },
    {
      label: computed(() => t('header.person.menu2')),
      key: 1,
    },
    {
      label: computed(() => t('header.person.menu3')),
      key: 2,
    },
    {
      label: computed(() => t('header.person.menu4')),
      key: 3,
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
}

// const handleGlobalSearch = async () => {
//   if (state.searchQuery) {
//     await globalSearchStore.setSearch(state.searchQuery)
//     handleSearchHistory()
//   }
// }

// 清空搜索记录
// const clearHistory = () => {
//   state.searchHistory = []
//   localStorage.removeItem('globalSearch')
//   const tip = computed(() => t('header.search.tip4'))
//   message.success(tip.value)
// }
// 用户头像菜单select回调
const handleAvatarClick = async (key: string | number) => {
  if (key === 0) {
    showSetUserModal.value = true
  } else if (key === 1) {
    showForgotPwdModal.value = true
  } else if (key === 2) {
    router.push('/register-login')
  } else {
    const response = await logOutUserApi()
    const res = response.data
    if (res.code === 200) {
      //清除有关用户的全部数据
      userInfoStore.removeUserInfo()
      router.push('/register-login')
      // 清理动态路由
      // clearDynamicRoutes()
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
// const dingyue = () => {
//   const channel = new BroadcastChannel('dingyue')
//   channel.postMessage({ greeting: 'Hello from page 1!' })
//   channel.onmessage = (event) => {
//     message.success('订阅成功', event.data)
//   }
// }
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
  backdrop-filter: blur(50px);
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
    .logo-name-text {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color);
      font-family: 'Courier New', Courier, monospace;
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
        display: flex;
        align-items: center;
        .more-item-box {
          display: flex;
          align-items: center;
          border-radius: 10px;
          img {
            width: 32px;
            transition: all 0.5s;
            &:hover {
              scale: 1.2;
              transition: all 0.5s;
            }
          }
        }
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
        cursor: pointer;
        img {
          object-fit: cover;
          border-radius: 50%;
        }
      }
      .user-name,
      .has-user-name {
        margin-left: 10px;
        color: var(--text-color);
      }
      .user-name {
        &:hover {
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    .language-select-box {
      margin-right: 10px;
      .n-select {
        width: 100px;
      }
    }
    .switch-theme-box {
      :deep(.n-switch__rail) {
        box-shadow: 0 0 1px 1px #f7f7f7;
      }
    }
    .address-img-box {
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
</style>
