<template>
  <div class="about-main-box">
    <div class="background-layer">
      <div></div>
      <div></div>
    </div>
    <div class="about-content-box">
      <!-- 可以放很多内容 -->
      <p v-for="i in 20" :key="i">这里是滚动内容 {{ i }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.about-main-box {
  width: 100%;
  overflow-y: auto;
  position: relative;
}

.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-image: url('@/assets/wallpaper/regist-login.jpg');
  background-position: center center;
  background-size: cover;
  z-index: 0;
}

.about-content-box {
  width: 100%;
  margin: 100vh auto 0 auto;
  background-color: #a7a4a4;
  height: 100vh;
  position: relative;
  z-index: 1;
}
</style>
