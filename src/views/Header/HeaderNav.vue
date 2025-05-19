<template>
  <div class="header-main-box" :style="{ background: bgColor }">
    <div class="background-blur" :style="{ filter: `blur(${opacity}px)` }"></div>
    <div>logo</div>
    <div class="oprate-box">
      <n-avatar round :size="40" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
      <span @click="toLogion">去登录</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useScroll } from '@vueuse/core'

const router = useRouter()

const { y } = useScroll(window)
const opacity = ref(0)
const bgColor = ref('transparent')
const toLogion = () => {
  router.push('/register-login')
}

watch(y, (newVal) => {
  const maxOpacityScroll = 200
  if (newVal >= maxOpacityScroll) {
    opacity.value = Math.min(newVal / maxOpacityScroll, 30)
    bgColor.value = '#f4f2ec'
  } else {
    bgColor.value = 'transparent'
  }
})
</script>
<style scoped lang="scss">
.header-main-box {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  transition: all 0.3s;
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  .background-blur {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    opacity: v-bind('opacity > 0 ? 0.8 : 0');
    z-index: -1;
    transition: filter 0.3s ease;
  }
  .oprate-box {
    display: flex;
    align-items: center;
    margin-right: 20px;
    > span {
      margin-left: 10px;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
  }
}
</style>
