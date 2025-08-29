<template>
  <div :class="['fireworks-container', className]" ref="containerRef">
    <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight"></canvas>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

// 类型定义
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
  decay: number
}

interface FireworksOptions {
  particleCount?: number
  particleSize?: number
  explosionSize?: number
  colors?: string[]
  duration?: number
  gravity?: number
  className?: string
}

// 组件属性
const props = withDefaults(defineProps<FireworksOptions>(), {
  particleCount: 80,
  particleSize: 3,
  explosionSize: 8,
  colors: () => ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#ff6b81', '#a55eea', '#fffa65'],
  duration: 2000,
  gravity: 0.1,
  className: ''
})

// 响应式变量
const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasWidth = ref(window.innerWidth)
const canvasHeight = ref(window.innerHeight)
const particles = ref<Particle[]>([])
const animationId = ref<number | null>(null)

// 初始化画布
const initCanvas = () => {
  if (!containerRef.value || !canvasRef.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 设置画布尺寸为容器尺寸
  canvasWidth.value = containerRef.value.clientWidth
  canvasHeight.value = containerRef.value.clientHeight
}

// 创建烟花粒子
const createParticles = (x: number, y: number) => {
  const newParticles: Particle[] = []

  for (let i = 0; i < props.particleCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * props.explosionSize + 1

    newParticles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: Math.random() * props.particleSize + 1,
      color: props.colors[Math.floor(Math.random() * props.colors.length)],
      alpha: 1,
      decay: Math.random() * 0.02 + 0.005
    })
  }

  particles.value = [...particles.value, ...newParticles]
}

// 绘制粒子
const drawParticles = () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 绘制所有粒子
  particles.value.forEach(particle => {
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
    ctx.fillStyle = particle.color
    ctx.globalAlpha = particle.alpha
    ctx.fill()
    ctx.closePath()
  })

  ctx.globalAlpha = 1
}

// 更新粒子状态
const updateParticles = () => {
  particles.value = particles.value.filter(particle => {
    // 更新位置
    particle.x += particle.vx
    particle.y += particle.vy
    particle.vy += props.gravity

    // 更新透明度
    particle.alpha -= particle.decay

    // 如果粒子还可见，保留它
    return particle.alpha > 0
  })
}

// 动画循环
const animate = () => {
  updateParticles()
  drawParticles()

  if (particles.value.length > 0) {
    animationId.value = requestAnimationFrame(animate)
  } else {
    animationId.value = null
  }
}

// 处理点击事件
const handleClick = (event: MouseEvent) => {
  if (!containerRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  createParticles(x, y)

  // 如果没有动画在运行，启动动画
  if (!animationId.value) {
    animationId.value = requestAnimationFrame(animate)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  initCanvas()
}

// 生命周期
onMounted(() => {
  nextTick(() => {
    initCanvas()

    if (containerRef.value) {
      containerRef.value.addEventListener('click', handleClick)
    }

    window.addEventListener('resize', handleResize)
  })
})

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('click', handleClick)
  }

  window.removeEventListener('resize', handleResize)

  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
})

// 监听属性变化
watch(() => props.colors, () => {
  // 颜色变化时重新初始化
  if (particles.value.length === 0) {
    initCanvas()
  }
})
</script>

<style scoped>
.fireworks-container {
  width: 100%;
  height: 100%;
}

canvas {
  display: block;
  background: transparent;
}
</style>
