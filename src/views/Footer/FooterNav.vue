<template>
  <div class="footer-main-box">
    <span>技术支持</span>
    <n-divider />
    <div class="technical-support" v-for="item in 1" :key="item">
      <a class="technical-support-item-box" v-for="(item, idx) in supportData" :key="idx">
        <img :src="item.img" />
      </a>
    </div>
    <n-divider />
    <div class="footer-bottom-text">Mix Blog 1.0.0 · Made by LQK</div>
  </div>
</template>

<script lang="ts" setup>
const supportData = [
  {
    img: new URL('@/assets/images/footer/javascript_certification.png', import.meta.url).href,
  },
  {
    img: new URL('@/assets/images/footer/TepyScript.png', import.meta.url).href,
  },
  {
    img: new URL('@/assets/images/footer/vite.svg', import.meta.url).href,
  },
  {
    img: new URL('@/assets/images/footer/echarts.png', import.meta.url).href,
  },
  {
    img: new URL('@/assets/images/footer/vant4.png', import.meta.url).href,
  },
  {
    img: new URL('@/assets/images/footer/Github.svg', import.meta.url).href,
  },
  {
    img: new URL('@/assets/images/footer/vue3.svg', import.meta.url).href,
  },
  {
    img: new URL('@/assets/images/footer/naive.svg', import.meta.url).href,
  },
  {
    img: new URL('@/assets/images/footer/pinia.svg', import.meta.url).href,
  },
  {
    img: new URL('@/assets/images/footer/nodeJs.png', import.meta.url).href,
  },
  {
    img: new URL('@/assets/images/footer/express.svg', import.meta.url).href,
  },
  {
    img: new URL('@/assets/images/footer/scss.svg', import.meta.url).href,
  },
  {
    img: new URL('@/assets/images/footer/mongodb.svg', import.meta.url).href,
  },
  {
    img: new URL('@/assets/images/footer/esLint.svg', import.meta.url).href,
  },
  {
    img: new URL('@/assets/images/footer/unocss.svg', import.meta.url).href,
  },
]
</script>

<style scoped lang="scss">
.footer-main-box {
  background-color: var(--box-bg-color4);
  @include g.flexCenter;
  flex-direction: column;
  padding: 10px 30vw;
  padding-bottom: 4vh;
  span {
    display: inline-block;
    color: var(--sub-text-color);
    margin: 20px 0;
    &:nth-child(1) {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color);
    }
  }
  .technical-support {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 15px;
    .technical-support-item-box {
      height: 84px;
      background-color: #fff;
      margin: 0 5px;
      border-radius: 2px;
      padding: 10px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
  .footer-bottom-text {
    color: var(--text-color);
  }
}
</style>
