<!-- TheBookPro.vue -->
<template>
  <div class="scene" :style="bookTr">
    <div class="book" :style="bookTr" @mouseenter="open = true" @mouseleave="open = false">
      <!-- 封面 -->
      <div class="face front">
        <div class="front-content">
          <slot name="front"></slot>
        </div>
        <img :src="cover" alt="book cover" />
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
const props = defineProps<{ cover: string; w?: string; h?: string; d?: number }>()
const w = props.w ?? '240px'
const h = props.h ?? '280px'
const d = props.d ?? 26
const open = ref(false)

const bookTr = computed(() => ({
  width: `${w}`,
  height: `${h}`,
  transform: `rotateY(${open.value ? 12 : 0}deg) rotateX(${open.value ? 10 : 0}deg) rotateZ(${open.value ? 1 : 0}deg)`,
}))
</script>

<style lang="scss" scoped>
.scene {
  display: inline-block;
  box-shadow: var(--shadow-color);
  background-color: var(--box-bg-color5);
}
.book {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.face {
  position: absolute;
  top: 0%;
  left: 0%;
}
.front {
  left: 5%;
  width: 90%;
  height: 100%;
  transform: translateZ(calc(v-bind(d) / 2 * 1px));
  border-radius: 0 4px 4px 0;
  @include g.flexCenter;
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
    backdrop-filter: blur(3px);
    padding: 10px;
  }
}
.front img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.inner {
  width: 100%;
  height: 100%;
  transform: translateZ(calc(v-bind(d) / 2 * 1px - 2px));
  box-shadow: inset 2px 0 5px rgba(0, 0, 0, 0.15);
  border-radius: inherit;
  background: var(--box-bg-color1);
}
.back {
  width: 100%;
  height: 100%;
  transform: rotateY(180deg) translateZ(calc(v-bind(d) / 2 * 1px));
  background: var(--box-bg-color5);
}
.spine {
  width: calc(v-bind(d) * 1px);
  height: 100%;
  transform: rotateY(-90deg) translateZ(calc(v-bind(d) / 2 * 1px));
  box-shadow: inset 2px 0 4px rgba(0, 0, 0, 0.3);
  background: var(--box-bg-color5);
}
</style>
