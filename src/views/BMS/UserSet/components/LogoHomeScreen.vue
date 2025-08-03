<template>
  <div class="logo-home-screen-box">
    <div class="form-box">
      <n-form ref="formRef" inline :label-width="80" :model="formValue">
        <n-form-item label="上传logo">
          <div class="logo-from-box">
            <n-upload
              action="/api/upload-slogan-logo"
              list-type="image-card"
              @finish="logoUploadFinish"
              @error="logoUploadError"
              :default-file-list="logoImage"
              name="sloganLogo"
              :max="1"
              :data="{
                _id: userInfoStore.data.user._id,
              }"
              :headers="{
                Authorization: `Bearer ${userInfoStore.data.token}`,
              }"
            />
          </div>
        </n-form-item>
        <div>
          <n-space vertical>
            <n-form-item label="logo名">
              <n-input
                v-model:value="formValue.logoName"
                maxlength="8"
                clearable
                show-count
                type="text"
                placeholder="请输入名称"
              />
            </n-form-item>
            <n-form-item label="slogan">
              <div class="slogan-input-box">
                <n-input
                  v-model:value="formValue.sloganTitle"
                  type="text"
                  clearable
                  placeholder="请输入标题"
                  maxlength="8"
                  show-count
                />
                <n-input
                  v-model:value="formValue.sloganSub1"
                  type="text"
                  clearable
                  placeholder="请输入副文本1"
                  maxlength="8"
                  show-count
                />
                <n-input
                  v-model:value="formValue.sloganSub2"
                  type="text"
                  clearable
                  placeholder="请输入副文本2"
                  maxlength="8"
                  show-count
                />
              </div>
            </n-form-item>
          </n-space>
        </div>
        <div class="cover-box">
          <n-form-item label="上传图片">
            <div>
              <n-upload
                action="/api/upload-slogan-cover"
                list-type="image-card"
                @finish="coverUploadFinish"
                @error="coverUploadError"
                :default-file-list="coverImage"
                :max="1"
                name="sloganCover"
                :data="{
                  _id: userInfoStore.data.user._id,
                }"
                :headers="{
                  Authorization: `Bearer ${userInfoStore.data.token}`,
                }"
              />
            </div>
          </n-form-item>
        </div>
        <n-button type="info" @click="updateSlogan">应用</n-button>
      </n-form>
    </div>

    <div class="preview-box">
      <div class="logo-text-box">
        <n-image
          alt="logo text"
          width="40"
          height="40"
          :src="
            formValue?.logoPicture
              ? formValue?.logoPicture
              : '/uploads/defalut/logo-transparent.webp'
          "
          :previewed-img-props="{ style: { border: '8px solid white' } }"
        />
        <span>{{ formValue.logoName }}</span>
      </div>
      <div class="slogan-text-box">
        <div class="content-img-box">
          <img
            :src="formValue?.cover ? formValue?.cover : '/uploads/defalut/logo2024.svg'"
            alt="cover"
          />
        </div>
        <div>
          <h3>
            <n-gradient-text type="info">{{ formValue.sloganTitle }}</n-gradient-text>
          </h3>
          <h4>
            <n-gradient-text type="danger">{{ formValue.sloganSub1 }}</n-gradient-text>
          </h4>
          <h4>
            <n-gradient-text type="warning">{{ formValue.sloganSub2 }}</n-gradient-text>
          </h4>
          <div class="insert-box">......</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInst, UploadFileInfo } from 'naive-ui'
import { useUserInfoStore } from '@/stores/userInfo'
import { getSloganApi, upsertSloganApi } from '@/http/slogan'
import { useMessage } from 'naive-ui'
import { _debounce } from '@/utils/publickFun'
const message = useMessage()
const userInfoStore = useUserInfoStore()
const coverImage = reactive([
  {
    id: 'sloganCover',
    name: 'sloganCover',
    url: '',
    status: 'finished',
  },
])
const logoImage = reactive([
  {
    id: 'sloganLogo',
    name: 'sloganLogo',
    url: '',
    status: 'finished',
  },
])
const formRef = ref<FormInst | null>(null)

interface formType {
  logoPicture: string
  logoName: string
  sloganTitle: string
  sloganSub1: string
  sloganSub2: string
  cover: string
}
const formValue: formType = reactive({
  logoPicture: '',
  logoName: '',
  sloganTitle: '',
  sloganSub1: '',
  sloganSub2: '',
  cover: '',
})

// cover上传成功
const coverUploadFinish = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
  const res = (event?.target as XMLHttpRequest).response
  message.success(JSON.parse(res).message)
  const newAvatar = JSON.parse(res).url
  formValue.cover = newAvatar
  return file
}

// cover上传失败
const coverUploadError = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
  const res = (event?.target as XMLHttpRequest).response
  message.error(JSON.parse(res).message)
  return file
}

// logo上传成功
const logoUploadFinish = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
  const res = (event?.target as XMLHttpRequest).response
  message.success(JSON.parse(res).message)
  const newAvatar = JSON.parse(res).url
  formValue.logoPicture = newAvatar
  return file
}

// logo上传失败
const logoUploadError = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
  const res = (event?.target as XMLHttpRequest).response
  message.error(JSON.parse(res).message)
  return file
}

// 获取slogan配置信息
const getSloganConfig = async () => {
  const response = await getSloganApi()
  const res = response.data
  if (res.code == 200) {
    formValue.logoPicture = res.data.logoPicture
    logoImage[0].url = formValue.logoPicture
    formValue.logoName = res.data.logoName
    formValue.sloganTitle = res.data.sloganTitle
    formValue.sloganSub1 = res.data.sloganSub1
    formValue.sloganSub2 = res.data.sloganSub2
    formValue.cover = res.data.cover
    coverImage[0].url = formValue.cover
  } else {
    message.error(res.message)
  }
}

// 应用配置
const updateSlogan = _debounce(async () => {
  const response = await upsertSloganApi(formValue)
  const res = response.data
  if (res.code == 200) {
    message.success('更新成功')
  } else {
    message.error(res.message)
  }
}, 300)

onMounted(() => {
  getSloganConfig()
})
</script>

<style scoped lang="scss">
.logo-home-screen-box {
  display: flex;
  gap: 24px;
  background-color: #2e33380d;
  padding: 20px 10px;
  border-radius: 8px;
  margin-bottom: 24px;
  .form-box {
    flex: 0.5;
    .n-form {
      display: flex;
      flex-direction: column;
      .slogan-input-box {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    }
  }
  .preview-box {
    flex: 0.5;
    position: relative;
    border-radius: 8px;
    background-color: #f4f2ec;
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
    .logo-text-box {
      width: calc(100% - 20px);
      padding: 10px;
      background-color: #fff;
      position: absolute;
      border-radius: 8px 8px 0 0;
      top: 0%;
      display: flex;
      align-items: center;
      span {
        padding-left: 10px;
        font-size: 16px;
        font-weight: 600;
      }
    }
    .slogan-text-box {
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0%);
      top: 20%;
      display: flex;
      gap: 12px;
      .content-img-box {
        width: 300px;
        height: 300px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      h3 {
        font-size: 48px;
        font-weight: 600;
        line-height: 1.34;
        padding: 20px 0;
      }
      h4 {
        font-size: 36px;
        font-weight: 400;
        line-height: 1.34;
      }
      .insert-box {
        max-width: 300px;
        width: 300px;
        height: 100px;
        border-radius: 8px;
        background-color: #01162b0d;
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        color: #fff;
        font-weight: bold;
      }
    }
  }
}
</style>
