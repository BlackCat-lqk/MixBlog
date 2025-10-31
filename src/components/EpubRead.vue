<template>
  <div class="epub-reader">
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>正在加载EPUB文件...</p>
      <p v-if="loadingProgress">加载进度: {{ loadingProgress }}%</p>
    </div>

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="retryLoad" class="retry-button">重试</button>
    </div>

    <div v-else class="reader-container">
      <div class="toolbar">
        <button @click="prev" :disabled="!canGoPrev" class="nav-button">上一页</button>
        <span class="page-info">{{ currentPage }} / {{ totalPage }}</span>
        <button @click="next" :disabled="!canGoNext" class="nav-button">下一页</button>
      </div>
      <div ref="viewerRef" class="epub-container" :key="containerKey"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

// 定义组件属性
const props = defineProps<{
  url: string
}>()

// 响应式数据
const loading = ref(true)
const error = ref('')
const viewerRef = ref<HTMLElement | null>(null)
const containerKey = ref(0) // 用于强制重新渲染容器

const loadingProgress = ref(0)
const currentPage = ref(0)
const totalPage = ref(0)
const canGoPrev = ref(false)
const canGoNext = ref(false)

let epub: any = null
let book: any = null
let rendition: any = null
let displayed: any = null

// 动态加载EPUB.js库
const loadEpubJS = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 检查是否已经加载
    // @ts-ignore
    if (window.ePub) {
      // @ts-ignore
      epub = window.ePub
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/epubjs@0.3.93/dist/epub.min.js'
    script.async = true

    script.onload = () => {
      setTimeout(() => {
        // @ts-ignore
        if (window.ePub) {
          // @ts-ignore
          epub = window.ePub
          resolve()
        } else {
          reject(new Error('EPUB.js加载完成但未找到ePub对象'))
        }
      }, 100)
    }

    script.onerror = () => {
      reject(new Error('EPUB.js库加载失败'))
    }

    document.head.appendChild(script)
  })
}

// 等待容器元素准备好
const waitForContainer = async (): Promise<HTMLElement> => {
  let attempts = 0
  const maxAttempts = 50 // 最多尝试50次

  while (attempts < maxAttempts) {
    if (viewerRef.value) {
      // 检查元素是否已挂载到DOM中
      if (document.contains(viewerRef.value)) {
        // 检查元素是否有尺寸
        const rect = viewerRef.value.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          return viewerRef.value
        }
      }
    }

    attempts++
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  throw new Error(`容器元素未准备好 (尝试次数: ${attempts})`)
}

// 初始化阅读器
const initializeReader = async () => {
  try {
    console.log('开始初始化EPUB阅读器')
    loading.value = true
    error.value = ''

    // 确保DOM已经更新
    await nextTick()

    // 等待容器元素准备好
    console.log('等待容器元素准备好...')
    const container = await waitForContainer()
    console.log('容器元素已准备好:', container)

    // 清理之前的实例
    if (rendition) {
      rendition.destroy()
      rendition = null
    }

    if (book) {
      book.destroy()
      book = null
    }

    // 加载EPUB.js库
    console.log('加载EPUB.js库...')
    await loadEpubJS()
    console.log('EPUB.js库加载完成')

    // 加载EPUB图书
    console.log('加载EPUB图书...')
    book = epub(props.url)

    // 监听加载事件
    book.on('book:loading', () => {
      console.log('书籍加载开始')
      loadingProgress.value = 0
    })

    book.on('book:loaded', () => {
      console.log('书籍加载完成')
      loadingProgress.value = 50
    })

    // 等待书籍准备就绪
    console.log('等待书籍准备就绪...')
    await book.ready
    console.log('书籍已准备就绪')

    // 创建渲染器
    console.log('创建渲染器...')
    rendition = book.renderTo(container, {
      width: '100%',
      height: 'calc(100% - 50px)',
      spread: 'none',
    })

    // 监听渲染事件
    rendition.on('rendered', () => {
      console.log('渲染完成')
      loadingProgress.value = 100
    })

    // 显示第一页
    console.log('显示第一页...')
    displayed = await rendition.display()
    console.log('第一页显示完成')

    // 更新导航状态
    updateNavigation()

    // 监听位置变化
    rendition.on('relocated', (location: any) => {
      console.log('位置变化:', location)
      updateNavigation()
    })

    loading.value = false
    console.log('EPUB阅读器初始化完成')
  } catch (err) {
    console.error('EPUB加载错误:', err)
    error.value = err instanceof Error ? err.message : '加载EPUB文件失败'
    loading.value = false
  }
}

// 更新导航状态
const updateNavigation = () => {
  if (displayed) {
    canGoPrev.value = !!displayed.prev
    canGoNext.value = !!displayed.next
  }
}

// 上一页
const prev = async () => {
  try {
    if (displayed && displayed.prev) {
      displayed = await rendition.display(displayed.prev)
      updateNavigation()
    }
  } catch (err) {
    console.error('切换到上一页失败:', err)
  }
}

// 下一页
const next = async () => {
  try {
    if (displayed && displayed.next) {
      displayed = await rendition.display(displayed.next)
      updateNavigation()
    }
  } catch (err) {
    console.error('切换到下一页失败:', err)
  }
}

// 重试加载
const retryLoad = () => {
  // 强制重新渲染容器
  containerKey.value++
  nextTick(() => {
    initializeReader()
  })
}

// 监听URL变化
watch(
  () => props.url,
  () => {
    initializeReader()
  },
)

// 组件挂载时初始化
onMounted(() => {
  // 延迟一点时间确保DOM完全准备好
  setTimeout(() => {
    initializeReader()
  }, 200)
})

// 组件卸载时清理
onUnmounted(() => {
  if (rendition) {
    try {
      rendition.destroy()
    } catch (e) {
      console.warn('销毁rendition时出错:', e)
    }
    rendition = null
  }

  if (book) {
    try {
      book.destroy()
    } catch (e) {
      console.warn('销毁book时出错:', e)
    }
    book = null
  }
})
</script>

<style scoped>
.epub-reader {
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: #fdfdfd;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  color: #dc3545;
  font-size: 18px;
  z-index: 10;
}

.retry-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.retry-button:hover {
  background-color: #0056b3;
}

.toolbar {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

.nav-button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.nav-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #333;
}

.reader-container {
  width: 100%;
  height: 100%;
}

.epub-container {
  width: 100%;
  height: calc(100% - 50px);
}
</style>
