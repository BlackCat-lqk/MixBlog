<template>
  <div class="header-view-box">
    <div class="logo-box">
      <div class="logo">
        <img :src="logoUrl" />
      </div>
      <n-gradient-text :size="16" type="info"> Mix Blog BMS </n-gradient-text>
      <n-button @click="router.push('/')" type="info"> 返回前台 </n-button>
    </div>
    <div class="menu-box">
      <div ref="timeDisplay">time</div>
      <div @click="changeTheme" class="theme-icon">
        <n-icon v-if="theme === 'light'" size="24">
          <img src="@/assets/images/LightModeFilled.svg" />
        </n-icon>
        <n-icon v-else size="24">
          <img src="@/assets/images/NightlightRoundSharp.svg" />
        </n-icon>
      </div>
      <div class="avatar-box">
        <n-avatar round size="small" :src="avatar" />
      </div>
      <div class="exit-box">
        <n-button type="info" @click="exitLogin"> Exit Login </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '@/stores/userInfo'
import { logOutUserApi } from '@/http/user'
import { useMessage } from 'naive-ui'

const logoUrl = new URL('./assets/images/logo-transparent.webp', import.meta.url).href
const userInfoStore = useUserInfoStore()
const message = useMessage()
const avatar = userInfoStore.data.user.avatar
const router = useRouter()
const theme = ref('light')
const changeTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
const timeDisplay = ref<HTMLElement | null>(null)

const updateClock = () => {
  const now = new Date()
  if (timeDisplay.value) {
    timeDisplay.value.textContent = now.toLocaleTimeString()
  }
  requestAnimationFrame(() => {
    setTimeout(updateClock, 1000)
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
onMounted(() => {
  updateClock()
})
</script>

<style lang="scss" scoped>
.header-view-box {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 10px 0px 5px 0px;
  position: fixed;
  z-index: 1;
  .logo-box {
    display: flex;
    align-items: center;
    height: 100%;
    .logo {
      width: 74px;
      height: 100%;
      display: flex;
      align-items: center;
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
    }
    .exit-box {
      margin-right: 10px;
    }
  }
}
</style>
