<template>
  <div class="home">
    <van-button type="primary" @click="router.push('/register-login')">返回登录</van-button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter  } from 'vue-router';

const router = useRouter();
</script>

<style scoped lang="scss">

</style>
