<template>
  <div class="progress-border">
    <div class="progress-bar">
      <div class="progress" ref="progressRef">
        <div class="progress-text">{{ progress }}{{ props.unitText }}</div>
        <div class="progress-fill"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
const progressRef = ref<HTMLBodyElement | null>(null)
const progress = ref(0)
const props = defineProps<{
  progressData: number
  unitText: string
}>()

// 初始化进度条
const initWaterBall = () => {
  if (progressRef) {
    const wave = progressRef.value
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
  padding: 4px;
  width: 400px;
  height: 32px;
  border: 3px solid #fff;
  border-radius: 999px;
  overflow: hidden;
  margin: 0 20px;
  .progress-bar {
    position: relative;
    width: 100%;
    height: 100%;
    .progress {
      position: relative;
      height: 100%;
      width: calc(var(--progress) * 1%);
      border-radius: 999px;
      mask: linear-gradient(#fff, #fff) content-box;
      -webkit-mask: linear-gradient(#fff, #fff) content-box;
      background-color: #0046dc;
      .progress-fill {
        position: absolute;
        height: 100%;
        width: 100%;
        border-radius: 999px;
        transition: width 0.5s ease-in-out;
        background-size: 200% 100%;
        background-image: linear-gradient(125deg #54d5dd 10%, #805dff 90%);
        animation: shine 2s infinite linear;
      }
    }
  }
  .progress-text {
    position: relative;
    font-size: 16px;
    color: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    padding-right: 10px;
  }
  @keyframes shine {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
}
</style>
