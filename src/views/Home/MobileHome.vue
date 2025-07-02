<template>
  <div class="home">
    <mobile-header-nav></mobile-header-nav>
    <van-button type="primary" @click="router.push('/register-login')">返回登录</van-button>
  </div>
</template>

<script lang="ts" setup>
import MobileHeaderNav from '@/views/Header/MobileHeaderNav.vue';
import { useRouter  } from 'vue-router';

const router = useRouter();
</script>

<style scoped lang="scss">
.home {
  width: 100%;
  height: 100%;
}
</style>
