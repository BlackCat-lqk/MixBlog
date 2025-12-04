<!-- eslint-disable vue/require-default-prop -->
<template>
  <div class="header-main-box">
    <div class="background-blur"></div>
    <div class="header-logo-search-box">
      <div class="header-logo-box">
        <div>
          <img v-if="themeStore.currentTheme == 'light'" :src="logoLight" alt="logoLight" />
          <img v-else :src="logoNight" alt="logoNight" />
          <span>Mix Blog</span>
        </div>
        <div class="search-box" style="flex: 1">
          <AlgoliaSearch></AlgoliaSearch>
        </div>
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
      <div class="menu-item-box">
        <div class="menu-item-text">
          <n-dropdown trigger="hover" :options="moreData" @select="handleMoreSelect">
            <div class="more-item-box">
              <img src="@/assets/images/moreiconfont.svg" alt="more" />
              <span>更多</span>
            </div>
          </n-dropdown>
        </div>
      </div>
    </div>
    <div class="oprate-box">
      <n-button
        v-if="state.userInfo.role === 'admin' && state.userInfo.isLogin"
        type="info"
        @click="jumpPage('/bms/overview')"
        alt="bms"
        >{{ t('header.btnText') }}</n-button
      >
      <div class="user-info-box">
        <div v-if="state.userInfo.isLogin">
          <n-dropdown :options="state.avatarOptions" @select="handleAvatarClick">
            <n-avatar round :size="32">
              <n-icon>
                <img v-if="state.userInfo.isLogin" :src="state.userInfo.avatar" alt="avatar" />
                <img v-else src="@/assets/images/UserAvatarFilled.svg" alt="user avatar" />
              </n-icon>
            </n-avatar>
          </n-dropdown>
          <span class="has-user-name">{{ state.userInfo.userName }}</span>
        </div>
        <div v-else>
          <n-avatar round :size="32">
            <n-icon>
              <img v-if="state.userInfo.isLogin" :src="state.userInfo.avatar" alt="user avatar" />
              <img v-else src="@/assets/images/UserAvatarFilled.svg" alt="user avatar" />
            </n-icon>
          </n-avatar>
          <span class="user-name" @click="jumpPage('/register-login')">{{ t('header.text') }}</span>
        </div>
      </div>
      <div style="display: flex; align-items: center; cursor: pointer">
        <router-link :to="{ path: '/mixlab' }" target="_blank" rel="noopener noreferrer">
          <n-icon size="32">
            <img width="32px" src="@/assets/images/lab.svg" alt="Laboratory" />
          </n-icon>
        </router-link>
      </div>
      <n-divider vertical style="background-color: rgb(192 192 192)" />
      <div class="language-select-box">
        <n-dropdown trigger="click" :options="languages" @select="changeLanguage">
          <img width="32px" src="@/assets/images/i18n.svg" alt="i18n" />
        </n-dropdown>
      </div>
      <n-divider vertical style="background-color: rgb(192 192 192)" />
      <div class="switch-theme-box">
        <n-switch
          v-model:value="state.switchTheme"
          alt="select theme"
          size="small"
          @update:value="handleChangeTheme"
        >
          <template #checked-icon>
            <img src="/src/assets/images/LightModeFilled.svg" alt="LightModeFilled" />
          </template>
          <template #unchecked-icon>
            <img src="/src/assets/images/NightlightRoundSharp.svg" alt="NightlightRoundSharp" />
          </template>
        </n-switch>
      </div>
      <n-divider vertical style="background-color: rgb(192 192 192)" />
      <div
        class="address-img-box"
        @click="redirectToExternal('https://github.com/BlackCat-lqk/MixBlog')"
      >
        <n-icon size="24">
          <img
            width="24px"
            v-if="themeStore.currentTheme == 'light'"
            src="@/assets/images/Github.svg"
            alt="github"
          />
          <img width="24px" v-else src="@/assets/images/GithubWhite.svg" alt="github" />
        </n-icon>
      </div>
      <div
        class="address-img-box"
        @click="redirectToExternal('https://space.bilibili.com/154164424?spm_id_from=333.1007.0.0')"
      >
        <n-icon size="24">
          <img width="24px" src="@/assets/images/Blibli.svg" alt="Blibli" />
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
import { useScroll } from '@vueuse/core'
import { useThemeStore } from '@/stores/themeStore'
import { useUserInfoStore } from '@/stores/userInfo'
import { useMessage } from 'naive-ui'
import { logOutUserApi } from '@/http/user'
import SetUserInfo from './components/SetUserInfo.vue'
import ForgotPwd from '@/views/RegisterLogin/components/ForgotPwd.vue'
import AlgoliaSearch from '@/components/AlgoliaSearch.vue'

const { locale, t } = useI18n()
const router = useRouter()
const userInfoStore = useUserInfoStore()
const themeStore = useThemeStore()
const message = useMessage()
const { y } = useScroll(window)
const languages = [
  { label: 'English', key: 'en-US' },
  { label: '中文', key: 'zh-CN' },
]
const showForgotPwdModal = ref(false)
const logoNight = '/uploads/defalut/logo-transparent-night.svg'
const logoLight = '/uploads/defalut/logo-transparent.svg'
const changeLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('locale', lang)

  // 设置html的lang属性
  document.documentElement.lang = lang

  // 如果需要，也可以设置dir属性（文字方向）
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
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
const jumpPage = async (path: string, idx?: number | undefined) => {
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
  background-color: var(--box-bg-color4);
  backdrop-filter: blur(10px);
  .header-logo-search-box {
    z-index: 1;
    @include g.flexCenter;
    height: 100%;

    .header-logo-box {
      width: auto;
      display: flex;
      align-items: center;
      height: 100%;
      justify-content: flex-start;
      > div {
        display: flex;
        align-items: center;
        margin-right: 20px;
        img {
          aspect-ratio: attr(width) / attr(height); /* 动态读取原始宽高比 */
          width: 56px; /* 或固定宽度 */
          height: auto; /* 高度自适应 */
          object-fit: contain; /* 保持比例，完整显示图片 */
          padding: 5px 0 0 8px;
        }
        span {
          font-weight: 500;
          color: var(--text-color);
        }
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
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 500;
        .more-item-box {
          display: flex;
          gap: 4px;
          align-items: center;
          border-radius: 10px;
          transition: all 0.5s;
          img {
            width: 24px;
          }
          span {
            font-size: 12px;
            line-height: 12px;
          }
          &:hover {
            scale: 1.2;
            transition: all 0.5s;
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
      cursor: pointer;
    }
    .switch-theme-box {
      :deep(.n-switch__rail) {
        box-shadow: 0 0 1px 1px #f7f7f7;
      }
    }
    .address-img-box {
      margin: 0 5px;
      cursor: pointer;
    }
  }
}
</style>
