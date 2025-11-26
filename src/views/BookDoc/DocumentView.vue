<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <div class="document-box">
    <div class="search-box">
      <GradientFlow class-name="search-box">
        <template #content>
          <n-input
            clearable
            round
            :placeholder="$t('bookDoc.inputTip')"
            v-model:value="searchKeyword"
            @input="handleChangeSearch"
          />
        </template>
      </GradientFlow>
    </div>
    <div class="content-box">
      <div class="classify-box">
        <div
          :class="bgKey === 'all' ? 'classify-item-box active-classify-item' : 'classify-item-box'"
          @click="filterFiles('all')"
        >
          <span>{{ $t('common.all') + '（' + bookDocAllData.length }}）</span>
        </div>
        <div
          v-for="(item, key) in bookCategories"
          :key="key"
          @click="filterFiles(key)"
          :class="bgKey === key ? 'classify-item-box active-classify-item' : 'classify-item-box'"
        >
          <span>{{ key }}（{{ item }}）</span>
        </div>
      </div>
      <div v-if="bookDocData.length" class="doc-list-box">
        <n-grid :x-gap="12" :y-gap="12" :cols="4">
          <n-grid-item v-for="(item, idx) in bookDocData" :key="idx">
            <n-card
              hoverable
              :style="
                item.docCover
                  ? `background:url('/${item.docCover}') no-repeat center;background-size: contain;`
                  : `background:${changeBg[item.suffix]} no-repeat center;background-size: contain;`
              "
            >
              <n-tooltip trigger="hover">
                <template #trigger>
                  <h3>{{ item.filename }}</h3>
                </template>
                {{ item.filename }}
              </n-tooltip>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <p>描述：{{ item.description }}</p>
                </template>
                {{ item.description }}
              </n-tooltip>
              <div class="doc-info">
                <span>类型：{{ item.suffix }}</span>
                <span>大小：{{ item.size }}</span>
                <span>时间：{{ item.updatedAt }}</span>
              </div>
              <div class="btn-box">
                <!-- 下载需要登录 -->
                <n-button type="primary" @click="downloadFile(item)">下载</n-button>
                <n-button type="info" @click="getPreviewDetail(item)">在线预览</n-button>
              </div>
            </n-card>
          </n-grid-item>
        </n-grid>
      </div>
      <div v-else class="doc-list-box">
        <n-empty description="无数据"> </n-empty>
      </div>
    </div>
  </div>
  <div class="preview-file-box" ref="documentBox">
    <n-modal v-model:show="showPreview" :to="documentBox">
      <n-card content-class="vue-office-pdf-box" role="dialog" aria-modal="false">
        <template #header>
          <div class="preivew-card-header-close">
            <img
              width="32px"
              src="@/assets/images/close1.svg"
              @click="showPreview = false"
              alt="close"
            />
          </div>
          <div class="zoom-controls" v-if="!((showTxtReader && !showOnlyOffice) || (showOnlyOffice && !showTxtReader))">
            <button @click="zoomOut" class="zoom-button" :disabled="loading">-</button>
            <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
            <button @click="zoomIn" class="zoom-button" :disabled="loading">+</button>
          </div>
        </template>
        <div v-if="loading && !showOnlyOffice && !showTxtReader" class="loading-placeholder">
          <div class="loading-spinner"></div>
          <p>正在加载文件...</p>
          <p class="debug-info">文件路径: {{ previewData.path }}</p>
        </div>
        <vue-office-pdf
          v-if="previewData.suffix === 'pdf' || previewData.suffix === 'PDF'"
          :src="previewData.path"
          @error="handleError"
          @rendered="onPdfRendered"
          :style="[
            {
              transform: `scale(${scale})`,
              height: '100% !important',
            },
          ]"
          :options="pdfOptions"
        />
        <vue-office-docx
          v-else-if="previewData.suffix === 'docx' || previewData.suffix === 'DOCX'"
          :src="previewData.path"
          @error="handleError"
          :style="[
            {
              transform: `scale(${scale})`,
              height: '100% !important',
            },
          ]"
          @rendered="onPdfRendered"
          :options="pdfOptions"
        />
        <vue-office-excel
          v-else-if="previewData.suffix === 'xlsx' || previewData.suffix === 'XLSX'"
          :src="previewData.path"
          @error="handleError"
          :style="[
            {
              transform: `scale(${scale})`,
              height: '100% !important',
            },
          ]"
          @rendered="onPdfRendered"
          :options="pdfOptions"
        />
        <div v-if="!loading && showOnlyOffice && showTxtReader" class="preview-error-tip">预览出错啦！请下载文档查看吧</div>
        <novel-reader
          v-if="showTxtReader && !showOnlyOffice"
          :txt-url="previewData.path"
          :book-id="previewData._id"
        >
        </novel-reader>
        <book-reader
          v-show="showOnlyOffice && !showTxtReader"
          :url="previewData.path"
        ></book-reader>

      </n-card>
    </n-modal>
  </div>

  <footer>
    <FooterNav></FooterNav>
  </footer>
</template>

<script lang="ts" setup>
import HeaderNav from '@/views/Header/HeaderNav.vue'
import FooterNav from '@/views/Footer/FooterNav.vue'
import { getBookDocApi, getPrivateBookDocApi } from '@/http/uploadFile'
import { useUserInfoStore } from '@/stores/userInfo'
import { useMessage } from 'naive-ui'
import GradientFlow from '@/views/MixLab/components/GradientFlow.vue'
import type { IBookDocData as BookDocData } from '@/tsInterface'
const userInfoStore = useUserInfoStore()
const router = useRouter()
// 动态导入文档处理组件
const VueOfficeDocx = defineAsyncComponent(() => import('@vue-office/docx'))
const VueOfficeExcel = defineAsyncComponent(() => import('@vue-office/excel'))
const VueOfficePdf = defineAsyncComponent(() => import('@vue-office/pdf'))
import NovelReader from '@/components/NovelReader.vue'
import BookReader from '@/components/BookReader.vue'
import _ from 'lodash'
const showOnlyOffice = ref(false)
const showTxtReader = ref(false)
const message = useMessage()
const bgKey = ref('all')
const searchKeyword = ref('')
const pdfOptions = {
  maxPagesToRender: null,
  disableAutoFetch: false,
  disableStream: false,
  cMapUrl: 'https://unpkg.com/pdfjs-dist@2.10.377/cmaps/', // 避免字体问题
  cMapPacked: true,
}

const documentBox = ref<string | HTMLElement>('')
const handleError = (error: unknown) => {
  console.error('PDF加载错误:', error)
  loading.value = false
  loadError.value = error instanceof Error ? error.message : String(error)
  console.error('加载失败:', error)
}
const previewData = ref({
  _id: '',
  path: '',
  filename: '',
  suffix: '',
})
const bookDocData = ref([] as BookDocData[])
const bookDocAllData = ref([] as BookDocData[])
const bookCategories = ref({})
// 缩放相关状态
const scale = ref(1)
const loading = ref(true)
const loadError = ref<string | null>(null)

const showPreview = ref(false)

// 根据文件后缀改变背景
const changeBg = {
  pdf: `url("${new URL('@/assets/images/file/pdf.svg', import.meta.url).href}")`,
  PDF: `url("${new URL('@/assets/images/file/pdf.svg', import.meta.url).href}")`,
  doc: `url("${new URL('@/assets/images/file/word.svg', import.meta.url).href}")`,
  docx: `url("${new URL('@/assets/images/file/word.svg', import.meta.url).href}")`,
  DOC: `url("${new URL('@/assets/images/file/word.svg', import.meta.url).href}")`,
  DOCX: `url("${new URL('@/assets/images/file/word.svg', import.meta.url).href}")`,
  xlsx: `url("${new URL('@/assets/images/file/excel.svg', import.meta.url).href}")`,
  txt: `url("${new URL('@/assets/images/file/txt.svg', import.meta.url).href}")`,
  XLSX: `url("${new URL('@/assets/images/file/excel.svg', import.meta.url).href}")`,
  TXT: `url("${new URL('@/assets/images/file/txt.svg', import.meta.url).href}")`,
  epub: `url("${new URL('@/assets/images/file/txt.svg', import.meta.url).href}")`,
  EPUB: `url("${new URL('@/assets/images/file/txt.svg', import.meta.url).href}")`,
} as Record<string, string>

// 搜索过滤文件
const handleChangeSearch = _.debounce(async (value: string) => {
  bgKey.value = '-1'
  if (value) {
    const params = {
      filename: value,
      category: '',
      type: '',
    }
    const response = await getBookDocApi(params)
    const res = response.data
    if (res.code === 200) {
      bookDocData.value = res.data
    } else {
      message.error(res.message)
    }
  } else {
    bookDocData.value = bookDocAllData.value
  }
}, 300)

// 放大
const zoomIn = () => {
  scale.value = Math.min(scale.value + 0.1, 3)
}

// 缩小
const zoomOut = () => {
  scale.value = Math.max(scale.value - 0.1, 0.5)
}

// PDF渲染完成回调
const onPdfRendered = () => {
  loading.value = false
}

// 重置状态
const resetState = () => {
  loading.value = true
  loadError.value = null
}

// 下载文件
const downloadFile = _.debounce((data: BookDocData) => {
  if (userInfoStore.data.user.isLogin) {
    const link = document.createElement('a')
    link.href = data.path
    link.download = data.filename
    link.click()
  } else {
    message.info('请先登录')
    router.push('/register-login')
  }
}, 500)
// 过滤文件
const filterFiles = (key: string) => {
  bgKey.value = key
  searchKeyword.value = ''
  if (key === 'all') return (bookDocData.value = bookDocAllData.value)
  bookDocData.value = bookDocAllData.value.filter((item) => item.category == key)
}

// 获取预览信息
const getPreviewDetail = (data: BookDocData) => {
  // 初始化加载状态
  resetState()
  showPreview.value = true
  previewData.value.path = data.path
  previewData.value.filename = data.filename
  previewData.value.suffix = data.suffix
  previewData.value._id = data._id
  const suffix = ['FB2', 'fb2', 'CBZ', 'cbz', 'KF8', 'kf8', 'epub', 'EPUB']
  showOnlyOffice.value = suffix.includes(data.suffix)
  showTxtReader.value = data.suffix === 'txt' || data.suffix === 'TXT'
}
// 获取文件列表
const getBookDocDataList = async () => {
  const response = await getBookDocApi({})
  const res = response.data
  if (res.code === 200) {
    bookDocData.value = res.data
    bookDocAllData.value = res.data
    bookCategories.value = res.categories
    // 是否已登录且是管理员？
    if (userInfoStore.data.user.isLogin && userInfoStore.data.user.role == 'admin') {
      const privates = await getPrivateBookDocApi({})
      const privateRes = privates.data
      if (privateRes.code === 200) {
        bookDocData.value = res.data.concat(privateRes.data)
        bookDocAllData.value = res.data.concat(privateRes.data)
        Object.assign(bookCategories.value, privateRes.categories)
      }
    }
  } else {
    message.error(res.message)
  }
}

onMounted(() => {
  getBookDocDataList()
})
</script>

<style lang="scss" scoped>
.document-box {
  min-width: 1480px;
  max-width: 1480px;
  margin-top: calc(2vh + 64px);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .search-box {
    width: 640px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    border: 2px solid transparent;
    border-radius: 30px;
    h3 {
      color: var(--text-color1);
      line-height: 1.34;
      font-size: 18px;
      padding-bottom: 10px;
    }
  }
  .content-box {
    display: flex;
    margin: 40px 0;
    gap: 24px;
    width: 100%;
    .classify-box {
      width: 200px;
      max-height: 70vh;
      height: 70vh;
      border-radius: 8px;
      background-color: var(--box-bg-color4);
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 15px 20px;
      overflow: auto;
      box-shadow:
        rgba(50, 50, 105, 0.15) 0px 2px 5px 0px,
        rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
      @include g.scrollbarCustom;
      .classify-item-box,
      .classify-admin-box {
        display: flex;
        align-items: center;
        padding: 20px 10px;
        background-color: var(--box-bg-color1);
        border-radius: 4px;
        border: 1px solid var(--border-color);
        cursor: pointer;
        &:hover {
          background-color: var(--box-bg-color5);
        }
        span {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-color);
        }
      }
      .classify-admin-box {
        background: linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6);
        background-color: transparent;
      }
      .active-classify-item {
        background-color: var(--box-bg-color5);
      }
    }
    .doc-list-box {
      flex: 1;
      width: 100%;
      display: flex;
      overflow: auto;
      @include g.scrollbarCustom;
      background-color: var(--box-bg-color4);
      border-radius: 8px;
      padding: 15px 20px;
      max-height: 70vh;
      height: 70vh;
      box-shadow:
        rgba(50, 50, 105, 0.15) 0px 2px 5px 0px,
        rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
      .n-empty {
        width: 100%;
        height: 100%;
        @include g.flexCenter;
      }
      > div {
        width: 200px;
        height: 280px;
      }
      :deep(.n-card) {
        border-radius: 5px;
        box-shadow: var(--shadow-color);
        transition: all 0.3s ease;
        width: 200px;
        height: 280px;
        &:hover {
          scale: 1.05;
        }
        .n-card__content {
          border-radius: 5px;
          background-color: var(--box-bg-color7);
          width: 100%;
          height: 62%;
          position: absolute;
          bottom: 0;
          &:hover {
            backdrop-filter: blur(10px);
          }
        }
        h3 {
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        p {
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .doc-info {
          display: flex;
          flex-direction: column;
        }
        .btn-box {
          display: flex;
          gap: 12px;
        }
      }
    }
  }
}
.preview-file-box {
  :deep(.n-card) {
    width: 80vw;
    height: 90vh;
    .preivew-card-header-close {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      cursor: pointer;
    }
    .n-card__content {
      height: 90vh;
      overflow: auto;
      @include g.scrollbarCustom;
      .preview-error-tip {
        width: 100%;
        height: 100%;
        @include g.flexCenter;
        font-size: 24px;
        font-weight: 600;
        color: rgb(255, 25, 0);
      }
    }
    .vue-office-pdf {
      height: 100% !important;
    }
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
}
</style>
