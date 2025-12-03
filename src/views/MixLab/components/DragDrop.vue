<template>
  <div
    ref="draggableElement"
    :class="['draggable-item', className]"
    :style="positionStyle"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    <slot name="content">
      <p>坐标: {{ position }}</p>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Position {
  x: number
  y: number
}

interface BoundaryCache {
  minX: number
  maxX: number
  minY: number
  maxY: number
  width: number
  height: number
}

interface Props {
  initialPosition?: Position
  boundarySelector?: string // 边界选择器
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialPosition: () => ({ x: 0, y: 0 }),
  boundarySelector: '',
  className: '',
})

const emit = defineEmits<{
  (e: 'dragStart', position: Position): void // 拖拽开始
  (e: 'dragging', position: Position): void // 拖拽中
  (e: 'dragEnd', position: Position): void // 拖拽结束
}>()

const draggableElement = ref<HTMLElement | null>(null)
const position = ref<Position>({ ...props.initialPosition })
const isDragging = ref(false)
const startPos = ref<Position>({ x: 0, y: 0 })
const boundaryElement = ref<HTMLElement | null>(null)
const boundaryCache = ref<BoundaryCache>({
  minX: 0,
  maxX: 0,
  minY: 0,
  maxY: 0,
  width: 0,
  height: 0,
})

// 计算位置样式
const positionStyle = computed(() => ({
  transform: `translate(${position.value.x}px, ${position.value.y}px)`,
  cursor: isDragging.value ? 'grabbing' : 'grab',
}))

// 节流函数
// 替换原有的节流函数实现
const setTimeoutId = ref<ReturnType<typeof setTimeout> | null>(null)
const throttle = (func: (...args: [MouseEvent | TouchEvent]) => void, limit: number) => {
  let inThrottle = false
  return function (this: unknown, ...args: [MouseEvent | TouchEvent]) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeoutId.value = setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 开始拖拽
const startDrag = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  isDragging.value = true

  // 获取初始位置
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

  startPos.value = {
    x: clientX - position.value.x,
    y: clientY - position.value.y,
  }

  // 缓存边界值
  if (boundaryElement.value && draggableElement.value) {
    const boundaryRect = boundaryElement.value.getBoundingClientRect()
    const draggableRect = draggableElement.value.getBoundingClientRect()

    boundaryCache.value = {
      minX: 0,
      maxX: boundaryRect.width - draggableRect.width,
      minY: 0,
      maxY: boundaryRect.height - draggableRect.height,
      width: draggableRect.width,
      height: draggableRect.height,
    }
  }

  emit('dragStart', { ...position.value })

  // 添加事件监听
  window.addEventListener('mousemove', throttledOnDrag)
  window.addEventListener('touchmove', throttledOnDrag, { passive: false })
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchend', stopDrag)
}

let animationFrameId: number | null = null

// 拖拽中
const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return

  // 使用requestAnimationFrame来优化渲染性能
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  animationFrameId = requestAnimationFrame(() => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    let newX = clientX - startPos.value.x
    let newY = clientY - startPos.value.y

    // 使用缓存的边界值进行边界检查
    if (boundaryElement.value && draggableElement.value) {
      newX = Math.max(boundaryCache.value.minX, Math.min(newX, boundaryCache.value.maxX))
      newY = Math.max(boundaryCache.value.minY, Math.min(newY, boundaryCache.value.maxY))
    }

    position.value = { x: newX, y: newY }
    emit('dragging', { ...position.value })

    animationFrameId = null
  })
}

// 节流处理的拖拽事件
const throttledOnDrag = throttle(onDrag, 16)

// 停止拖拽
const stopDrag = () => {
  isDragging.value = false
  emit('dragEnd', { ...position.value })

  // 清理动画帧
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  // 移除事件监听
  window.removeEventListener('mousemove', throttledOnDrag)
  window.removeEventListener('touchmove', throttledOnDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchend', stopDrag)
}

// 初始化边界元素
onMounted(() => {
  if (props.boundarySelector) {
    boundaryElement.value = document.querySelector(props.boundarySelector)
  }
})

// 清理事件监听
onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('mousemove', throttledOnDrag)
  window.removeEventListener('touchmove', throttledOnDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchend', stopDrag)
  if (setTimeoutId.value) {
    clearTimeout(setTimeoutId.value)
  }
})
</script>

<style scoped lang="scss">
.draggable-item {
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
  transition: transform 0.1s ease;
  z-index: 10;
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  will-change: transform;
  transform: translate3d(0, 0, 0);
}
</style>
