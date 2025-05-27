<template>
  <div class="my-logo">
    <img src="@/assets/images/logo-transparent.png" @click="toHome" />
  </div>
  <div class="about-main-box">
    <div class="background-layer">
      <div class="background-layer-box">
        <div class="left-box">
          <div v-for="(item, idx) in 4" :key="idx" class="tag tag-l">说点什么</div>
          <div v-for="(item, idx) in 4" :key="idx" class="tag tag-l">说点</div>
        </div>
        <div class="right-box">
          <div v-for="(item, idx) in 4" :key="idx" class="tag tag-r">说点什么</div>
          <div v-for="(item, idx) in 4" :key="idx" class="tag tag-r">说点</div>
        </div>
      </div>
    </div>
    <div class="about-content-box">
      <div class="about-content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const toHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.my-logo {
  position: fixed;
  width: 160px;
  height: 120px;
  top: 0;
  left: 0;
  z-index: 2;
  img {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
.about-main-box {
  width: 100%;
  overflow-y: auto;
  position: relative;
  .background-layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-image: url('@/assets/wallpaper/about1.png');
    background-position: center center;
    background-size: cover;
    z-index: 0;
    @include g.flexCenter;
    .background-layer-box {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0 120px;
      .left-box,
      .right-box {
        display: flex;
        gap: 24px;
        justify-content: flex-start;
        flex-direction: column;
        transition: all 0.2s ease-in-out;
        .tag {
          width: auto;
          cursor: pointer;
          border-radius: 40px;
          padding: 9px 24px;
          color: #0b1926;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0);
        }
        .tag-l {
          text-align: left;
        }
        .tag-r {
          text-align: right;
        }
      }
    }
  }

  .about-content-box {
    width: 100%;
    margin: 100vh auto 0 auto;
    background-color: #f4f2ec;
    position: relative;
    @include g.flexCenter;
    .about-content {
      min-width: 1440px;
      max-width: 1680px;
      height: 100vh;
      z-index: 1;
      background-color: #fff;
    }
  }
}
</style>
