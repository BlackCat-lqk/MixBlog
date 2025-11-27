<template>
  <div class="footer-main-box">
    <div class="technical-support">
      <n-marquee auto-fill :speed="4">
        <a
          class="technical-support-item-box"
          v-for="(item, idx) in supportData.slice(0, 10)"
          :key="idx"
          :href="item.url"
          target="_blank"
        >
          <n-image width="80" height="80" preview-disabled :src="item.img" />
        </a>
      </n-marquee>
    </div>
    <div class="technical-support-reverse technical-support">
      <n-marquee auto-fill :speed="4">
        <a
          class="technical-support-item-box"
          v-for="(item, idx) in supportData.slice(10, 20)"
          :key="idx"
          :href="item.url"
          target="_blank"
        >
          <n-image width="80" height="80" preview-disabled :src="item.img" />
        </a>
      </n-marquee>
    </div>
    <div class="footer-bottom-text">{{ $t('footer.content') }}</div>
    <div class="icp-filing-text">
      <span>备案/许可证</span>
      <br />
      <span>Recordation / License</span>
      <br />
      <span><a href="https://beian.miit.gov.cn/#/Integrated/index">桂ICP备2025066402号</a></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const supportData = [
  {
    img: new URL('@/assets/images/footer/vue3.svg', import.meta.url).href,
    url: 'https://v3.cn.vuejs.org/',
    alt: 'vue3',
  },
  {
    img: new URL('@/assets/images/footer/typescript.svg', import.meta.url).href,
    url: 'https://www.typescriptlang.org/',
    alt: 'typescript',
  },
  {
    img: new URL('@/assets/images/footer/vite.svg', import.meta.url).href,
    url: 'https://cn.vitejs.dev/',
    alt: 'vitejs',
  },
  {
    img: new URL('@/assets/images/footer/Echarts.svg', import.meta.url).href,
    url: 'https://echarts.apache.org/index.html',
    alt: 'echarts',
  },
  {
    img: new URL('@/assets/images/footer/vant.svg', import.meta.url).href,
    url: 'https://vant-ui.github.io/vant/',
    alt: 'vant',
  },
  {
    img: new URL('@/assets/images/footer/JavaScript.svg', import.meta.url).href,
    url: 'https://www.javascript.com/',
    alt: 'javascript',
  },
  {
    img: new URL('@/assets/images/footer/Github.svg', import.meta.url).href,
    url: 'https://github.com/',
    alt: 'github',
  },
  {
    img: new URL('@/assets/images/footer/naive.svg', import.meta.url).href,
    url: 'https://www.naiveui.com/',
    alt: 'naive ui',
  },
  {
    img: new URL('@/assets/images/footer/pinia.svg', import.meta.url).href,
    url: 'https://pinia.vuejs.org/',
    alt: 'pinia',
  },
  {
    img: new URL('@/assets/images/footer/Nodejs.svg', import.meta.url).href,
    url: 'https://nodejs.org/',
    alt: 'nodejs',
  },
  {
    img: new URL('@/assets/images/footer/express.svg', import.meta.url).href,
    url: 'https://expressjs.com/',
    alt: 'express',
  },
  {
    img: new URL('@/assets/images/footer/scss.svg', import.meta.url).href,
    url: 'https://sass-lang.com/',
    alt: 'scss',
  },
  {
    img: new URL('@/assets/images/footer/deepseek.svg', import.meta.url).href,
    url: 'https://www.deepseek.com/',
    alt: 'deepseek',
  },
  {
    img: new URL('@/assets/images/footer/mongodb.svg', import.meta.url).href,
    url: 'https://www.mongodb.com/',
    alt: 'mongodb',
  },
  {
    img: new URL('@/assets/images/footer/esLint.svg', import.meta.url).href,
    url: 'https://eslint.org/',
    alt: 'eslint',
  },
  {
    img: new URL('@/assets/images/footer/unocss.svg', import.meta.url).href,
    url: 'https://unocss.dev/',
    alt: 'unocss',
  },
  {
    img: new URL('@/assets/images/footer/vuebits.svg', import.meta.url).href,
    url: 'https://vue-bits.dev/',
    alt: 'vuebits',
  },
  {
    img: new URL('@/assets/images/footer/quill.svg', import.meta.url).href,
    url: 'https://quilljs.com/',
    alt: 'quill',
  },
  {
    img: new URL('@/assets/images/footer/oxlint.svg', import.meta.url).href,
    url: 'https://oxc.rs/docs/guide/usage/linter/config.html',
    alt: 'oxlint',
  },
  {
    img: new URL('@/assets/images/footer/bt.svg', import.meta.url).href,
    url: 'https://www.bt.cn/new/index.html',
    alt: 'BT.CN',
  },
]
</script>

<style scoped lang="scss">
.footer-main-box {
  background-color: var(--box-bg-color4);
  @include g.flexCenter;
  flex-direction: column;
  padding: 24px 20vw 4vh 20vw;
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
    position: relative;
    .technical-support-item-box {
      height: 84px;
      width: 84px;
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
  .technical-support::after {
    content: '';
    position: absolute;
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: var(--box-bg-color8);
  }
  .technical-support-reverse {
    margin-top: 10px;
    margin-bottom: 24px;
    :deep(.n-marquee .n-marquee__group) {
      animation-direction: alternate-reverse;
    }
  }
  .footer-bottom-text {
    line-height: 1.54;
    color: var(--text-color);
    padding-bottom: 10px;
  }
  .icp-filing-text {
    text-align: center;
    span {
      color: var(--text-color3);
      font-size: 14px;
      font-weight: 400;
      margin: 5px auto;
      a {
        padding-left: 10px;
        color: var(--text-color3);
        &:hover {
          color: #0aa9db;
          text-decoration-line: underline;
        }
      }
    }
  }
}
</style>
