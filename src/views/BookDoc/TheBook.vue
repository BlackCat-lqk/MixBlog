<!-- TheBookPro.vue -->
<template>
  <div class="scene" :style="{ perspective: '800px' }">
    <div class="book" :style="bookTr" @mouseenter="open = true" @mouseleave="open = false">
      <!-- 封面 -->
      <div class="face front">
        <div class="front-content">
          <slot name="front"></slot>
        </div>
        <img :src="cover" />
      </div>

      <!-- 内页厚度层（视觉欺骗） -->
      <div class="face inner"></div>

      <!-- 封底 -->
      <div class="face back"></div>

      <!-- 书脊 -->
      <div class="face spine"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
const props = defineProps<{ cover: string; w?: number; h?: number; d?: number }>()
const w = props.w ?? 240
const h = props.h ?? 260
const d = props.d ?? 10
const open = ref(false)

const bookTr = computed(() => ({
  width: `${w}px`,
  height: `${h}px`,
  transform: `rotateY(${open.value ? -40 : 0}deg) rotateX(${open.value ? 18 : 0}deg) rotateZ(${open.value ? 2 : 0}deg)`,
}))
</script>

<style lang="scss" scoped>
.scene {
  display: inline-block;
}
.book {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.face {
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  box-shadow:
    inset 0 0 10px rgba(0, 0, 0, 0.1),
    2px 2px 8px rgba(0, 0, 0, 0.2);
}
.front {
  width: 100%;
  height: 100%;
  transform: translateZ(calc(v-bind(d) / 2 * 1px));
  border-radius: 0 4px 4px 0;
  position: relative;
  .front-content {
    width: calc(100% - 20px);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    gap: 5px;
    background-color: var(--box-bg-color4);
    backdrop-filter: blur(2px);
    padding: 10px;
  }
}
.front img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: crisp-edges;
  border-radius: inherit;
}
.inner {
  width: 100%;
  height: 100%;
  transform: translateZ(calc(v-bind(d) / 2 * 1px - 2px));
  background: linear-gradient(90deg, #e0e0e0 0%, #f5f5f5 5%, #fff 100%);
  box-shadow: inset -2px 0 5px rgba(0, 0, 0, 0.15);
  border-radius: inherit;
}
.back {
  width: 100%;
  height: 100%;
  transform: rotateY(180deg) translateZ(calc(v-bind(d) / 2 * 1px));
  background: #f2f2f2;
}
.spine {
  width: calc(v-bind(d) * 1px);
  height: 100%;
  transform: rotateY(-90deg) translateZ(calc(v-bind(d) / 2 * 1px));
  background: linear-gradient(60deg, #2c3e50, #34495e 70%, #4a6741);
  box-shadow: inset 2px 0 4px rgba(0, 0, 0, 0.3);
}
</style>
