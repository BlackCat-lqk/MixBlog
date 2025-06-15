<template>
  <div class="about-set-main-box">
    <div class="about-content-box">
      <n-form ref="formRef" inline :label-width="80" :model="formValue" class="about-form-box">
        <n-form-item label="一句话介绍自己">
          <n-input v-model:value="formValue.intro" placeholder="请输入..." />
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
              _id: userInfoStore.data.user._id,
            }"
            :headers="{
              Authorization: `Bearer ${userInfoStore.data.token}`,
            }"
          />
        </n-form-item>
        <n-form-item
          v-for="(item, index) in formValue.modules"
          :key="index"
          :label="`模块${index + 1}`"
        >
          <template #label>
            <span class="module-title"
              >模块{{ index + 1 }} <img src="@/assets/images/Delete.svg" @click="deleteItem(index)"
            /></span>
          </template>
          <div class="module-input-box">
            <n-input v-model:value="item.title" placeholder="请输入标题..." />
            <n-input v-model:value="item.content" type="textarea" placeholder="请输入内容..." />
          </div>
        </n-form-item>
        <n-form-item>
          <n-space vertical>
            <n-button type="success" @click="addItem">
              <img style="width: 16px" src="@/assets/images/Add.svg" />添加模块
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
          <img :src="userInfoStore.data.user.avatar" />
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
import { reactive, ref, computed, onMounted } from 'vue'
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
  image: string
}
interface formType {
  uId: string
  email: string
  intro: string
  tags: string
  modules: modulesType[]
  cover: string
}
const formValue: formType = reactive({
  uId: '',
  email: '',
  intro: '',
  tags: '',
  modules: [{ title: '', content: '', image: '' }],
  cover: '',
})
const aboutBgImage = reactive([
  {
    id: 'aboutBgImages',
    name: 'aboutBgImages',
    url: '',
    status: 'finished',
  },
])
const addItem = () => {
  formValue.modules.push({ title: '', content: '', image: '' })
}
const deleteItem = (idx: number) => {
  formValue.modules.splice(idx, 1)
}
const handleValidateClick = () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const response = await upsertAboutApi(formValue)
      const res = response.data
      if (res.code === 200) {
        console.log(res)
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
  const res = (event?.target as XMLHttpRequest).response
  message.success(JSON.parse(res).message)
  const newAvatar = JSON.parse(res).url
  formValue.cover = newAvatar
  return file
}

// 背景图上传失败
const aboutBgUploadError = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
  const res = (event?.target as XMLHttpRequest).response
  message.error(JSON.parse(res).message)
  return file
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
    formValue.uId = res.data.uId
    formValue.email = res.data.email
    formValue.intro = res.data.intro
    formValue.tags = res.data.tags
    formValue.cover = res.data.cover
    aboutBgImage[0].url = formValue.cover
    formValue.modules = res.data.modules
    console.log(formValue)
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
      .module-title {
        display: flex;
        align-items: center;
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
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 8px;
      // background-color: #f4f2ec;
      box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
      gap: 24px;
      .avatar-box {
        width: 108px;
        height: 108px;
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
