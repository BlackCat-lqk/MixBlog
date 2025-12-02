<template>
  <div class="epub-reader">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ loadingText }}</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="retry" class="retry-button">重试</button>
    </div>

    <div v-else class="reader-container">
      <!-- 阅读器工具栏 -->
      <div class="toolbar">
        <div class="toolbar-group">
          <button @click="prev" :disabled="!canGoPrev" class="toolbar-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
              />
            </svg>
          </button>
          <button @click="next" :disabled="!canGoNext" class="toolbar-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
              />
            </svg>
          </button>
        </div>

        <div class="toolbar-group">
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        </div>

        <div class="toolbar-group">
          <select v-model="fontSize" @change="updateFontSize" class="font-size-select">
            <option value="0.8">小号</option>
            <option value="1">标准</option>
            <option value="1.2">大号</option>
            <option value="1.4">超大</option>
          </select>

          <button @click="toggleTheme" class="theme-toggle-button">
            {{ theme === 'light' ? '🌙' : '☀️' }}
          </button>
        </div>
      </div>

      <!-- 阅读器主体 -->
      <div ref="viewerRef" class="viewer" :class="theme"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import type { Book, Rendition, Location } from 'epubjs'
import { dynamicImportEpub } from '@/utils/dynamicImport'

// 类型定义
interface EpubTheme {
  light: object
  dark: object
}

// Props
interface Props {
  url: string
  loadingText?: string
}

const props = withDefaults(defineProps<Props>(), {
  url: '',
  loadingText: '正在加载电子书...',
})

// 事件
const emit = defineEmits<{
  (e: 'ready'): void
  (e: 'error', error: Error): void
  (e: 'locationChange', location: Location): void
}>()

// 响应式数据
const viewerRef = ref<HTMLElement | null>(null)
const book = ref<Book | null>(null)
const rendition = ref<Rendition | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const canGoPrev = ref(false)
const canGoNext = ref(false)
const currentPage = ref(0)
const totalPages = ref(0)
const fontSize = ref('1')
const theme = ref<'light' | 'dark'>('light')

let ePub: typeof import('epubjs').default

// 初始化阅读器
const initReader = async () => {
  if (!viewerRef.value || !props.url) return

  // 检查URL是否有效
  if (!props.url || typeof props.url !== 'string' || props.url.trim() === '') {
    handleError(new Error('电子书URL不能为空'))
    return
  }

  try {
    // 动态导入 epubjs
    const epubModule = await dynamicImportEpub()
    ePub = epubModule.default

    error.value = null

    // 验证URL是否可以访问
    const isValidUrl = await validateEpubUrl(props.url)
    if (!isValidUrl) {
      throw new Error('电子书文件无法访问，请检查文件地址是否正确')
    }

    // 检查容器元素是否有有效的尺寸
    if (viewerRef.value.offsetWidth === 0 || viewerRef.value.offsetHeight === 0) {
      console.warn('Viewer container has zero dimensions, waiting for size...')
      // 等待容器获得尺寸
      await waitForContainerSize()
    }

    // 销毁之前的实例
    if (book.value) {
      book.value.destroy()
    }

    // 创建书籍实例
    book.value = ePub(props.url)

    // 等待书籍加载完成
    await book.value.ready

    // 创建渲染实例
    rendition.value = book.value.renderTo(viewerRef.value, {
      width: '100%',
      height: '100%',
      spread: 'auto',
    })
    // 注册主题
    const themes: EpubTheme = {
      light: {
        body: {
          color: '#000',
          background: '#fff',
        },
      },
      dark: {
        body: {
          color: '#fff',
          background: '#000',
        },
      },
    }

    // 应用主题
    if (rendition.value.themes) {
      rendition.value.themes.register('light', themes.light)
      rendition.value.themes.register('dark', themes.dark)
      rendition.value.themes.select(theme.value)
    }

    // 显示书籍
    await rendition.value.display()

    // 注册事件监听器
    if (rendition.value.on) {
      rendition.value.on('relocated', (location: Location) => {
        updateLocation(location)
        emit('locationChange', location)
      })

      rendition.value.on('rendered', () => {
        emit('ready')
      })

      rendition.value.on('displayed', () => {})

      rendition.value.on('loaderror', (err: Error) => {
        handleError(err)
      })
    } else {
      // 兼容旧版本API
      //@ts-ignore
      rendition.value.on('locationChanged', (location: Location) => {
        updateLocation(location)
        //@ts-ignore
        emit('locationChange', location)
      })

      //@ts-ignore
      rendition.value.on('renderer:ready', () => {
        emit('ready')
      })

      //@ts-ignore
      rendition.value.on('renderer:loaderror', (err: Error) => {
        handleError(err)
      })
    }
  } catch (err) {
    handleError(err as Error)
  }
}

// 等待容器元素获得有效尺寸
const setTimeoutId = ref<ReturnType<typeof setTimeout> | null>(null)
const waitForContainerSize = async () => {
  return new Promise<void>((resolve) => {
    let attempts = 0
    const maxAttempts = 50 // 最多重试50次

    const checkSize = () => {
      attempts++
      if (viewerRef.value && viewerRef.value.offsetWidth > 0 && viewerRef.value.offsetHeight > 0) {
        resolve()
      } else if (attempts < maxAttempts) {
        setTimeoutId.value = setTimeout(checkSize, 100)
      } else {
        // 即使没有尺寸也继续，让后续流程决定如何处理
        resolve()
      }
    }
    checkSize()
  })
}

// 验证EPUB文件URL是否有效
const validateEpubUrl = async (url: string): Promise<boolean> => {
  try {
    // 对于相对路径或同源URL，直接返回true
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return true
    }

    // 对于绝对URL，检查协议
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // 在浏览器环境中，检查是否同源
      if (typeof window !== 'undefined') {
        const urlObj = new URL(url, window.location.href)
        // 如果是同源请求，直接返回true
        if (urlObj.origin === window.location.origin) {
          return true
        }
      }

      // 对于跨域请求，我们无法直接验证，所以返回true并依赖后续加载过程的错误处理
      return true
    }

    // 其他情况，默认返回true
    return true
  } catch (e) {
    console.error('URL验证失败:', e)
    return false
  }
}

// 更新位置信息
const updateLocation = (location: Location) => {
  if (location && location.start) {
    currentPage.value = location.start.displayed.page
    totalPages.value = location.start.displayed.total
    canGoPrev.value = !location.atStart
    canGoNext.value = !location.atEnd
  }
}

// 翻页功能
const prev = () => {
  if (rendition.value && canGoPrev.value) {
    rendition.value.prev()
  }
}

const next = () => {
  if (rendition.value && canGoNext.value) {
    rendition.value.next()
  }
}

// 字体大小调整
const updateFontSize = () => {
  if (rendition.value) {
    rendition.value.themes.fontSize(`${fontSize.value}em`)
  }
}

// 主题切换
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  if (rendition.value) {
    rendition.value.themes.select(theme.value)
  }
}

// 错误处理
const handleError = (err: any) => {
  // 提供更友好的错误消息
  if (err.message) {
    if (err.message.includes('Failed to fetch') || err.message.includes('fetch')) {
      error.value = '无法加载电子书文件，请检查网络连接或文件地址是否正确'
    } else if (err.message.includes('Unexpected token')) {
      error.value = '电子书文件格式不正确'
    } else if (err.message.includes('HTTP')) {
      error.value = '无法访问电子书文件，请检查文件是否存在且可访问'
    } else if (err.message.includes('NotAllowedError')) {
      error.value = '浏览器安全策略限制，请检查是否允许加载该文件'
    } else if (err.message.includes('NetworkError')) {
      error.value = '网络错误，请检查网络连接'
    } else if (err.message.includes('Timeout')) {
      error.value = '加载超时，请检查文件大小或网络状况'
    } else {
      error.value = err.message || '加载电子书时发生错误'
    }
  } else if (err.name === 'SecurityError') {
    error.value = '安全策略阻止了文件加载，请检查跨域设置'
  } else {
    error.value = '加载电子书时发生未知错误'
  }

  emit('error', err)
}

// 重试功能
const retry = () => {
  initReader()
}

// 监听URL变化
watch(
  () => props.url,
  (newUrl) => {
    if (newUrl) {
      nextTick(() => {
        initReader()
      })
    }
  },
)

// 组件挂载
onMounted(() => {
  if (props.url) {
    // 使用nextTick确保DOM完全渲染后再初始化阅读器
    nextTick(() => {
      initReader()
    })
  }
})

// 组件卸载
onUnmounted(() => {
  if (book.value) {
    book.value.destroy()
  }
  if (setTimeoutId.value) {
    clearTimeout(setTimeoutId.value)
  }
})
</script>

<style scoped lang="scss">
.epub-reader {
  min-width: 200px;
  min-height: 500px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: auto;
  background-color: #fff;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
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

.error-message {
  color: #e74c3c;
  margin-bottom: 16px;
  text-align: center;
}

.retry-button {
  padding: 8px 16px;
  background-color: #3498db;
  color: var(--text-color);
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
}

.reader-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #e9ecef;
  }
}

.page-info {
  font-size: 14px;
  color: #495057;
  font-weight: 500;
  min-width: 80px;
  text-align: center;
}

.font-size-select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
}

.theme-toggle-button {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #e9ecef;
  }
}

.viewer {
  flex: 1;
  overflow: hidden;

  &.dark {
    background-color: #000;
  }

  &.light {
    background-color: #fff;
  }

  :deep(iframe) {
    border: none;
    width: 100%;
    height: 100%;
  }
}
</style>
