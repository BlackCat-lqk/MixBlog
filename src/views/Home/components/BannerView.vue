<template>
  <div class="banner">
    <div v-show="!imageLoading" class="banner-pic">
      <div class="skeleton1">
        <n-skeleton
          height="calc(100% - 20px)"
          width="100%"
          style="border-radius: 8px; top: 50%; transform: translate(10px, 0%)"
        />
      </div>
    </div>
    <div v-show="imageLoading" class="banner-pic">
      <img
        :src="sloganStore.sloganConfig.cover"
        alt="slogan cover"
        @load="onImageLoad"
        @error="onImageError"
      />
    </div>
    <div v-show="!imageLoading" class="banner-left">
      <div class="skeleton2">
        <n-skeleton height="86px" width="100%" round style="margin-top: 30px" />
        <n-skeleton height="72px" width="100%" round style="margin-top: 20px" />
        <n-skeleton height="72px" width="100%" round style="margin-top: 20px" />
        <div class="skeleton3">
          <n-skeleton
            height="132px"
            width="64px"
            style="margin-top: 20px; border-radius: 34px; margin-right: 40px"
          />
          <n-skeleton height="132px" width="132px" round style="margin: 20px 0 0 30px" />
        </div>
      </div>
    </div>
    <div v-show="imageLoading" class="banner-left">
      <div>
        <div>
          <p class="p-h1">
            {{ sloganStore.sloganConfig.sloganTitle }}
          </p>

          <TextType
            :text="[
              '时光逝水轻抚过，岁月飘摇风雨中',
              'Time flows, gently touched; Years adrift in wind and rain.',
              '掌控你的身体和思想',
              'Control your own mind and body'
            ]"
            :typingSpeed="100"
            :pauseDuration="2000"
            :showCursor="true"
            cursorCharacter="▌"
            className="p-h2"
          />
          <!-- <p>
            {{ sloganStore.sloganConfig.sloganSub1 }}
          </p>
          <p>
            {{ sloganStore.sloganConfig.sloganSub2 }}
          </p> -->
        </div>
        <div></div>
      </div>
      <div class="advertising-box">
        <div
          class="advertising"
          @click="
            redirectToExternal(
              'https://github.com/BlackCat-lqk/X-Tools-exe/releases/tag/X-Tools1.0.0',
            )
          "
        >
          <!-- <n-icon size="40">
            <img
              v-if="themeStore.currentTheme == 'light'"
              src="@/assets/images/AngleDoubleDown.svg"
              alt="scroll Down"
            />
            <img v-else src="@/assets/images/AngleDoubleDownWhite.svg" alt="scroll Down" />
          </n-icon> -->
          <img src="@/assets/images/xtools.webp" alt="X-Tools" />
        </div>
        <router-link :to="{ path: '/mixlab' }" target="_blank" rel="noopener noreferrer">
          <div class="advertising">
            <img width="32px" src="@/assets/images/lab.svg" alt="Laboratory" />
          </div>
        </router-link>
        <div class="chat-ai-btn" @click="router.push('/d-chat')">
          <span class="pure-text-glow">MIX AI</span>
        </div>
      </div>
    </div>
    <BitsGalaxy
      class="ripple-grid"
      v-if="imageLoading && themeStore.currentTheme == 'dark'"
      :mouse-repulsion="false"
      :mouse-interaction="true"
      :density="1"
      :glow-intensity="0.3"
      :saturation="0"
      :hue-shift="140"
    />

    <PrismaticBurst
      v-if="imageLoading && themeStore.currentTheme == 'light'"
      animationType="rotate3d"
      class="ripple-grid"
      :intensity="5"
      :speed="0.5"
      :distort="5.0"
      :paused="false"
      :offset="{ x: 0, y: 0 }"
      :hoverDampness="0.25"
      :rayCount="2"
      mixBlendMode="lighten"
      :colors="['#ff007a', '#654ea3', '#f5af19']"
    />
  </div>
</template>

<script lang="ts" setup>
import { useSloganInfoStore } from '@/stores/configInfo'
import { useThemeStore } from '@/stores/themeStore'
const PrismaticBurst = defineAsyncComponent(() => import('@/views/VueBits/PrismaticBurst.vue'))
const TextType = defineAsyncComponent(() => import('@/views/VueBits/TextType.vue'))
const BitsGalaxy = defineAsyncComponent(() => import('@/views/VueBits/BitsGalaxy.vue'))
import router from '@/router'
const themeStore = useThemeStore()
const sloganStore = useSloganInfoStore()

// 图片加载状态
const imageLoading = ref(false)

// 图片加载完成事件
const onImageLoad = () => {
  console.log('图片加载完成')
  imageLoading.value = true
  console.log('🚀 ~ onImageLoad ~ true:', true)
}
// 图片加载失败事件
const onImageError = () => {
  console.log('图片加载失败')
  imageLoading.value = false
}
const redirectToExternal = (url: string) => {
  window.open(url, '_blank')
}
onBeforeMount(() => {
  // 动态创建 preload 标签
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = sloganStore.sloganConfig.cover
  document.head.appendChild(link)
  console.log('🚀 ~ mounted ~ true:', true)
})
</script>

<style scoped lang="scss">
@font-face {
  font-family: 'MyCustomFont';
  src:
    url('@/assets/font/QG8fvHslXdtr.woff2') format('woff2'),
    url('@/assets/font/QG8fvHslXdtr.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-variation-settings:
    'SRIF' 1,
    'slnt' 12,
    'wdth' 75,
    'wght' 630.08;
  font-display: swap;
}
.banner {
  width: 100%;
  display: flex;
  margin: 64px 0;
  height: 512px;
  align-items: center;
  position: relative;
  background: var(--box-bg-color9);
  border-radius: 10px;
  overflow: hidden;
  .ripple-grid {
    position: absolute;
    top: 0%;
    left: 0%;
    width: 1480px;
    height: 640px;
  }
  .banner-left {
    flex: 1;
    min-width: 700px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-right: 80px;
    z-index: 1;
    @keyframes scrollDown {
      0% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(10px);
      }
      100% {
        transform: translateY(0);
      }
    }
    .advertising-box {
      width: 100%;
      display: flex;
      margin-top: 10px;
      align-items: center;
    }
    .advertising {
      height: 80px;
      width: 80px;
      border-radius: 8px;
      background-color: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(20px);
      text-align: center;
      padding: 10px;
      margin-right: 20px;
      cursor: pointer;
      @include g.flexCenter;
      img {
        // animation: scrollDown 1.5s ease-in-out infinite;
        width: 80px;
      }
    }
    .p-h1 {
      font-size: 86px;
      font-weight: 700;
      letter-spacing: 0.24em;
      padding-top: 30px;
      font-family: 'MyCustomFont', sans-serif;
      font-variation-settings:
        'SRIF' 1,
        'slnt' 8,
        'wdth' 75,
        'wght' 630.08;
      background: linear-gradient(45deg, #77f7c8, #5ffffa, #001194);
      opacity: 0.8;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent; /* 降级处理 */
      span {
        display: inline;
      }
    }

    .p-h2 {
      font-size: 42px;
      height: 140px;
      padding: 20px 0;
      line-height: 1.54;
    }

    p {
      padding-top: 20px;
      font-size: 72px;
      letter-spacing: 0.14em;
      font-family: 'MyCustomFont', sans-serif;
      font-variation-settings:
        'SRIF' 1,
        'slnt' 8,
        'wdth' 75,
        'wght' 630.08;
      background: linear-gradient(45deg, #6bb3ff, #4ecdc4);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent; /* 降级处理 */
      opacity: 0.8;
    }
    .chat-ai-btn {
      cursor: pointer;
      position: relative;
      width: 132px;
      height: 132px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(90deg, #40ffaa, #4079ff, #40ffaa, #4079ff, #40ffaa);
      border-radius: 50%;
      background-size: 400%;
      animation: gradient-text 50s linear infinite;
      animation: gradient-box 3s linear infinite;
      .pure-text-glow {
        background: linear-gradient(90deg, #40ffaa, #4079ff, #40ffaa, #4079ff, #40ffaa);
        background-size: 400% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: gradient-text 20s linear infinite;
        font-size: 24px;
        font-weight: bold;
        text-shadow: none;
        box-shadow: none;
        z-index: 1;
      }
    }
    .chat-ai-btn::before {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      right: 3px;
      bottom: 3px;
      background: var(--box-bg-color1);
      background-size: 400%;
      border-radius: 50%;
      filter: blur(4px);
      z-index: 0;
    }
    @keyframes gradient-text {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 400% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    @keyframes gradient-box {
      0% {
        scale: 1;
      }
      50% {
        scale: 1.1;
      }
      100% {
        scale: 1;
      }
    }
  }
  .banner-pic {
    z-index: 1;
    min-width: 512px;
    width: 512px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
.skeleton1 {
  position: absolute;
  left: 0;
  top: 0;
  width: 512px;
  height: 512px;
  padding: 10px;
}
.skeleton2 {
  position: absolute;
  top: 0;
  left: 700px;
  width: 512px;
  height: 512px;
  .skeleton3 {
    display: flex;
    margin-top: 10px;
  }
}
</style>
