<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <div class="document-box">
    <div class="search-box">
      <h3>书籍文档</h3>
      <n-input round placeholder="搜索"> </n-input>
    </div>
    <div class="content-box">
      <div class="classify-box"></div>
      <div class="doc-list-box">
        <n-grid :x-gap="12" :y-gap="12" :cols="4">
          <n-grid-item v-for="(item, idx) in bookDocData" :key="idx">
            <n-card
              hoverable
              :style="`background:${changeBg[item.suffix]} no-repeat; background-size: 60%; background-position: center center;`"
            >
              <h3>{{ item.filename }}</h3>
              <p>描述：{{ item.description }}</p>
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
    </div>
  </div>
  <GeneralPreview
    v-if="showPreview"
    :fileUrl="previewData.path"
    :fileName="previewData.filename"
  ></GeneralPreview>
  <footer>
    <FooterNav></FooterNav>
  </footer>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import HeaderNav from '@/views/Header/HeaderNav.vue'
import FooterNav from '@/views/Footer/FooterNav.vue'
import GeneralPreview from '@/views/PreviewComponent/GeneralPreview.vue'
import { getBookDocApi } from '@/http/uploadFile'
import { useMessage } from 'naive-ui'
const message = useMessage()

interface BookDocData {
  filename: string
  category: string
  path: string
  size: number
  updatedAt: string
  suffix: string
  description: string
}
const previewData = ref({
  path: '',
  filename: '',
})
const bookDocData = ref([] as BookDocData[])

const showPreview = ref(false)

// 根据文件后缀改变背景
const changeBg = {
  pdf: `url("${new URL('@/assets/images/file/pdf.svg', import.meta.url).href}")`,
  doc: `url("${new URL('@/assets/images/file/word.svg', import.meta.url).href}")`,
  docx: `url("${new URL('@/assets/images/file/word.svg', import.meta.url).href}")`,
} as Record<string, string>

// 下载文件
const downloadFile = (data: BookDocData) => {
  const link = document.createElement('a')
  link.href = data.path
  link.download = data.filename
  link.click()
}
// 获取预览信息
const getPreviewDetail = (data: BookDocData) => {
  showPreview.value = true
  previewData.value.path = data.path
  previewData.value.filename = data.filename
}
// 获取文件列表
const getBookDocDataList = async () => {
  const response = await getBookDocApi()
  const res = response.data
  if (res.code === 200) {
    bookDocData.value = res.data
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
  min-width: 1240px;
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
    .classify-box {
      width: 280px;
      min-height: 500px;
      border-radius: 8px;
      background-color: var(--box-bg-color1);
    }
    .doc-list-box {
      flex: 1;
      display: flex;
      :deep(.n-card) {
        border-radius: 5px;
        .n-card__content {
          border-radius: 5px;
          background-color: var(--box-bg-color7);
          backdrop-filter: blur(2px);
        }
        h3 {
          font-size: 14px;
          font-weight: 600;
        }
        p {
          font-size: 12px;
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
</style>
