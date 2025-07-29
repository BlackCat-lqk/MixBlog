<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <div class="document-box">
    <div class="search-box">
      <h3>{{ $t('bookDoc.title') }}</h3>
      <n-input
        clearable
        round
        :placeholder="$t('bookDoc.inputTip')"
        v-model:value="searchKeyword"
        @input="handleChangeSearch"
      />
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
              :style="`background:${changeBg[item.suffix]} no-repeat; background-size: 50%; background-position: center center;`"
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
                <n-button type="primary" @click="downloadFile(item)">下载</n-button>
                <n-button type="info" @click="getPreviewDetail(item)">在线预览</n-button>
              </div>
            </n-card>
          </n-grid-item>
          <n-grid-item v-for="(item, idx) in bookDocData" :key="idx">
            <n-card
              hoverable
              :style="`background:${changeBg[item.suffix]} no-repeat; background-size: 50%; background-position: center center;`"
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
                <n-button type="primary" @click="downloadFile(item)">下载</n-button>
                <n-button type="info" @click="getPreviewDetail(item)">在线预览</n-button>
              </div>
            </n-card>
          </n-grid-item>
          <n-grid-item v-for="(item, idx) in bookDocData" :key="idx">
            <n-card
              hoverable
              :style="`background:${changeBg[item.suffix]} no-repeat; background-size: 50%; background-position: center center;`"
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
                <n-button type="primary" @click="downloadFile(item)">下载</n-button>
                <n-button type="info" @click="getPreviewDetail(item)">在线预览</n-button>
              </div>
            </n-card>
          </n-grid-item>
          <n-grid-item v-for="(item, idx) in bookDocData" :key="idx">
            <n-card
              hoverable
              :style="`background:${changeBg[item.suffix]} no-repeat; background-size: 50%; background-position: center center;`"
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
                <n-button type="primary" @click="downloadFile(item)">下载</n-button>
                <n-button type="info" @click="getPreviewDetail(item)">在线预览</n-button>
              </div>
            </n-card>
          </n-grid-item>
          <n-grid-item v-for="(item, idx) in bookDocData" :key="idx">
            <n-card
              hoverable
              :style="`background:${changeBg[item.suffix]} no-repeat; background-size: 50%; background-position: center center;`"
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
            <img width="32px" src="@/assets/images/close1.svg" @click="showPreview = false" />
          </div>
        </template>
        <vue-office-pdf
          v-if="previewData.suffix === 'pdf'"
          :src="previewData.path"
          @error="handleError"
          style="height: 100% !important"
          :options="pdfOptions"
        />
        <vue-office-docx
          v-else-if="previewData.suffix === 'docx'"
          :src="previewData.path"
          @error="handleError"
          :options="pdfOptions"
        />
        <vue-office-excel
          v-else-if="previewData.suffix === 'xlsx'"
          :src="previewData.path"
          @error="handleError"
          :options="pdfOptions"
        />
        <novel-reader
          v-else-if="previewData.suffix === 'txt'"
          :txt-url="previewData.path"
          :book-id="previewData._id"
        >
        </novel-reader>
        <div v-else class="preview-error-tip">预览出错啦！请下载文档查看吧</div>
      </n-card>
    </n-modal>
  </div>

  <footer>
    <FooterNav></FooterNav>
  </footer>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import HeaderNav from '@/views/Header/HeaderNav.vue'
import FooterNav from '@/views/Footer/FooterNav.vue'
import { getBookDocApi } from '@/http/uploadFile'
import { useMessage } from 'naive-ui'
import VueOfficeDocx from '@vue-office/docx'
import VueOfficeExcel from '@vue-office/excel'
import VueOfficePdf from '@vue-office/pdf'
import NovelReader from '@/components/NovelReader.vue'
import _ from 'lodash'
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

const handleError = (err: unknown) => {
  console.error('加载失败:', err)
}

interface BookDocData {
  _id: string
  filename: string
  category: string
  path: string
  size: number
  updatedAt: string
  suffix: string
  description: string
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

const showPreview = ref(false)

// 根据文件后缀改变背景
const changeBg = {
  pdf: `url("${new URL('@/assets/images/file/pdf.svg', import.meta.url).href}")`,
  doc: `url("${new URL('@/assets/images/file/word.svg', import.meta.url).href}")`,
  docx: `url("${new URL('@/assets/images/file/word.svg', import.meta.url).href}")`,
  xlsx: `url("${new URL('@/assets/images/file/excel.svg', import.meta.url).href}")`,
  txt: `url("${new URL('@/assets/images/file/txt.svg', import.meta.url).href}")`,
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

// 下载文件
const downloadFile = _.debounce((data: BookDocData) => {
  const link = document.createElement('a')
  link.href = data.path
  link.download = data.filename
  link.click()
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
  showPreview.value = true
  previewData.value.path = data.path
  previewData.value.filename = data.filename
  previewData.value.suffix = data.suffix
  previewData.value._id = data._id
}
// 获取文件列表
const getBookDocDataList = async () => {
  const response = await getBookDocApi({})
  const res = response.data
  if (res.code === 200) {
    bookDocData.value = res.data
    bookDocAllData.value = res.data
    bookCategories.value = res.categories
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
      width: 280px;
      max-height: 70vh;
      height: 70vh;
      border-radius: 8px;
      background-color: var(--box-bg-color4);
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 10px 20px;
      overflow: auto;
      @include g.scrollbarCustom;
      .classify-item-box {
        display: flex;
        align-items: center;
        padding: 30px 10px;
        background-color: var(--box-bg-color1);
        border-radius: 8px;
        border: 1px solid var(--border-color);
        cursor: pointer;
        &:hover {
          background-color: var(--box-bg-color5);
        }
        span {
          font-size: 18px;
          font-weight: 500;
          color: var(--text-color);
        }
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
      padding: 10px;
      max-height: 70vh;
      height: 70vh;
      .n-empty {
        width: 100%;
        height: 100%;
        @include g.flexCenter;
      }
      > div {
        width: 260px;
        height: 200px;
      }
      :deep(.n-card) {
        border-radius: 5px;
        .n-card__content {
          border-radius: 5px;
          background-color: var(--box-bg-color7);
          backdrop-filter: blur(2px);
        }
        h3 {
          font-size: 16px;
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
}
</style>
