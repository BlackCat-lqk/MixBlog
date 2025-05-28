<template>
  <div class="header-view-box">
    <div class="logo-box">
      <div class="logo">
        <img src="@/assets/images/logo-transparent.png">
      </div>
      <span>Mix Blog BMS</span>
    </div>
    <div class="menu-box">
      <div @click="changeTheme">
        <n-icon v-if="theme === 'light'" size="40">
          <img src="@/assets/images/LightModeFilled.svg">
        </n-icon>
        <n-icon v-else size="40">
          <img src="@/assets/images/NightlightRoundSharp.svg">
        </n-icon>
      </div>
      <div>
        <n-avatar
      round
      size="large"
      src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
    />
      </div>
      <div>
        <n-button type="success">
          Exit
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const theme = ref('light');
const changeTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
}
</script>

<style lang="scss" scoped>
.header-view-box{
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  .logo-box {
    display: flex;
    align-items: center;
    .logo {
      width: 120px;
      height: 60px;
      margin-right: 10px;
      img{
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    span{
      font-size: 20px;
      font-weight: 600;
      color: #1e2025;
    }
  }
  .menu-box {
    display: flex;
    align-items: center;
  }

}
</style>
