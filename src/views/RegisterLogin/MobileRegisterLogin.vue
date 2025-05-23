<template>
  <div>
    <div>
      <span :class="isLogin ? 'active' : 'defalt'" @click="isLogin = true">Login</span>|<span
              :class="!isLogin ? 'active' : 'defalt'"
              @click="isLogin = false"
              >Register</span
            >
    </div>
    <login-view v-if="isLogin"></login-view>
    <register-view v-if="!isLogin"></register-view>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import LoginView from './components/MobileLogin.vue'
import RegisterView from './components/MobileRegister.vue'

const isLogin = ref(true)

</script>

<style scoped lang="scss">
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
</style>
