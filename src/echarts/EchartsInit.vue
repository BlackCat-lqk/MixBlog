<template>
  <div class="chart-wrapper" :class="{ 'dark-mode': isDark }">
    <div ref="visitLine" class="chart-container"></div>
    <div v-if="isEmpty" class="chart-empty">暂无数据</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption, ECharts } from 'echarts'

// 定义 props 类型
interface ChartProps {
  options: EChartsOption
  isDark?: boolean
  loading?: boolean
  isEmpty?: boolean
}

// 接收 props
const props = withDefaults(defineProps<ChartProps>(), {
  isDark: false,
  loading: false,
  isEmpty: false,
})

const emit = defineEmits<{
  (e: 'update', chart: ECharts): void
}>()

// 图表 DOM 引用
const visitLine = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 初始化图表
const initChart = () => {
  if (!visitLine.value) return

  // 销毁旧实例（如果存在）
  if (chartInstance) {
    chartInstance.dispose()
  }
  chartInstance = echarts.init(visitLine.value, props.isDark ? 'dark' : undefined)
  chartInstance.setOption(props.options)
  emit('update', chartInstance)
}

// 窗口变化时调整图表尺寸
const resizeHandler = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 监听 options 变化，重新渲染
watch(() => props.options, initChart, { deep: true })

// 生命周期：挂载后初始化图表
onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeHandler)
})

// 生命周期：卸载前释放资源
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style lang="scss" scoped>
.chart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  .chart-container {
    width: 100%;
    height: 100%;
  }

  .chart-loading,
  .chart-empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    color: #999;
  }

  .dark-mode .chart-loading,
  .dark-mode .chart-empty {
    color: #ccc;
  }
}
</style>
