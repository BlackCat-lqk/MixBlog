<template>
  <div class="bms-main-box">
    <div class="header-box">
      <header-view></header-view>
    </div>
    <div class="content-box">
      <div class="sidebar-box">
        <naviga-menu></naviga-menu>
      </div>
      <div class="main-router-box">
        <visit-line
          :options="lineOptions"
          :dark="isDarkMode"
          :loading="loading"
          :isEmpty="isEmptyData"
          >
        </visit-line>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { EChartsOption } from 'echarts'
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import VisitLine from '@/echarts/VisitLine.vue'

// 加载状态
const loading = ref(true)
const isEmptyData = ref(false)
// 主题控制
const isDarkMode = ref(false)

// 模拟异步加载数据
setTimeout(() => {
  loading.value = false
}, 1000)

const lineOptions: EChartsOption = {
  tooltip: {},
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {},
  series: [
    {
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210]
    }
  ]
}
</script>

<style lang="scss" scoped>
@include g.bms;
</style>
