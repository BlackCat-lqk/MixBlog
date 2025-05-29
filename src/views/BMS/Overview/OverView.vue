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
                  <n-button strong secondary @click="handleJump(item)">
                    <img src="@/assets/images/Add.svg" />
                  </n-button>
                </div>
              </div>
            </n-card>
          </div>
        </div>
        <div class="view-statistics">
          <div class="echarts-view">
            <div>
              <echarts-init :options="lineOptions" :dark="isDarkMode" :loading="loading" :isEmpty="isEmptyData">
              </echarts-init>
            </div>

            <div>
              <echarts-init :options="pieOptions" :dark="isDarkMode" :loading="loading" :isEmpty="isEmptyData">
              </echarts-init>
            </div>

          </div>
          <div class="comment-info">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import EchartsInit from '@/echarts/EchartsInit.vue'
import { lineOptions, pieOptions } from '@/echarts/echartsConfig.ts'
import { useRouter } from 'vue-router'

// 加载状态
const loading = ref(true)
const isEmptyData = ref(false)
// 主题控制
const isDarkMode = ref(false)
const router = useRouter()

// 模拟异步加载数据
setTimeout(() => {
  loading.value = false
}, 1000)

const handleJump = (item: number) => {
  if(item === 1){
    router.push('/bms/editarticle')
  }
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

  .view-statistics {
    display: flex;
    gap: 12px;
    margin-top: 20px;
    .echarts-view {
      flex: 0.6;
      gap: 12px;
      max-width: 60%;
      div {
        margin-bottom: 12px;
        border: 1px solid #424242;
        height: 400px;
        border-radius: 8px;
      }
      div:last-child{
        margin-bottom: 0;
      }
    }
    .comment-info {
      flex: 0.4;
      border: 1px solid #424242;
      border-radius: 8px;
    }
  }
}
</style>
