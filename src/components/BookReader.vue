<template>
  <div class="epub-reader">
    <!-- 阅读器视图 -->
    <div ref="viewer" class="viewer"></div>

    <!-- 简单控制栏 -->
    <div class="controls">
      <button @click="prevPage" :disabled="!canGoPrev">上一页</button>
      <span class="page-info">{{ displayLocation || '加载中...' }}</span>
      <button @click="nextPage" :disabled="!canGoNext">下一页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ePub, { Book, Rendition } from 'epubjs'

// 响应式数据
const viewer = ref<HTMLElement | null>(null)
const rendition = ref<Rendition | null>(null)
const book = ref<Book | null>(null)
const currentLocation = ref<any>(null) // 使用any类型避免类型冲突
const canGoPrev = ref<boolean>(true)
const canGoNext = ref<boolean>(true)

// 计算属性显示位置
const displayLocation = computed(() => {
  if (!currentLocation.value) return '加载中...'

  // 处理不同的位置信息格式
  if (currentLocation.value.displayed) {
    // 直接的位置信息对象
    return `${currentLocation.value.displayed.page}/${currentLocation.value.displayed.total}`
  } else if (currentLocation.value.start && currentLocation.value.start.displayed) {
    // 包含start/end结构的位置信息
    return `${currentLocation.value.start.displayed.page}/${currentLocation.value.start.displayed.total}`
  }

  return '加载中...'
})

// 组件属性
interface Props {
  url: string;
}

const props = withDefaults(defineProps<Props>(), {
  url: ''
})

// 初始化ePub
const initEpub = async (): Promise<void> => {
  if (!viewer.value) {
    console.error('阅读器容器未找到')
    return
  }

  try {
    // 创建ePub书籍实例
    book.value = ePub(props.url)
    if (!book.value) return

    // 创建渲染实例
    rendition.value = book.value.renderTo(viewer.value, {
      width: '100%',
      height: '100%',
      spread: 'auto'
    })

    // 显示书籍
    await rendition.value.display()

    // 设置位置变化监听
    rendition.value.on('locationChanged', (location: any) => {
      updateLocation(location)
    })

    // 初始更新位置状态
    const initialLocation = rendition.value.currentLocation()
    if (initialLocation) {
      updateLocation(initialLocation)
    }

  } catch (error) {
    console.error('加载ePub失败:', error)
  }
}

// 更新位置信息
const updateLocation = (location: any): void => {
  currentLocation.value = location

  // 根据位置信息更新导航按钮状态
  if (location.atStart !== undefined) {
    canGoPrev.value = !location.atStart
  }

  if (location.atEnd !== undefined) {
    canGoNext.value = !location.atEnd
  }
}

// 翻页方法
const prevPage = (): void => {
  if (rendition.value) {
    rendition.value.prev()
  }
}

const nextPage = (): void => {
  if (rendition.value) {
    rendition.value.next()
  }
}

// 组件生命周期
onMounted(() => {
  initEpub()
})

onUnmounted(() => {
  if (book.value) {
    book.value.destroy()
  }
})
</script>

<style scoped>
.epub-reader {
  width: 100%;
  height: 600px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.viewer {
  flex: 1;
  background: #f9f9f9;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
}

.controls button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.controls button:hover:not(:disabled) {
  background: #e9e9e9;
}

.page-info {
  font-size: 14px;
  color: #666;
}
</style>
