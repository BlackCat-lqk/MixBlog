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
        <div class="top-title">
          <h3>汇总</h3>
        </div>
        <div class="gather">
          <div class="gather-cards" v-for="(item, idx) in 6" :key="idx">
            <n-card title="本地文件" hoverable>
              <div class="gather-cards-content">
                <h2>99</h2>
                <div class="gather-cards-content-icon">
                  <n-button strong secondary>
                    <img src="@/assets/images/Add.svg" />
                  </n-button>
                </div>
              </div>
            </n-card>
          </div>
        </div>
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
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: {},
  series: [
    {
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210],
    },
  ],
}
</script>

<style lang="scss" scoped>
@include g.bms;
.main-router-box {
  margin-left: 208px;
  padding: 32px;
  .top-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h3 {
      font-size: 24px;
      line-height: 1.34;
      font-weight: 600;
    }
  }
  .gather {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 24px;
    .gather-cards {
      width: calc((100% - 32px) / 3);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .n-card {
        background: linear-gradient(rgba(43, 90, 237, 0.8) 0%, rgb(43, 90, 237) 100%);
        border-radius: 10px;
      }
      .gather-cards-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        h2 {
          font-size: 32px;
          line-height: 1.28;
          font-weight: 600;
          color: #fff;
        }
        .gather-cards-content-icon {
          background-color: #41444f14;
          border-radius: 10px;
          img {
            width: 16px;
            height: 16px;
          }
        }
      }
    }
  }
}
</style>
