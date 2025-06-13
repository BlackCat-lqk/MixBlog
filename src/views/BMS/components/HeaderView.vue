<template>
  <div class="header-view-box">
    <div class="logo-box">
      <div class="logo">
        <img src="@/assets/images/logo-transparent.png" />
      </div>
      <n-gradient-text :size="24" type="success"> Mix Blog BMS </n-gradient-text>
      <p @click="router.push('/')">返回前台</p>
    </div>
    <div class="menu-box">
      <div @click="changeTheme" class="theme-icon">
        <n-icon v-if="theme === 'light'" size="24">
          <img src="@/assets/images/LightModeFilled.svg" />
        </n-icon>
        <n-icon v-else size="24">
          <img src="@/assets/images/NightlightRoundSharp.svg" />
        </n-icon>
      </div>
      <div class="avatar-box">
        <n-avatar
          round
          size="small"
          :src="avatar"
        />
      </div>
      <div class="exit-box">
        <n-button type="success"> Exit </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useUserInfoStore } from '@/stores/userInfo'

const userStore = useUserInfoStore()
const avatar = userStore.data.user.avatar
console.log(avatar)
const router = useRouter()
const theme = ref('light')
const changeTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
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
      width: 90px;
      height: 100%;
      margin-right: 10px;
      display: flex;
      align-items: center;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .menu-box {
    display: flex;
    align-items: center;
    .theme-icon {
      cursor: pointer;
      margin-right: 20px;
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
      .n-button {
        width: 80px;
      }
    }
  }
}
</style>
