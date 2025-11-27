<template>
  <div class="about-set-main-box">
    <div class="about-content-box">
      <n-form ref="formRef" inline :label-width="80" :model="formValue" class="about-form-box">
        <n-form-item label="一句话介绍自己">
          <n-input
            v-model:value="formValue.intro"
            type="textarea"
            placeholder="请输入..."
            maxlength="100"
            show-count
            clearable
            :autosize="{ minRows: 2 }"
          />
        </n-form-item>
        <n-form-item label="标签（用空格隔开）">
          <n-input v-model:value="formValue.tags" placeholder="请输入..." />
        </n-form-item>
        <n-form-item label="上传背景图">
          <n-upload
            action="/api/upload-about-cover"
            list-type="image-card"
            @finish="aboutBgUploadFinish"
            @error="aboutBgUploadError"
            :default-file-list="aboutBgImage"
            name="aboutBgImages"
            :max="1"
            :data="{
              _id: formValue._id,
            }"
            :headers="{
              Authorization: `Bearer ${userInfoStore.data.token}`,
            }"
          />
        </n-form-item>
        <n-form-item label="上传背景音乐">
          <n-upload
            action="/api/upload-about-audio"
            name="aboutAudio"
            :default-file-list="adiuoList"
            list-type="image"
            :data="{
              _id: formValue._id,
            }"
            :headers="{
              Authorization: `Bearer ${userInfoStore.data.token}`,
            }"
            :max="1"
          >
            <n-button>上传音频</n-button>
          </n-upload>
        </n-form-item>
        <n-form-item v-for="(item, index) in formValue.modules" :key="index">
          <template #label>
            <span class="module-title"
              >模块{{ index + 1 }}
              <n-popconfirm @positive-click="deleteItem(index)">
                <template #trigger>
                  <img src="@/assets/images/DeleteHover.svg" alt="delete" />
                </template>
                确认删除？删除后数据将无法恢复
              </n-popconfirm>
            </span>
          </template>
          <div class="module-input-box">
            <n-input
              v-model:value="item.title"
              placeholder="请输入标题..."
              maxlength="20"
              show-count
              clearable
            />
            <n-input
              v-model:value="item.content"
              type="textarea"
              placeholder="请输入内容..."
              show-count
              clearable
              :autosize="{ minRows: 5, maxRows: 20 }"
            />
            <n-upload
              v-model:file-list="formValue.modules[index].tempFile"
              :max="3"
              list-type="image-card"
              name="files"
              :headers="{
                Authorization: `Bearer ${userInfoStore.data.token}`,
              }"
            ></n-upload>
          </div>
        </n-form-item>
        <n-form-item class="banner-submit-btn-box">
          <n-space vertical>
            <n-button type="info" strong secondary @click="addItem">
              <img style="width: 16px" src="@/assets/images/Add.svg" alt="添加模块" />
              添加模块
            </n-button>
            <n-button type="info" @click="handleValidateClick"> 应用 </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </div>
    <div class="preview-box">
      <div
        :class="formValue?.cover ? 'preview-content-box preview-has-bg' : 'preview-content-box'"
        :style="formValue?.cover ? { backgroundImage: `url(${formValue?.cover})` } : {}"
      >
        <div class="avatar-box">
          <img :src="userInfoStore.data.user.avatar" alt="avatar" />
        </div>
        <h3 class="user-name-title">{{ userInfoStore.data.user.userName }}</h3>
        <span class="introduction-text">{{ formValue.intro }}</span>
        <n-space>
          <n-tag v-for="(item, idx) in previewTags" :key="idx" :bordered="false">
            {{ item }}
          </n-tag>
        </n-space>
        <n-space vertical>
          <div class="preview-module-box" v-for="(item, idx) in formValue.modules" :key="idx">
            <h3>{{ item.title }}</h3>
            <p>{{ item.content }}</p>
          </div>
        </n-space>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInst, UploadFileInfo } from 'naive-ui'
import { useUserInfoStore } from '@/stores/userInfo'
import { getAboutConfigApi, upsertAboutApi } from '@/http/about'
import { useMessage } from 'naive-ui'

const formRef = ref<FormInst | null>(null)
const userInfoStore = useUserInfoStore()
const message = useMessage()
interface modulesType {
  title: string
  content: string
  image: string[]
  tempFile: UploadFileInfo[]
}
interface formType {
  _id: string
  uId: string
  email: string
  intro: string
  tags: string
  modules: modulesType[]
  cover: string
  audio: string
}
const formValue: formType = reactive({
  _id: '',
  uId: '',
  email: '',
  intro: '',
  tags: '',
  modules: [{ title: '', content: '', image: [], tempFile: [] }],
  cover: '',
  audio: '',
})
const aboutBgImage = reactive([
  {
    id: 'aboutBgImages',
    name: 'aboutBgImages',
    url: '',
    status: 'finished',
  },
])
const adiuoList = reactive([
  {
    id: 'aboutAudio',
    name: 'aboutAudio',
    url: '',
    status: 'finished',
  },
])
const addItem = () => {
  formValue.modules.push({ title: '', content: '', image: [], tempFile: [] })
}
const deleteItem = (idx: number) => {
  formValue.modules.splice(idx, 1)
}
// 应用更新
const handleValidateClick = () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const response = await upsertAboutApi(formValue)
      const res = response.data
      if (res.code === 200) {
        message.success(res.message)
      } else {
        message.error(res.message)
      }
    } else {
      message.error('请检查输入合法性')
    }
  })
}
const previewTags = computed(() => {
  return formValue.tags ? formValue.tags.split(' ') : []
})

// 背景图上传成功
const aboutBgUploadFinish = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
  if(event != undefined){
    const res = (event.target as XMLHttpRequest).response
    message.success(JSON.parse(res).message)
    const newAvatar = JSON.parse(res).url
    formValue.cover = newAvatar
    return file
  }
}

// 背景图上传失败
const aboutBgUploadError = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
  if(event != undefined){
    const res = (event.target as XMLHttpRequest).response
    message.error(JSON.parse(res).message)
    return file
  }
}

// 获取About页面的配置
const getAboutConfig = async () => {
  const params = {
    email: userInfoStore.data.user.email,
    uId: userInfoStore.data.user._id,
  }
  const response = await getAboutConfigApi(params)
  const res = response.data
  if (res.code === 200) {
    formValue._id = res.data._id
    formValue.uId = userInfoStore.data.user._id
    formValue.email = userInfoStore.data.user.email
    formValue.intro = res.data.intro
    formValue.tags = res.data.tags
    formValue.cover = res.data.cover
    formValue.audio = res.data.audio
    aboutBgImage[0].url = formValue.cover
    formValue.modules = res.data.modules
  } else {
    message.error(res.message)
  }
}

onMounted(() => {
  getAboutConfig()
})
</script>

<style scoped lang="scss">
.about-set-main-box {
  display: flex;
  padding: 20px 10px;
  gap: 24px;
  height: auto;
  background-color: #2e33380d;
  border-radius: 8px;
  .about-content-box {
    flex: 0.5;
    min-height: 500px;
    .about-form-box {
      display: flex;
      flex-direction: column;
      :deep(.n-form-item) {
        width: 100%;
        .n-form-item-label__text {
          font-size: 14px;
          font-weight: bold;
          color: #525c75;
        }
        .n-form-item-blank {
          > div {
            width: 100%;
          }
        }
      }
      .banner-submit-btn-box {
        > div {
          width: 100%;
          .n-button {
            width: 100%;
          }
        }
      }
      .module-title {
        display: flex;
        align-items: center;
        line-height: 16px;
        img {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }
      }
      .module-input-box {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        .n-input {
          width: 100%;
        }
      }
    }
  }
  .preview-box {
    flex: 0.5;
    height: 700px;
    min-height: 700px;
    .preview-has-bg {
      background-repeat: no-repeat;
      background-size: cover; // 不裁剪图片，完整显示
      background-position: center center; // 居中显示
    }
    .preview-content-box {
      padding: 20px 10px;
      width: calc(100% - 20px);
      min-height: 500px;
      max-height: 800px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 8px;
      box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
      gap: 24px;
      @include g.scrollbarCustom;
      .avatar-box {
        width: 108px;
        height: 108px;
        min-height: 108px;
        min-width: 108px;
        border-radius: 50%;
        border: 2px solid #fff;
        box-sizing: content-box;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .user-name-title {
        font-size: 24px;
        font-weight: 600;
        color: #1e2025;
      }
      .introduction-text {
        color: #1e2025b8;
        font-size: 14px;
        text-align: center;
      }
      .n-tag {
        font-size: 12px;
        line-height: 28px;
        padding: 0 12px;
        color: #1e2025;
        background-color: #1e202514;
        border-radius: 14px;
      }
      .preview-module-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        h3 {
          font-size: 20px;
          color: #1e2025;
          font-weight: 600;
          padding-bottom: 4px;
          padding-top: 12px;
        }
        p {
          text-align: center;
          font-size: 14px;
          color: #1e2025b8;
          overflow: hidden;
          width: 680px;
          word-wrap: break-word;
          line-height: 20px;
          padding: 8px 0;
        }
      }
    }
  }
}
</style>
