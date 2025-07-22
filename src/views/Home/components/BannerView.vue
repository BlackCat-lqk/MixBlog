<template>
  <div class="banner">
    <div class="banner-pic">
      <img v-if="sloganStore.sloganConfig.cover" :src="sloganStore.sloganConfig.cover" />
      <img v-else src="@/assets/images/logo2024.png" />
    </div>
    <div class="banner-left">
      <div>
        <div>
          <h1>
            <n-gradient-text type="info">
              {{ sloganStore.sloganConfig.sloganTitle }}
            </n-gradient-text>
          </h1>
          <p>
            <n-gradient-text type="danger">
              {{ sloganStore.sloganConfig.sloganSub1 }}
            </n-gradient-text>
          </p>
          <p>
            <n-gradient-text type="warning">
              {{ sloganStore.sloganConfig.sloganSub2 }}
            </n-gradient-text>
          </p>
        </div>
        <div></div>
      </div>
      <div class="scroll-down-box">
        <div class="scroll-down" @click="handelScrollDown">
          <n-icon size="40">
            <img
              v-if="themeStore.currentTheme == 'light'"
              src="@/assets/images/AngleDoubleDown.svg"
            />
            <img v-else src="@/assets/images/AngleDoubleDownWhite.svg" />
          </n-icon>
        </div>
        <div class="chat-ai-btn" @click="router.push('/d-chat')">
          <span class="pure-text-glow">MIX AI</span>
        </div>
      </div>
    </div>
    <div class="relative overflow-hidden">
      <LiquidChrome
        class="ripple-grid"
        :baseColor="[0.1, 0.1, 0.3]"
        :speed="0.3"
        :amplitude="0.3"
        :interactive="false"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useScrollStore } from '@/stores/scrollStore'
import { useSloganInfoStore } from '@/stores/configInfo'
import { useThemeStore } from '@/stores/themeStore'
import LiquidChrome from '@/views/VueBits/RippleGrid.vue'
import router from '@/router'
const themeStore = useThemeStore()
const sloganStore = useSloganInfoStore()

const scrollStore = useScrollStore()
const handelScrollDown = () => {
  const nowDate = new Date()
  scrollStore.scrollTo('scorll' + nowDate)
}
</script>

<style scoped lang="scss">
.banner {
  width: 100%;
  display: flex;
  margin: 64px 0;
  align-items: center;
  position: relative;
  background-color: var(--box-bg-color1);
  border-radius: 10px;
  overflow: hidden;
  .ripple-grid {
    position: absolute;
    top: 0%;
    left: 0%;
    width: 1480px;
    height: 800px;
  }
  .banner-left {
    flex: 1;
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
    .scroll-down-box {
      width: 100%;
      display: flex;
      margin-top: 40px;
    }
    .scroll-down {
      height: 80px;
      width: 64px;
      border-radius: 34px;
      background-image: linear-gradient(180deg, g.$btnColor 0%, g.$btnColor 100%);
      text-align: center;
      padding-top: 52px;
      margin-right: 40px;
      cursor: pointer;
      img {
        animation: scrollDown 1.5s ease-in-out infinite;
      }
    }
    h1 {
      font-size: 86px;
      font-weight: 600;
      letter-spacing: 0.44em;
      padding-top: 30px;
      font-family: 'Courier New', Courier, monospace;
      span {
        display: inline;
      }
    }
    p {
      padding-top: 20px;
      font-size: 78px;
      font-weight: 600;
      letter-spacing: 0.1em;
      font-family: 'Courier New', Courier, monospace;
    }
    .chat-ai-btn {
      cursor: pointer;
      margin-left: 30px;
      position: relative;
      width: 132px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(90deg, #40ffaa, #4079ff, #40ffaa, #4079ff, #40ffaa);
      border-radius: 50%;
      background-size: 400%;
      animation: gradient-text 50s linear infinite;
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
  }
  .banner-pic {
    z-index: 1;
    flex: 1;
    img {
      width: 80%;
      height: 80%;
      object-fit: cover;
    }
  }
}
</style>
