<template>
  <div class="logo-home-screen-box">
    <div class="form-box">
      <n-form ref="formRef" inline :label-width="80" :model="formValue">
        <n-form-item label="上传logo">
          <div class="logo-from-box">
            <n-upload
              action="http://localhost:3000/api/upload-avatar"
              list-type="image-card"
              @on-finish="avatarUploadFinish"
              @on-error="avatarUploadError"
              :default-file-list="defaultFileList"
              name="avatar"
              :data="{
                _id: userInfoStore.data.user._id,
              }"
              :headers="{
                Authorization: `Bearer ${userInfoStore.data.token}`
              }"
            />

          </div>
        </n-form-item>
        <div>
          <n-space vertical>
            <n-form-item label="名称">
              <n-input v-model:value="formValue.name" type="text" placeholder="请输入名称" />
            </n-form-item>
            <n-form-item label="slogan">
              <n-input v-model:value="formValue.slogan" type="text" placeholder="请输入副文本" />
            </n-form-item>
          </n-space>
        </div>
        <div class="cover-box">
          <n-form-item label="上传封面">
            <n-upload
              action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
              list-type="image-card"
            />
          </n-form-item>
        </div>
        <n-button type="info">应用</n-button>
      </n-form>
    </div>

    <div class="preview-box">
      <div class="logo-text-box">
        <n-image
          width="40"
          circle
          src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          :previewed-img-props="{ style: { border: '8px solid white' } }"
        />
        <span>logo文本</span>
      </div>
      <div class="slogan-text-box">
        <h3>Logo文本</h3>
        <h4>慢下脚步...</h4>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInst, UploadFileInfo } from 'naive-ui'
import { ref, reactive } from 'vue'
import { useUserInfoStore } from '@/stores/userInfo'

const userInfoStore = useUserInfoStore()
const formRef = ref<FormInst | null>(null)
const formValue = reactive({
  logoPicture: '',
  name: '',
  slogan: '',
  cover: '',
})
const defaultFileList = ref([])

// logo上传成功后将头像地址替换掉
const avatarUploadFinish = (file: UploadFileInfo) => {

  console.log(file)
}
const avatarUploadError = (file: UploadFileInfo) => {
  console.log(file)
}
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
    }
  }
  .preview-box {
    flex: 0.5;
    background: url(@/assets/wallpaper/regist-login.jpg);
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    border-radius: 8px;
    .logo-text-box {
      position: absolute;
      left: 3%;
      top: 5%;
      display: flex;
      align-items: center;
      .n-image {
        border-radius: 50%;
      }
      span {
        padding-left: 10px;
        font-size: 16px;
        font-weight: 600;
      }
    }
    .slogan-text-box {
      position: absolute;
      left: 10%;
      top: 40%;
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
    }
  }
}
</style>
