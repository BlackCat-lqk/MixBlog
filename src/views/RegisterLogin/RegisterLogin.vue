<template>
  <n-config-provider style="width: 100%; height: 100%" :theme="null">
    <div class="register-login-main-box">
      <div class="register-login-box">
        <div class="left-info-box">
          <div class="content-box">
            <div class="title-box">
              <span :class="isLogin ? 'active' : 'defalt'" @click="isLogin = true">Login</span
              >&nbsp;|&nbsp;<span :class="!isLogin ? 'active' : 'defalt'" @click="isLogin = false"
                >Register</span
              >
            </div>
            <div class="form-box">
              <login-view v-if="isLogin"></login-view>
              <register-view v-if="!isLogin"></register-view>
            </div>
          </div>
        </div>
      </div>
    </div>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import LoginView from './components/LoginView.vue'
import RegisterView from './components/RegisterView.vue'

const isLogin = ref(true)
</script>

<style scoped lang="scss">
@keyframes smoothGradientFlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.register-login-main-box {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, #aa4b6b, #6b6b83, #3b8d99, #c6ffdd, #fbd786, #f7797d);
  background-size: 400% 400%;
  animation: smoothGradientFlow 25s ease-in-out infinite;
  @include g.flexCenter;
  .register-login-box {
    display: flex;
    width: 600px;
    min-width: 400px;
    max-width: 700px;
    min-height: 700px;
    height: auto;
    @include g.borderRadius(10px);
    box-shadow: 0 0 5px 2px rgba(75, 75, 75, 0.3);
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    background-color: rgba(255, 255, 255, 0.2);
    .left-info-box {
      @include g.borderRadius(10px);
      flex: 1;
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
        color: rgb(81, 81, 81);
        font-size: 14px;
      }
      .active {
        font-size: 24px;
        font-weight: 600;
        color: #000;
      }
    }
    .right-info-box {
      flex: 1;
      border-radius: 0 10px 10px 0;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
    }
  }
}
</style>
