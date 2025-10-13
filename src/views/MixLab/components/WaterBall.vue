<template>
  <div class="progress-border">
    <div class="wave" ref="waveRef">
      <div class="wave1"></div>
      <div class="wave2"></div>
    </div>
    <div class="progress-text">{{ progress }}{{ props.unitText }}</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
const waveRef = ref<HTMLBodyElement | null>(null)
const progress = ref(0)
const props = defineProps<{
  progressData: number
  unitText: string
}>()

// 初始化水球
const initWaterBall = () => {
  if (waveRef) {
    const wave = waveRef.value
    if (!wave) return
    wave.style.setProperty('--progress', progress.value.toString())
    if (progress.value >= 100) {
      wave.style.setProperty('--progress', '100')
    }
  }
}
watch(
  () => props.progressData,
  (newValue) => {
    progress.value = newValue
    initWaterBall()
  },
  { immediate: true },
)
onMounted(() => {
  initWaterBall()
})
</script>

<style lang="scss" scoped>
.progress-border {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 4px solid rgba(43, 180, 234, 0.3);
  box-shadow:
    rgba(1, 230, 246, 0.25) 0px 30px 60px -12px inset,
    rgba(34, 0, 253, 0.3) 0px 18px 36px -18px inset,
    rgba(46, 253, 0, 0.1) 0px 48px 28px -16px inset;
  overflow: hidden;
  .progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    font-weight: bold;
    color: #fff;
  }
  .wave {
    position: absolute;
    width: 200%;
    height: 200%;
    left: 50%;
    transform: translateX(-50%);
    transform-origin: center center;
    top: calc(100% - var(--progress) * 1%);
    .wave1 {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 40%;
      transform-origin: center center;
      background-color: #5858ff;
      animation: wave1 4s linear infinite;
    }
    .wave2 {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 40%;
      transform-origin: center center;
      background-color: #8888ffd4;
      animation: wave2 5s linear infinite;
    }
    @keyframes wave1 {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    @keyframes wave2 {
      0% {
        transform: rotate(45deg);
      }
      100% {
        transform: rotate(405deg);
      }
    }
  }
}
</style>
