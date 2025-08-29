<template>
  <div class="gradient-mask" :style="maskStyle" @click="handleClick">
    <div class="mask-content" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults } from 'vue'

// 渐变方向类型
type GradientDirection =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center'
  | 'horizontal'
  | 'vertical'
  | 'radial'

interface Props {
  // 是否显示遮罩层
  visible?: boolean
  // 渐变方向
  direction?: GradientDirection
  // 起始颜色
  startColor?: string
  // 结束颜色
  endColor?: string
  // 渐变范围 (百分比或像素)
  size?: string
  // 是否启用动画
  animated?: boolean
  // 动画持续时间 (ms)
  duration?: number
  // 点击遮罩层是否触发事件
  clickable?: boolean
  // 内容位置
  contentPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center'
  // 内容区域自定义样式
  contentStyle?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  visible: true,
  direction: 'center',
  startColor: 'rgba(0, 0, 0, 0.8)',
  endColor: 'rgba(0, 0, 0, 0)',
  size: '50%',
  animated: true,
  duration: 500,
  clickable: true,
  contentPosition: 'center',
  contentStyle: () => ({})
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

// 生成渐变样式
const maskStyle = computed(() => {
  const style: Record<string, string> = {
    '--start-color': props.startColor,
    '--end-color': props.endColor,
    '--size': props.size,
    '--duration': `${props.duration}ms`,
    'display': props.visible ? 'block' : 'none'
  }

  // 根据方向设置渐变
  switch (props.direction) {
    case 'top':
      style.background = `linear-gradient(to bottom, var(--start-color) 0%, var(--end-color) var(--size))`
      break
    case 'bottom':
      style.background = `linear-gradient(to top, var(--start-color) 0%, var(--end-color) var(--size))`
      break
    case 'left':
      style.background = `linear-gradient(to right, var(--start-color) 0%, var(--end-color) var(--size))`
      break
    case 'right':
      style.background = `linear-gradient(to left, var(--start-color) 0%, var(--end-color) var(--size))`
      break
    case 'top-left':
      style.background = `linear-gradient(to bottom right, var(--start-color) 0%, var(--end-color) var(--size))`
      break
    case 'top-right':
      style.background = `linear-gradient(to bottom left, var(--start-color) 0%, var(--end-color) var(--size))`
      break
    case 'bottom-left':
      style.background = `linear-gradient(to top right, var(--start-color) 0%, var(--end-color) var(--size))`
      break
    case 'bottom-right':
      style.background = `linear-gradient(to top left, var(--start-color) 0%, var(--end-color) var(--size))`
      break
    case 'center':
      style.background = `radial-gradient(circle, var(--end-color) 0%, var(--start-color) var(--size))`
      break
    case 'horizontal':
      style.background = `linear-gradient(to right, var(--start-color) 0%, var(--end-color) 50%, var(--start-color) 100%)`
      break
    case 'vertical':
      style.background = `linear-gradient(to bottom, var(--start-color) 0%, var(--end-color) 50%, var(--start-color) 100%)`
      break
    case 'radial':
      style.background = `radial-gradient(circle, var(--end-color) 0%, var(--start-color) var(--size))`
      break
  }

  if (props.animated) {
    style.animation = `fadeIn var(--duration) ease`
  }

  return style
})

// 内容位置样式
// const contentPositionStyle = computed(() => {
//   const position: Record<string, string> = {}

//   switch (props.contentPosition) {
//     case 'top':
//       position.top = '0'
//       position.left = '50%'
//       position.transform = 'translateX(-50%)'
//       break
//     case 'bottom':
//       position.bottom = '0'
//       position.left = '50%'
//       position.transform = 'translateX(-50%)'
//       break
//     case 'left':
//       position.left = '0'
//       position.top = '50%'
//       position.transform = 'translateY(-50%)'
//       break
//     case 'right':
//       position.right = '0'
//       position.top = '50%'
//       position.transform = 'translateY(-50%)'
//       break
//     case 'center':
//       position.top = '50%'
//       position.left = '50%'
//       position.transform = 'translate(-50%, -50%)'
//       break
//   }

//   return position
// })

// 处理点击事件
const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped>
.gradient-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: none;
}

.mask-content {
  position: absolute;
  background: transparent;
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mask-content {
    max-width: 90vw;
    max-height: 90vh;
    overflow: auto;
  }
}
</style>
