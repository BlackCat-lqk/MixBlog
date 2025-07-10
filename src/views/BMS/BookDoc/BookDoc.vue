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
        <div class="book-doc-list-box">
          <n-button
            type="info"
            v-for="(item, idx) in fileListData"
            :key="idx"
            >{{ item.filename }}
            <template #icon>
            <n-icon @click="deleteBookDoc(item)">
              <img style="width: 18px;" src="@/assets/images/DeleteHover.svg">
            </n-icon>
            <n-icon @click="handleDownload(item)">
              <img style="width: 18px;" src="@/assets/images/Download.svg">
            </n-icon>
          </template>
            </n-button
          >
        </div>
        <div class="upload-box">
          <n-upload
            :default-file-list="fileList"
            :max="1"
            list-type="image-card"
            :custom-request="createCustomUpload"
            :headers="{
              Authorization: `Bearer ${userInfoStore.data.token}`,
            }"
          ></n-upload>
          <n-button @click="handleUploadFile">开始上传</n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import type { UploadFileInfo } from 'naive-ui'
import { useUserInfoStore } from '@/stores/userInfo'
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import { uploadBookDocApi, getBookDocApi, deleteBookDocApi } from '@/http/uploadFile'
import { useMessage } from 'naive-ui'
const message = useMessage()
const userInfoStore = useUserInfoStore()

const fileList = reactive([
  {
    id: 'createFile',
    name: 'createFile',
    url: '',
    status: 'finished',
  },
])

interface formType {
  category: string
  description: string
  tempFile: UploadFileInfo | null
}

// 表单数据
const fileForm: formType = reactive({
  category: '',
  description: '',
  tempFile: null,
})

interface bookDocType {
  filename: string
  path: string
  _id: string
}

// 自定义上传函数（不实际上传）
const createCustomUpload = ({ file }: { file: UploadFileInfo }) => {
  fileForm.tempFile = file
}
// 下载文件
const handleDownload = (data: bookDocType) => {
  const link = document.createElement('a');
  link.href = data.path;
  link.download = data.filename;
  link.click();
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
  // 调用文件上传接口
  if (fileForm.tempFile && fileForm.tempFile.file) {
    const formData = new FormData()
    formData.append('file', fileForm.tempFile?.file)
    formData.append('category', 'world-book')
    const response = await uploadBookDocApi(formData)
    const res = response.data
    if (res.code === 200) {
      fileList[0].url = res.data.path
      message.success(res.message)
    } else {
      message.error(res.message)
    }
  }
}

// 获取文档列表
const fileListData = ref([] as bookDocType[])
const getBookDocList = async () => {
  const response = await getBookDocApi()
  const res = response.data
  if (res.code === 200) {
    fileListData.value = res.data
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
  .book-doc-list-box{
    display: flex;
    gap: 24px;
  }
}
</style>
