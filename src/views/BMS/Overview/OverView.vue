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
          <div class="gather-cards" v-for="(item, idx) in optionCards" :key="idx">
            <n-card :title="item.title" hoverable :style="`background:${item.bgColor}`">
              <div class="gather-cards-content">
                <h2>{{ item.content }}</h2>
                <div v-show="idx != 0 && idx != 4" class="gather-cards-content-icon">
                  <n-button strong secondary @click="handleJump(idx)">
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
              <echarts-init
                :options="lineOptionsData"
                :dark="isDarkMode"
                :loading="loading"
                :isEmpty="isEmptyData"
              >
              </echarts-init>
              <div class="echarts-btns">
                <n-button
                  :color="state.lineBtn == 'Week' ? '#2b5aed' : ''"
                  @click="handleLineDate('Week')"
                >
                  近一周
                </n-button>
                <n-button
                  :color="state.lineBtn == 'Month' ? '#2b5aed' : ''"
                  @click="handleLineDate('Month')"
                >
                  近一月
                </n-button>
              </div>
            </div>

            <div>
              <echarts-init
                :options="pieOptionsData"
                :dark="isDarkMode"
                :loading="loading"
                :isEmpty="isEmptyData"
              >
              </echarts-init>
              <div v-show="false" class="echarts-btns">
                <n-button
                  :color="state.pieBtn == 'Week' ? '#8a2be2' : ''"
                  @click="handlePieDate('Week')"
                >
                  近一周
                </n-button>
                <n-button
                  :color="state.pieBtn == 'Month' ? '#8a2be2' : ''"
                  @click="handlePieDate('Month')"
                >
                  近一月
                </n-button>
              </div>
            </div>
          </div>
          <div class="comment-info">
            <h3>评论0</h3>
            <div class="comment-table">
              <n-config-provider>
                <n-data-table
                  :columns="createColumns"
                  :data="data"
                  :pagination="state.pagination"
                  :bordered="false"
                />
              </n-config-provider>
            </div>
            <div class="pagination-box">
              <n-pagination
                :display-order="['quick-jumper', 'pages', 'size-picker']"
                :page-count="100"
                show-quick-jumper
                show-size-picker
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NConfigProvider, useMessage } from 'naive-ui'
import { ref, reactive, onMounted } from 'vue'
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import EchartsInit from '@/echarts/EchartsInit.vue'
import { lineOptions, pieOptions } from '@/echarts/echartsConfig.ts'
import { useRouter } from 'vue-router'
import type { DataTableColumns } from 'naive-ui'
import { getStatisticsApi } from '@/http/statistics'

const message = useMessage()
const lineOptionsData = ref({})
const pieOptionsData = ref({})
interface Comment {
  no: number
  user: string
  content: string
  type: string
  date: string
}
const createColumns: DataTableColumns<Comment> = [
  {
    title: '序号',
    key: 'no',
  },
  {
    title: '用户',
    key: 'user',
  },
  {
    title: '内容',
    key: 'content',
  },
  {
    title: '类型',
    key: 'type',
  },
  {
    title: '日期',
    key: 'date',
  },
]
const data: Comment[] = []
// 加载状态
const loading = ref(true)
const isEmptyData = ref(false)
// 主题控制
const isDarkMode = ref(false)
const router = useRouter()

interface StatisticsData {
  visitCount: {
    weekChartData: {
      dates: string[]
      counts: number[]
    }
    monthChartData: {
      dates: string[]
      counts: number[]
    }
  }
}

const state = reactive({
  lineBtn: 'Week',
  pieBtn: 'Week',
  pagination: false as const,
  statisticsData: [] as unknown as StatisticsData,
})

const optionCards = ref([
  {
    title: '本地文件',
    content: 0,
    bgColor: 'linear-gradient(to bottom, #8360c3, #2ebf91)',
  },
  {
    title: '博客文章',
    content: 0,
    bgColor: 'linear-gradient(to bottom, #948e99, #2e1437);',
  },
  {
    title: '摄影图库',
    content: 0,
    bgColor: 'linear-gradient(to bottom, #00b4db, #0083b0);',
  },
  {
    title: '随笔随记',
    content: 0,
    bgColor: 'linear-gradient(to bottom, #e1eec3, #f05053);',
  },
  {
    title: '其它',
    content: '敬请期待...',
    bgColor: 'linear-gradient(to bottom, #2b5876, #4e4376);',
  },
])

// 点击折线图时间统计
const handleLineDate = (value: string) => {
  state.lineBtn = value
  // 配置echarts数据
  let xAxisData: string[] = []
  let seriesData: number[] = []
  if (value === 'Week') {
    xAxisData = state.statisticsData.visitCount.weekChartData.dates
    seriesData = state.statisticsData.visitCount.weekChartData.counts
  } else {
    xAxisData = state.statisticsData.visitCount.monthChartData.dates
    seriesData = state.statisticsData.visitCount.monthChartData.counts
  }
  lineOptionsData.value = {
    ...lineOptions,
    xAxis: {
      type: 'category',
      data: xAxisData,
    },
    series: [
      {
        type: 'line',
        data: seriesData,
      },
    ],
  }
}
// 点击饼状图时间统计
const handlePieDate = (value: string) => {
  state.pieBtn = value
}
const handleJump = (item: number) => {
  if (item === 1) {
    router.push('/bms/editarticle')
  } else if (item === 2) {
    router.push('/bms/editPhoto')
  } else if (item === 3) {
    router.push('/bms/notes')
  }
}

// 获取统计数据
const getStatisticsData = async () => {
  const response = await getStatisticsApi()
  const res = response.data
  if (res.code == 200) {
    // 获取数据成功
    const data = res.data
    state.statisticsData = data
    optionCards.value[0].content = '数量:' + data.totalFiles + ' / Size:' + data.totalSize.formatted
    optionCards.value[1].content = data.blogArticleCount
    optionCards.value[2].content = data.photoLibraryCount
    optionCards.value[3].content = data.noteCount
    // 配置echarts数据
    lineOptionsData.value = {
      ...lineOptions,
      xAxis: {
        type: 'category',
        data: data.visitCount.weekChartData.dates,
      },
      series: [
        {
          type: 'line',
          data: data.visitCount.weekChartData.counts,
        },
      ],
    }

    pieOptionsData.value = {
      ...pieOptions,
      series: [
        {
          name: '使用设备',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '60%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 24,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: data.userAgentStats,
        },
      ],
    }
  } else {
    // 获取数据失败
    message.error('获取数据失败')
  }
}

onMounted(() => {
  // 订阅
  // const channel = new BroadcastChannel('dingyue')
  // // 接收消息
  // channel.onmessage = function (event) {
  //   message.success('订阅成功', event.data)
  // }
  getStatisticsData()
})
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
        box-shadow: 0 0 10px 1px #e4e4e4;
        height: 400px;
        border-radius: 8px;
        position: relative;
        .echarts-btns {
          position: absolute;
          right: 2%;
          top: 2%;
          width: auto;
          height: auto;
          border-radius: 8px;
          padding: 5px;
          .n-button:first-child {
            margin-right: 5px;
          }
          .n-button:not(.n-button--disabled):focus {
            color: #fff;
          }
        }
      }
      div:last-child {
        margin-bottom: 0;
      }
    }
    .comment-info {
      flex: 0.4;
      box-shadow: 0 0 10px 1px #e4e4e4;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      padding: 10px;
      h3 {
        font-size: 18px;
        font-weight: 600;
        line-height: 1.32;
        padding-bottom: 15px;
      }
      .comment-table {
        flex: 1;
      }
      .pagination-box {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
