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
        <h3>日志中心</h3>

        <!-- 日志类型选择 -->
        <div class="log-type-filter">
          <label for="logType">日志类型:</label>
          <select id="logType" v-model="selectedLogType">
            <option value="all">全部</option>
            <option value="access">访问日志</option>
            <option value="error">错误日志</option>
            <option value="debug">调试日志</option>
            <option value="security">安全日志</option>
            <option value="performance">性能日志</option>
          </select>
        </div>

        <!-- 日志表格 -->
        <table class="log-table">
          <thead>
            <tr>
              <th>时间戳</th>
              <th>用户标识</th>
              <th>操作类型</th>
              <th>访问路径</th>
              <th>描述</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(log, index) in filteredLogs" :key="index">
              <td>{{ log.timestamp }}</td>
              <td>{{ log.user }}</td>
              <td>{{ log.type }}</td>
              <td>{{ log.path }}</td>
              <td>{{ log.description }}</td>
            </tr>
          </tbody>
        </table>

        <!-- 分页 -->
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
          <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'

// 日志数据（示例）
const logs = ref([
  {
    timestamp: '2025-04-05 10:00:00',
    user: 'user123',
    type: 'access',
    path: '/home',
    description: '用户访问首页'
  },
  {
    timestamp: '2025-04-05 10:05:00',
    user: 'user456',
    type: 'error',
    path: '/api/data',
    description: '接口调用失败'
  }
])

// 当前选中的日志类型
const selectedLogType = ref('all')

// 分页相关
const currentPage = ref(1)
const itemsPerPage = 10

// 过滤日志
const filteredLogs = computed(() => {
  let result = logs.value
  if (selectedLogType.value !== 'all') {
    result = result.filter(log => log.type === selectedLogType.value)
  }

  // 分页计算
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return result.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredLogs.value.length / itemsPerPage)
})

// 上一页
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// 下一页
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
</script>

<style scoped lang="scss">
@include g.bms;
.main-router-box {
  padding: 10px;
  gap: 12px;

  h3 {
    font-size: 18px;
    line-height: 1.34;
    font-weight: 600;
    color: #1e2025;
    padding-bottom: 10px;
  }

  .log-type-filter {
    margin-bottom: 10px;

    label {
      margin-right: 10px;
    }

    select {
      padding: 5px;
    }
  }

  .log-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;

    thead {
      background-color: #f5f7fa;
    }

    th,
    td {
      border: 1px solid #ebeef5;
      padding: 8px;
      text-align: left;
    }

    tr:hover {
      background-color: #f9fafb;
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

    button {
      padding: 5px 10px;
      cursor: pointer;
    }
  }
}
</style>
