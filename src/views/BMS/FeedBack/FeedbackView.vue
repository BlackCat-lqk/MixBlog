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
        <n-data-table :columns="columns" :data="feedbackData" :pagination="pagination" :bordered="false" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import type { DataTableColumns } from 'naive-ui'
import { NButton, useMessage } from 'naive-ui'
import { feedbackStatusApi, getFeedbackApi } from '@/http/feedback'
import { h } from 'vue'

const pagination = false as const
const feedbackData = ref([] as FeedBack[])

interface FeedBack {
  _id: string
  feedbackType: string
  subject: string
  description: string
  screenshots: string[]
  contact: string
  isResolved: boolean
  createdAt: string
  environment: {
    url: string
    userAgent: string
    viewport: string
    timestamp: string
  }
}

function createColumns({
  isResolved,
}: {
  isResolved: (row: FeedBack) => void
}): DataTableColumns<FeedBack> {
  return [
    {
      title: 'ID',
      key: '_id',
    },
    {
      title: '反馈类型',
      key: 'feedbackType',
    },
    {
      title: '主题',
      key: 'subject',
    },
    {
      title: '描述',
      key: 'description',
    },
    {
      title: '截图',
      key: 'screenshots',
    },
    {
      title: '联系方式',
      key: 'contact',
    },
    {
      title: '是否解决',
      key: 'isResolved',
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            style: {
              backgroundColor: row.isResolved ? '#6af0b0' : '#e0b2c2',
            },
            onClick: () => isResolved(row),
          },
          {
            default: () => {
              return row.isResolved ? '已解决' : '未解决'
            },
          },
        )
      },
    },
    {
      title: '创建时间',
      key: 'createdAt',
    },
    {
      title: '设备详情',
      key: 'environment',
      render(row) {
        return h(
          'div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              maxWidth: '400px'
            },
          },
          [
            h('div', { style: { fontWeight: 'bold' } }, 'URL: ' + row.environment.url),
            h('div', { style: { fontWeight: 'bold' } }, 'User Agent: ' + row.environment.userAgent),
            h('div', { style: { fontWeight: 'bold' } }, 'User Agent: ' + row.environment.viewport),
            h('div', { style: { fontWeight: 'bold' } }, 'User Agent: ' + row.environment.timestamp)
          ]
        )
      },
    },
  ]
}

const message = useMessage()
const columns = createColumns({
  isResolved(row: FeedBack) {
      // 更新状态
      const feedback = (async () => {
        const dataStatus = {isResolved: !row.isResolved}
        const response = await feedbackStatusApi(row._id, dataStatus)
        const res = response.data
        if (res.code == 200) {
          row.isResolved = !row.isResolved
          message.info('更新成功')
        } else {
          message.error('更新失败')
        }
      })
      feedback()
  },
})

// 获取反馈列表
const getFeedbackList = async () => {
  const response = await getFeedbackApi()
  const res = response.data
  if (res.code == 200) {
    feedbackData.value = res.data
  } else {
    message.error('获取反馈列表失败')
  }
}

onMounted(() => {
  getFeedbackList()
})

</script>

<style scoped lang="scss">
@include g.bms;
</style>
