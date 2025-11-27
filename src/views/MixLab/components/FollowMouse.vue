<template>
  <div
    class="mouse-glow-container"
    ref="containerRef"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    :style="{cursor: props.cursor ? 'default' : 'none'}"
  >
    <div class="glow-effect" :style="glowStyle"></div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  size?: number // 光晕大小
  color?: string // 光晕颜色
  blur?: number // 模糊程度
  opacity?: number // 不透明度
  transitionDuration?: number // 过渡持续时间
  cursor?: boolean // 是否显示光标
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
  color: 'rgba(255, 255, 255, 0.5)',
  blur: 30,
  opacity: 1,
  transitionDuration: 300,
  cursor: false
})

const containerRef = ref<HTMLElement | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)
const isVisible = ref(false)

// 计算光晕的位置样式
const glowStyle = computed(() => {
  return {
    width: `${props.size}px`,
    height: `${props.size}px`,
    left: `${mouseX.value - props.size / 2}px`,
    top: `${mouseY.value - props.size / 2}px`,
    opacity: isVisible.value ? props.opacity : 0,
    transition: `opacity ${props.transitionDuration}ms ease, transform ${props.transitionDuration}ms ease`,
    background: `radial-gradient(circle, ${props.color} 0%, transparent 70%)`,
    filter: `blur(${props.blur}px)`,
    cursor: props.cursor ? 'default' : 'none'
  }
})

// 处理鼠标移动
const handleMouseMove = (e: MouseEvent) => {
  if (!containerRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
  isVisible.value = true
}

// 处理鼠标离开
const handleMouseLeave = () => {
  isVisible.value = false
}

// 性能优化：使用requestAnimationFrame限制更新频率
const rafId: number | null = null

onMounted(() => {
  if (!containerRef.value) return
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.mouse-glow-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  cursor: none;
}

.glow-effect {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
  transform: translateZ(0); /* 触发GPU加速 */
  will-change: left, top, opacity; /* 性能优化 */
  z-index: 9999;
}
</style>
