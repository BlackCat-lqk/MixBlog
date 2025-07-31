<template>
  <div class="novel-reader">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 错误提示 -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- 阅读器主体 -->
    <div v-if="!loading && !error && bookContent.length > 0" class="reader-container">
      <!-- 阅读进度 -->
      <div class="progress-info">
        阅读进度: {{ currentPage }}/{{ totalPages }} ({{ progressPercentage }}%)
      </div>

      <!-- 内容显示区域 -->
      <div class="content-area" ref="contentArea">
        <pre style="height: 100%">{{ currentPageContent }}</pre>
      </div>

      <!-- 翻页控制 -->
      <div class="page-controls">
        <button @click="prevPage" :disabled="currentPage <= 1" class="page-btn">上一页</button>
        <button @click="nextPage" :disabled="currentPage >= totalPages" class="page-btn">
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  txtUrl: string // TXT文件的URL链接
  bookId?: string // 书籍ID，用于区分不同书籍的阅读记录
}>()

// 状态管理
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const bookContent = ref<string[]>([])
const contentArea = ref<HTMLElement | null>(null)

// 动态计算每页行数
const calculateLinesPerPage = () => {
  if (!contentArea.value) return 30 // 默认值

  const lineHeight = 24 // 根据实际样式调整
  const containerHeight = contentArea.value.clientHeight
  return Math.floor(containerHeight / lineHeight)
}

// 从URL获取TXT内容
const fetchTextContent = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch(props.txtUrl)
    if (!response.ok) {
      throw new Error(`加载失败: ${response.status} ${response.statusText}`)
    }
    const text = await response.text()
    await nextTick() // 等待DOM更新
    splitContentIntoPages(text)
    restoreReadingProgress()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载小说内容失败'
    console.error('加载小说内容失败:', err)
  } finally {
    loading.value = false
  }
}

// 改进的分页逻辑
const splitContentIntoPages = (content: string) => {
  const lines = content.split('\n')
  const linesPerPage = calculateLinesPerPage()
  const pages = []

  let pageLines: string[] = []
  let currentLineCount = 0

  for (const line of lines) {
    // 估算此行会占用多少行（考虑自动换行）
    const lineLength = line.length
    const charsPerLine = 60 // 假设每行约60字符
    const lineWraps = Math.ceil(lineLength / charsPerLine) || 1

    if (currentLineCount + lineWraps > linesPerPage && pageLines.length > 0) {
      // 当前页已满，开始新的一页
      pages.push(pageLines.join('\n'))
      pageLines = []
      currentLineCount = 0
    }

    pageLines.push(line)
    currentLineCount += lineWraps
  }

  // 添加最后一页
  if (pageLines.length > 0) {
    pages.push(pageLines.join('\n'))
  }

  bookContent.value = pages
}

// 其他方法保持不变...
const restoreReadingProgress = () => {
  if (!props.bookId || bookContent.value.length === 0) return

  const savedProgress = localStorage.getItem(`novelProgress_${props.bookId}`)
  if (savedProgress) {
    const { page } = JSON.parse(savedProgress)
    currentPage.value = Math.min(page, totalPages.value || 1)
  }
}

const saveReadingProgress = () => {
  if (!props.bookId) return

  localStorage.setItem(
    `novelProgress_${props.bookId}`,
    JSON.stringify({
      page: currentPage.value,
      timestamp: Date.now(),
    }),
  )
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    saveReadingProgress()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    saveReadingProgress()
  }
}

// 计算属性
const totalPages = computed(() => bookContent.value.length)
const currentPageContent = computed(() => {
  return bookContent.value[currentPage.value - 1] || ''
})
const progressPercentage = computed(() => {
  return totalPages.value > 0 ? Math.round((currentPage.value / totalPages.value) * 100) : 0
})

// 监听URL变化
watch(
  () => props.txtUrl,
  (newUrl) => {
    if (newUrl) {
      fetchTextContent()
    }
  },
  { immediate: true },
)

// 窗口大小变化时重新分页
window.addEventListener('resize', () => {
  if (props.txtUrl && bookContent.value.length > 0) {
    const content = bookContent.value.join('\n')
    splitContentIntoPages(content)
  }
})
</script>

<style scoped>
.novel-reader {
  width: 66%;
  height: 96%;
  margin: 0 auto;
  padding: 20px;
  font-family: 'SimSun', serif;
  line-height: 1.6;
}

.loading,
.error {
  padding: 20px;
  text-align: center;
  color: var(--text-color);
}

.error {
  color: #d32f2f;
}

.reader-container {
  display: flex;
  flex-direction: column;
  height: 90%;
}

.progress-info {
  margin-bottom: 15px;
  font-size: 0.9em;
  color: var(--text-color);
  text-align: center;
}

.content-area {
  flex: 1;
  /* min-height: 500px;
  max-height: 70vh; */

  overflow-y: auto;
  padding: 20px;
  background-color: var(--box-bg-color4);
  border-radius: 5px;
  margin-bottom: 15px;
}

.content-area pre {
  white-space: pre-wrap; /* 保留换行但允许自动换行 */
  word-wrap: break-word;
  margin: 0;
  font-family: inherit;
}

.page-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.page-btn {
  padding: 8px 20px;
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.page-btn:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
}
</style>
