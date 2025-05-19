<template>
  <div class="background-container"></div>
  <div class="register-login-main-box">
    <div class="register-login-box">
      <div class="left-info-box">
        <div class="content-box">
          <div class="title-box">
            <span :class="isLogin ? 'active' : 'defalt'" @click="isLogin = true">Login</span>|<span
              :class="!isLogin ? 'active' : 'defalt'"
              @click="isLogin = false"
              >Register</span
            >
          </div>
          <div class="form-box">
            <login-view v-if="isLogin"></login-view>
            <register-view v-if="!isLogin"></register-view>
          </div>
        </div>
      </div>
      <div class="right-info-box" :class="isLogin ? 'loginBg' : 'registerBg'"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import LoginView from './components/LoginView.vue'
import RegisterView from './components/RegisterView.vue'

const isLogin = ref(true)
</script>

<style scoped lang="scss">
.background-container {
  position: fixed;
  width: 100%;
  height: 100%;
  background: url(@/assets/wallpaper/regist-login.jpg) no-repeat center center;
  background-size: cover;
  z-index: -1;
  top: 0;
  left: 0;
}
.register-login-main-box {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  @include g.flexCenter;
  .register-login-box {
    display: flex;
    width: 60vw;
    height: 60vh;
    @include g.borderRadius(10px);
    border: 1px solid #bfbfbf;
    .left-info-box {
      border-radius: 10px 0 0 10px;
      flex: 0.4;
      padding: 100px 20px 20px 50px;
      .content-box {
        height: 100%;
        display: flex;
        flex-direction: column;
        .title-box {
          margin-bottom: 30px;
          span {
            display: inline-block;
            &:hover {
              cursor: pointer;
            }
          }
        }
        .form-box {
          flex: 1;
        }
      }
      .defalt {
        color: rgb(199, 199, 199);
        font-size: 16px;
        margin-left: 10px;
        margin-right: 10px;
      }
      .active {
        font-size: 18px;
        font-weight: 600;
        color: #000;
        margin-right: 10px;
        margin-left: 10px;
      }
    }
    .right-info-box {
      flex: 0.6;
      border-radius: 0 10px 10px 0;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
    }
    .loginBg {
      background-image: url('@/assets/wallpaper/login-register-item.jpg');
    }
    .registerBg {
      background-image: url('@/assets/wallpaper/login-register-item2.jpg');
    }
  }
}
</style>
