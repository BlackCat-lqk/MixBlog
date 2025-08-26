<template>
  <!-- <div>
    实验性项目，在这里尽情发挥想象...
  </div> -->
  <div class="mix-lab-main">
    <Prism
      class="prism-box"
      animation-type="3drotate"
      :time-scale="0.5"
      :height="3.5"
      :base-width="5.5"
      :scale="3.6"
      :hue-shift="0"
      :color-frequency="1"
      :noise="0.1"
      :glow="1"
    />
    <div class="mix-lab-content">
      <n-icon size="64">
        <img width="64px" src="@/assets/images/lab.svg" alt="Laboratory" />
      </n-icon>
      <span style="color: #fff"> 实验性项目，在这里尽情发挥想象... </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Prism from '@/views/VueBits/BitsPrism.vue'
</script>

<style lang="scss" scoped>
.mix-lab-main {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: black;
  .prism-box {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
  }
  .mix-lab-content {
    width: 100%;
    height: 100%;
  }
}
</style>
