<template>
  <div ref="containerRef" class="marquee-container" @mouseenter="pause" @mouseleave="play">
    <div
      class="marquee-content"
      :class="{ 'is-paused': !isPlaying }"
      :style="marqueeStyle"
      ref="contentRef"
    >
      <div
        class="marquee-item"
        v-for="(item, index) in displayItems"
        :key="index"
        :style="{ width: props.itemWidth + 'px', height: props.itemHeight + 'px' }"
      >
        <n-image :src="item" class="marquee-image" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import type { CSSProperties } from 'vue'

type Direction = 'left' | 'right'

interface MarqueeProps {
  items: string[]
  direction?: Direction
  speed?: number // px/s
  itemWidth?: number
  itemHeight?: number
}

const props = withDefaults(defineProps<MarqueeProps>(), {
  direction: 'left',
  speed: 30,
  itemWidth: 384,
  itemHeight: 216,
})

const isPlaying = ref(true)
const containerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const containerSize = ref(0)
const itemPadding = 15
const actualItemWidth = computed(() => props.itemWidth + 2 * itemPadding)

// 计算baseGroup，补齐到一组内容宽度>=容器宽度
const baseGroup = ref<string[]>([])
const displayItems = computed(() => [...baseGroup.value, ...baseGroup.value])
const animationDistance = ref(0)
const animationName = ref('')

const marqueeStyle = computed<CSSProperties>(() => {
  const duration = animationDistance.value / props.speed
  return {
    width: `${displayItems.value.length * actualItemWidth.value}px`,
    animation: `${animationName.value} ${duration}s linear infinite` as string,
    animationPlayState: isPlaying.value ? 'running' : 'paused',
    display: 'flex',
    alignItems: 'center',
  }
})

const play = () => {
  isPlaying.value = true
}
const pause = () => {
  isPlaying.value = false
}

function injectKeyframes() {
  const distance = animationDistance.value
  const name = `marquee-scroll-px-${props.direction}-${distance}`
  animationName.value = name
  if (document.getElementById(name)) return
  const style = document.createElement('style')
  style.id = name
  let keyframes = ''
  if (props.direction === 'left') {
    keyframes = `@keyframes ${name} { 0% { transform: translateX(0); } 100% { transform: translateX(-${distance}px); } }`
  } else {
    keyframes = `@keyframes ${name} { 0% { transform: translateX(-${distance}px); } 100% { transform: translateX(0); } }`
  }
  style.innerHTML = keyframes
  document.head.appendChild(style)
}

const updateSizes = () => {
  if (!containerRef.value) return
  containerSize.value = containerRef.value.clientWidth
  // 计算baseGroup
  if (!props.items.length) {
    baseGroup.value = []
    animationDistance.value = 0
    return
  }
  const minCount = Math.ceil(containerSize.value / actualItemWidth.value)
  const arr: string[] = []
  for (let i = 0; i < minCount; i++) {
    arr.push(props.items[i % props.items.length])
  }
  baseGroup.value = arr
  animationDistance.value = arr.length * actualItemWidth.value
  injectKeyframes()
}

onMounted(() => {
  nextTick(updateSizes)
  window.addEventListener('resize', updateSizes)
  watch(
    () => props.items,
    () => nextTick(updateSizes),
    { immediate: true },
  )
})
</script>

<style lang="scss" scoped>
.marquee-container {
  overflow: hidden;
  position: relative;
  // width: 100%;
  height: 236px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(30, 30, 30, 0.25));
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin: 25px 10px;
  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.25), rgba(40, 40, 40, 0.3));
    .marquee-image {
      transform: scale(1.02);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.7);
      border-color: rgba(255, 255, 255, 0.3);
    }
  }
}
.marquee-content {
  position: absolute;
  display: flex;
  height: 100%;
  align-items: center;
  left: 0;
  top: 0;
}
.marquee-item {
  flex-shrink: 0;
  /* width/height 由 :style 绑定 */
  transition: transform 0.3s ease-out;
  box-sizing: border-box;
  margin: 0 15px;
}
:deep(.n-image) {
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.marquee-image {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
@keyframes marquee-scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
@keyframes marquee-scroll-right {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
}
.is-paused {
  animation-play-state: paused !important;
}
</style>
