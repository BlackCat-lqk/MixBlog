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
        <div class="category">
          <div class="category-item">
            <img src="@/assets/images/file/file.svg" alt="文件" />
            <span>全部{{ fileListData.length }}</span>
          </div>
          <div v-for="(val, key) in allCategory" :key="key" class="category-item">
            <img src="@/assets/images/file/file.svg" alt="文件" />
            <span>{{ key }}: {{ val }}</span>
          </div>
        </div>
        <div>
          <div class="doc-list-box">
            <n-grid :x-gap="12" :y-gap="12" :cols="7">
              <n-grid-item v-for="(item, idx) in fileListData" :key="idx">
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
                    <n-button type="info" @click="deleteBookDoc(item)">删除</n-button>
                  </div>
                </n-card>
              </n-grid-item>
            </n-grid>
          </div>
          <div class="upload-box">
            <n-form ref="formRef" :model="fileForm" :rules="rules">
              <n-form-item label="分类" path="category">
                <n-input
                  v-model:value="fileForm.category"
                  maxlength="10"
                  show-count
                  clearable
                  placeholder="新建或选择分类"
                  @input="handleInputCategory"
                />
              </n-form-item>
              <n-form-item label="文件描述" path="description">
                <n-input
                  v-model:value="fileForm.description"
                  maxlength="30"
                  show-count
                  clearable
                  placeholder="请输入文件描述..."
                />
              </n-form-item>
              <n-form-item label="文件上传">
                <n-upload
                  :default-file-list="fileList"
                  :max="1"
                  list-type="image-card"
                  :custom-request="createCustomUpload"
                  :headers="{
                    Authorization: `Bearer ${userInfoStore.data.token}`,
                  }"
                ></n-upload>
              </n-form-item>
              <n-form-item label="封面上传">
                <n-upload
                  :default-file-list="fileCover"
                  :max="1"
                  list-type="image-card"
                  :custom-request="createCoverCustomUpload"
                  :headers="{
                    Authorization: `Bearer ${userInfoStore.data.token}`,
                  }"
                ></n-upload>
              </n-form-item>
              <n-button :disabled="btnStatus" @click="handleUploadFile">开始上传</n-button>
            </n-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { UploadFileInfo } from 'naive-ui'
import { useUserInfoStore } from '@/stores/userInfo'
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import { uploadBookDocApi, getBookDocApi, deleteBookDocApi } from '@/http/uploadFile'
import { useMessage } from 'naive-ui'
import _ from 'lodash'
const message = useMessage()
const userInfoStore = useUserInfoStore()
const rules = {
  category: {
    required: true,
    message: '请输入或选择分类',
    trigger: 'blur',
  },
}
const btnStatus = ref(true)
const fileList = reactive([
  {
    id: 'createFile',
    name: 'createFile',
    url: '',
    status: 'finished',
  },
])

const fileCover = reactive([
  {
    id: 'createFileCover',
    name: 'createFileCover',
    url: '',
    status: 'finished',
  },
])

interface formType {
  category: string
  description: string
  tempFile: UploadFileInfo | null
  tempFileCover: UploadFileInfo | null
}

// 表单数据
const fileForm: formType = reactive({
  category: '',
  description: '',
  tempFile: null,
  tempFileCover: null,
})

interface bookDocType {
  _id: string
  filename: string
  category: string
  path: string
  size: number
  updatedAt: string
  suffix: string
  description: string
}

const handleInputCategory = _.debounce((val: string) => {
  if (val) {
    btnStatus.value = false
  } else {
    btnStatus.value = true
  }
}, 300)

// 自定义上传函数（不实际上传）
const createCustomUpload = ({ file }: { file: UploadFileInfo }) => {
  fileForm.tempFile = file
}

const createCoverCustomUpload = ({ file }: { file: UploadFileInfo }) => {
  fileForm.tempFileCover = file
}

// 根据文件后缀改变背景
const changeBg = {
  pdf: `url("${new URL('@/assets/images/file/pdf.svg', import.meta.url).href}")`,
  doc: `url("${new URL('@/assets/images/file/word.svg', import.meta.url).href}")`,
  docx: `url("${new URL('@/assets/images/file/word.svg', import.meta.url).href}")`,
} as Record<string, string>

// 下载文件
const downloadFile = (data: bookDocType) => {
  const link = document.createElement('a')
  link.href = data.path
  link.download = data.filename
  link.click()
}

// 删除文件
const deleteBookDoc = async (data: bookDocType) => {
  const response = await deleteBookDocApi(data._id)
  const res = response.data
  if (res.code === 200) {
    message.success(res.message)
    getBookDocList()
  } else {
    message.error(res.message)
  }
}

// 开始上传
const handleUploadFile = async () => {
  if (!fileForm.category) return
  // 调用文件上传接口
  const formData = new FormData()
  if (fileForm.tempFileCover && fileForm.tempFileCover.file){
    formData.append('file', fileForm.tempFileCover?.file)
  }
  if (fileForm.tempFile && fileForm.tempFile.file) {
    formData.append('file', fileForm.tempFile?.file)
    formData.append('category', fileForm.category)
    formData.append('description', fileForm.description)
    console.log(formData)
    // const response = await uploadBookDocApi(formData)
    // const res = response.data
    // if (res.code === 200) {
    //   fileList[0].url = res.data.path
    //   message.success(res.message)
    //   getBookDocList()
    // } else {
    //   message.error(res.message)
    // }
  }
}

// 获取文档列表
const fileListData = ref([] as bookDocType[])
const allCategory = ref({} as object)
const getBookDocList = async () => {
  const response = await getBookDocApi({})
  const res = response.data
  if (res.code === 200) {
    fileListData.value = res.data
    allCategory.value = res.categories
  } else {
    message.error(res.message)
  }
}

onMounted(() => {
  getBookDocList()
})
</script>
a

<style scoped lang="scss">
@include g.bms;

.main-router-box {
  padding: 10px;
  gap: 12px;
  display: flex;
  flex-direction: column;
  .category {
    height: 200px;
    background-color: #2e33380d;
    border-radius: 8px;
    padding: 10px;
    display: flex;
    gap: 24px;
    .category-item {
      width: auto;
      height: 32px;
      border: 1px solid #67737c;
      border-radius: 5px;
      display: flex;
      align-items: center;
      padding: 5px 10px;
      cursor: pointer;
      &:hover {
        background-color: #2e3338;
        color: white;
      }
      img {
        width: 20px;
        height: 20px;
        object-fit: cover;
      }
      span {
        margin-left: 5px;
        font-size: 16px;
      }
    }
  }
  .doc-list-box {
    flex: 1;
    display: flex;
    padding: 10px;
    :deep(.n-card) {
      border-radius: 5px;
      min-width: 220px;
      box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.1);
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
</style>
