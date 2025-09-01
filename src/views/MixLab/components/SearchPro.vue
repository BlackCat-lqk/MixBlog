<template>
  <div class="search-container">
    <div class="search-form">
      <!-- 文本搜索 -->
      <div class="form-group">
        <input
          v-model="searchParams.keyword"
          type="text"
          class="search-input"
          placeholder="输入关键词..."
          @keyup.enter="handleSearch"
        >
      </div>

      <!-- 日期时间范围选择 -->
      <div class="form-group date-range-group">
        <input
          v-model="dateRange.start"
          type="date"
          class="date-input"
          placeholder="开始日期"
        >
        <span class="date-separator">—</span>
        <input
          v-model="dateRange.end"
          type="date"
          class="date-input"
          placeholder="结束日期"
        >
      </div>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <button class="search-btn" @click="handleSearch">搜索</button>
        <button class="reset-btn" @click="handleReset">清除</button>
      </div>
    </div>

    <!-- 搜索结果展示 -->
    <div v-if="searchResults.length > 0" class="search-results">
      <h3 class="results-title">找到 {{ searchResults.length }} 条结果</h3>
      <div class="result-list">
        <div v-for="item in searchResults" :key="item.id" class="result-item">
          <div class="result-title">{{ item.title }}</div>
          <div class="result-content">{{ item.content }}</div>
          <div class="result-meta">
            <span class="result-time">{{ formatDate(item.time) }}</span>
            <span class="result-type">{{ item.type }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 无结果提示 -->
    <div v-else-if="hasSearched" class="no-results">
      <p>没有找到相关结果</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

// 搜索参数接口
interface SearchParams {
  keyword: string;
  startTime: string | null;
  endTime: string | null;
}

// 搜索结果接口
interface SearchResult {
  id: number;
  title: string;
  content: string;
  time: string;
  type: string;
}

// 搜索参数
const searchParams = reactive<SearchParams>({
  keyword: '',
  startTime: null,
  endTime: null
});

// 日期时间范围（用于UI绑定）
const dateRange = reactive({
  start: '',
  end: ''
});

// 搜索结果
const searchResults = ref<SearchResult[]>([]);

// 是否已执行过搜索
const hasSearched = ref(false);

// 模拟数据
const mockData: SearchResult[] = [
  {
    id: 1,
    title: 'Vue 3 新特性介绍',
    content: '本文详细介绍了Vue 3的新特性，包括Composition API、性能改进等。',
    time: '2023-10-15',
    type: '技术文章'
  },
  {
    id: 2,
    title: 'TypeScript 最佳实践',
    content: '分享TypeScript在大型项目中的最佳实践和技巧。',
    time: '2023-10-18',
    type: '技术文章'
  },
  {
    id: 3,
    title: '前端开发趋势',
    content: '探讨2023年前端开发的最新趋势和技术方向。',
    time: '2023-10-20',
    type: '行业分析'
  },
  {
    id: 4,
    title: '响应式设计原理',
    content: '深入讲解响应式设计的原理和实现方法。',
    time: '2023-10-10',
    type: '技术文章'
  },
  {
    id: 5,
    title: 'JavaScript性能优化',
    content: '分享JavaScript性能优化的实用技巧和工具。',
    time: '2023-10-22',
    type: '技术文章'
  }
];

// 处理搜索
const handleSearch = () => {
  // 更新搜索参数中的日期时间
  searchParams.startTime = dateRange.start || null;
  searchParams.endTime = dateRange.end || null;

  // 验证日期范围
  if (searchParams.startTime && searchParams.endTime &&
      new Date(searchParams.startTime) > new Date(searchParams.endTime)) {
    alert('开始时间不能晚于结束时间');
    return;
  }

  // 模拟搜索过程
  let results = [...mockData];

  // 关键词筛选
  if (searchParams.keyword) {
    const keyword = searchParams.keyword.toLowerCase();
    results = results.filter(item =>
      item.title.toLowerCase().includes(keyword) ||
      item.content.toLowerCase().includes(keyword)
    );
  }

  // 时间范围筛选
  if (searchParams.startTime) {
    results = results.filter(item => item.time >= searchParams.startTime!);
  }

  if (searchParams.endTime) {
    results = results.filter(item => item.time <= searchParams.endTime!);
  }

  searchResults.value = results;
  hasSearched.value = true;
};

// 处理重置
const handleReset = () => {
  searchParams.keyword = '';
  dateRange.start = '';
  dateRange.end = '';
  searchParams.startTime = null;
  searchParams.endTime = null;
  searchResults.value = [];
  hasSearched.value = false;
};

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

// 初始化
onMounted(() => {
  // 可以在这里添加初始化逻辑
});
</script>

<style scoped>
.search-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}
.search-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.search-input {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #0066cc;
}

.date-range-group {
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.date-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.date-separator {
  color: #888;
  font-weight: 500;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.search-btn, .reset-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-btn {
  background-color: #0066cc;
  color: white;
}

.search-btn:hover {
  background-color: #0052a3;
}

.reset-btn {
  background-color: #f5f5f5;
  color: #666;
}

.reset-btn:hover {
  background-color: #e8e8e8;
}

.search-results {
  margin-top: 32px;
}

.results-title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 20px;
  color: #333;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-item {
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  border-left: 3px solid #0066cc;
}

.result-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.result-content {
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
}

.result-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #888;
}

.no-results {
  text-align: center;
  padding: 40px 0;
  color: #888;
}

@media (max-width: 600px) {
  .search-container {
    padding: 16px;
  }

  .date-range-group {
    flex-direction: column;
    align-items: stretch;
  }

  .date-separator {
    text-align: center;
  }
}
</style>
