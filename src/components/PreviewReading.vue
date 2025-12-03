<template>
  <div class="pdf-viewer-container">
    <div class="controls">
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage <= 1 || loading" class="nav-button">
          上一页
        </button>

        <span class="page-info">
          <input
            type="number"
            v-model.number="inputPage"
            @keyup.enter="goToPage(inputPage)"
            min="1"
            :max="totalPages"
            class="page-input"
            :disabled="loading"
          />
          / {{ totalPages || '--' }}
        </span>

        <button
          @click="nextPage"
          :disabled="currentPage >= totalPages || loading"
          class="nav-button"
        >
          下一页
        </button>
      </div>

      <div class="zoom-controls">
        <button @click="zoomOut" class="zoom-button" :disabled="loading">-</button>
        <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
        <button @click="zoomIn" class="zoom-button" :disabled="loading">+</button>
      </div>
    </div>

    <div class="pdf-container" ref="pdfContainer">
      <div v-if="loading" class="loading-placeholder">
        <div class="loading-spinner"></div>
        <p>正在加载 PDF 文件...</p>
        <p class="debug-info">文件路径: {{ props.src }}</p>
      </div>
      <div v-else-if="loadError" class="error-placeholder">
        <p>PDF 加载失败: {{ loadError }}</p>
        <p class="debug-info">文件路径: {{ props.src }}</p>
        <button @click="retryLoad" class="retry-button">重试</button>
      </div>
      <!-- 始终渲染PDF组件，通过样式控制显示 -->
      <vue-office-pdf
        :src="props.src"
        :options="pdfOptions"
        style="height: 100% !important"
        :style="[
          { transform: `scale(${scale})`, transformOrigin: 'top center' },
          loading || loadError ? 'display: none;' : '',
        ]"
        @rendered="onPdfRendered"
        @loaded="onPdfLoaded"
        @page-change="onPageChange"
        @error="onError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
const VueOfficePdf = defineAsyncComponent(() => import('@vue-office/pdf'))

const props = defineProps<{
  src: string
}>()

// PDF选项配置，解决字体和渲染问题
const pdfOptions = {
  maxPagesToRender: null,
  disableAutoFetch: false,
  disableStream: false,
  cMapUrl: 'https://unpkg.com/pdfjs-dist@2.10.377/cmaps/',
  cMapPacked: true,
}

// 状态管理
const loading = ref(true)
const loadError = ref<string | null>(null)

// 分页相关状态
const currentPage = ref(1)
const totalPages = ref(0)
const inputPage = ref(1)

// 缩放相关状态
const scale = ref(1)
const pdfContainer = ref<HTMLElement | null>(null)

// 重置状态
const resetState = () => {
  loading.value = true
  loadError.value = null
  currentPage.value = 1
  totalPages.value = 0
  inputPage.value = 1
}

// 重试加载
const retryLoad = () => {
  resetState()
}

// 监听当前页码变化
watch(
  () => props.src,
  (newSrc) => {
    if (newSrc) {
      resetState()
    }
  },
  { immediate: true },
)

// PDF加载完成回调
const onPdfLoaded = () => {
  loading.value = false
}

// PDF渲染完成回调
const onPdfRendered = (pdfDocument: unknown) => {
  loading.value = false

  if (!pdfDocument) {
    console.error('PDF文档加载失败，pdfDocument 为 undefined')
    loadError.value = 'PDF文档加载失败'
    return
  }

  if (typeof pdfDocument === 'object' && pdfDocument && 'numPages' in pdfDocument) {
    totalPages.value = (pdfDocument as { numPages: number }).numPages
  } else {
    console.error('无法获取PDF总页数，pdfDocument结构不符合预期:', pdfDocument)
    loadError.value = 'PDF文档格式错误'
  }
}

// 页面变化回调
const onPageChange = (page: number) => {
  currentPage.value = page
  inputPage.value = page
}

// 错误处理
const onError = (error: unknown) => {
  console.error('PDF渲染错误:', error)
  loading.value = false
  loadError.value = error instanceof Error ? error.message : String(error)
}

// 导航到上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    inputPage.value = currentPage.value
  }
}

// 导航到下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    inputPage.value = currentPage.value
  }
}

// 跳转到指定页面
const goToPage = (page: number) => {
  const pageNum = Math.max(1, Math.min(totalPages.value, page))
  currentPage.value = pageNum
  inputPage.value = pageNum
}

// 放大
const zoomIn = () => {
  scale.value = Math.min(scale.value + 0.1, 3)
}

// 缩小
const zoomOut = () => {
  scale.value = Math.max(scale.value - 0.1, 0.5)
}

// 初始化
onMounted(() => {
  // 可以在这里添加初始化逻辑
})
</script>

<style scoped>
.pdf-viewer-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 8px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-button {
  padding: 8px 16px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.nav-button:hover:not(:disabled) {
  background: #4338ca;
}

.nav-button:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  opacity: 0.6;
}

.page-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.page-input {
  width: 60px;
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
}

.page-input:disabled {
  background-color: #f1f5f9;
  cursor: not-allowed;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.zoom-button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e2e8f0;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.zoom-button:hover:not(:disabled) {
  background: #cbd5e1;
}

.zoom-button:disabled {
  background: #e2e8f0;
  cursor: not-allowed;
  opacity: 0.6;
}

.zoom-level {
  min-width: 60px;
  text-align: center;
  font-weight: 500;
}

.pdf-container {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: auto;
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #f8fafc;
  min-height: 500px;
  position: relative;
}

.loading-placeholder,
.error-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 300px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  background: #f8fafc;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.retry-button {
  padding: 8px 16px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.debug-info {
  font-size: 12px;
  color: #64748b;
  margin-top: 8px;
}

.retry-button:hover {
  background: #4338ca;
}
</style>
