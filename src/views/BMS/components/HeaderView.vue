<template>
  <div class="header-view-box">
    <div class="logo-box">
      <div class="logo">
        <img :src="logoUrl" alt="mixblog Logo url" />
      </div>
      <n-gradient-text :size="16" type="info" style="line-height: 55px">
        Mix Blog BMS
      </n-gradient-text>
      <n-button @click="router.push('/')" type="info"> 返回前台 </n-button>
    </div>
    <div class="menu-box">
      <div ref="timeDisplay"></div>
      <div class="switch-theme-box">
        <n-switch
          v-model:value="switchTheme"
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
      <div class="avatar-box">
          <n-avatar round size="small">
            <n-icon>
              <img v-if="userInfoStore.data.user.isLogin" :src="userInfoStore.data.user.avatar" alt="user avatar" />
              <img v-else src="@/assets/images/UserAvatarFilled.svg" alt="user avatar" />
            </n-icon>
          </n-avatar>
      </div>
      <div class="exit-box">
        <n-button type="info" @click="exitLogin"> Exit Login </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSloganInfoStore } from '@/stores/configInfo'
import { useThemeStore } from '@/stores/themeStore'
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '@/stores/userInfo'
import { logOutUserApi } from '@/http/user'
import { useMessage } from 'naive-ui'
import { _formatTime } from '@/utils/publickFun'
const sloganStore = useSloganInfoStore()

const logoUrl = sloganStore.sloganConfig.cover
const userInfoStore = useUserInfoStore()
const themeStore = useThemeStore()
const message = useMessage()
const router = useRouter()
const switchTheme = ref(false)
const headerColorTheme = ref('')
const handleChangeTheme = (value: boolean) => {
  if (value) {
    headerColorTheme.value = '#fff'
  } else {
    headerColorTheme.value = '#000'
  }
  themeStore.setTheme(value ? 'light' : 'dark')
}
const timeDisplay = ref<HTMLElement | null>(null)
const setTimeoutId = ref<ReturnType<typeof setTimeout> | null>(null)
const updateClock = () => {
  const now = _formatTime('')
  if (timeDisplay.value) {
    timeDisplay.value.textContent = now.time
  }
  requestAnimationFrame(() => {
    setTimeoutId.value = setTimeout(updateClock, 1000)
  })
}
// 退出登录
const exitLogin = async () => {
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
const initTheme = () => {
  const theme = localStorage.getItem('app-theme')
  switchTheme.value = theme === 'light'
  if (switchTheme.value) {
    headerColorTheme.value = '#fff'
  } else {
    headerColorTheme.value = '#000'
  }
}
onMounted(() => {
  updateClock()
  initTheme()
})
onUnmounted(() => {
  if (setTimeoutId.value) {
    clearTimeout(setTimeoutId.value)
  }
})
</script>

<style lang="scss" scoped>
.header-view-box {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--box-bg-color5);
  padding: 10px 0px 5px 0px;
  position: fixed;
  z-index: 1;
  .logo-box {
    display: flex;
    align-items: center;
    height: 100%;
    .logo {
      height: 50px;
      display: flex;
      align-items: center;
      margin-left: 10px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .n-button {
      margin-left: 10px;
      background: -webkit-linear-gradient(to right, #12c2e9, #c471ed, #f64f59);
      background: linear-gradient(to right, #12c2e9, #c471ed, #f64f59);
    }
  }
  .menu-box {
    display: flex;
    align-items: center;
    .switch-theme-box {
      margin: 0 20px;
    }
    .theme-icon {
      cursor: pointer;
      margin: 0 20px;
      display: flex;
      align-items: center;
    }
    .avatar-box {
      margin-right: 20px;
      display: flex;
      align-items: center;
      img{
        border-radius: 50%;
      }
    }
    .exit-box {
      margin-right: 10px;
    }
  }
}
</style>
