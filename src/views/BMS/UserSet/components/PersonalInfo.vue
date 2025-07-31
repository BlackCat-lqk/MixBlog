<template>
  <div class="personal-info-box" ref="personalInfoBox">
    <div class="personal-box">
      <div class="personal-info">
        <div class="avatar-box">
          <n-image
            width="100"
            :src="userInfoStore.data.user.avatar"
            :previewed-img-props="{ style: { border: '8px solid white' } }"
          />
        </div>
        <div class="info-box">
          <span>{{ userInfoStore.data.user.userName }}</span>
          <span>{{ userInfoStore.data.user.email }}</span>
          <span>{{ userInfoStore.data.user.desc }}</span>
        </div>
      </div>
      <div class="btn-box">
        <n-modal-provider>
          <n-button type="info" @click="updateInfo">修改个人资料</n-button>
        </n-modal-provider>
        <n-button type="success" @click="router.push('/')">进入博客</n-button>
        <n-popover trigger="hover">
          <template #trigger>
            <div class="qrcode-box">
              <img src="@/assets/images/QrCode.svg" alt="QrCode" />
            </div>
          </template>
          <div>
            <n-qr-code value="https://cn.bing.com/" />
          </div>
        </n-popover>
      </div>
    </div>
  </div>
  <n-modal v-model:show="state.showModal" :to="personalInfoBox">
    <n-card
      style="width: 600px"
      title="个人资料设置"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <div>
        <n-form ref="editFormRef" inline :model="editFormValue" :rules="rules">
          <n-form-item :span="12" style="width: 100%" label="邮箱" path="email">
            <n-input v-model:value="editFormValue.email" disabled />
          </n-form-item>
          <n-form-item style="width: 100%" label="上传头像">
            <div class="logo-from-box">
              <n-upload
                action="/api/upload-avatar"
                list-type="image-card"
                @finish="avatarUploadFinish"
                @error="avatarUploadError"
                :default-file-list="defaultFileList"
                name="avatar"
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
          <n-form-item style="width: 100%" :span="12" label="用户名" path="userName">
            <n-input v-model:value="editFormValue.userName" placeholder="输入用户名" />
          </n-form-item>
          <n-form-item style="width: 100%" :span="12" label="个人简介">
            <n-input
              type="textarea"
              rows="4"
              v-model:value="editFormValue.desc"
              placeholder="输入个人简介"
            />
          </n-form-item>
          <n-form-item style="width: 100%" :span="12" label="性别">
            <n-space>
              <n-radio :checked="editFormValue.sex === '男'" value="男" @change="handleChangeSex">
                男
              </n-radio>
              <n-radio :checked="editFormValue.sex === '女'" value="女" @change="handleChangeSex">
                女
              </n-radio>
              <n-radio
                :checked="editFormValue.sex === '保密'"
                value="保密"
                @change="handleChangeSex"
              >
                保密
              </n-radio>
            </n-space>
          </n-form-item>
          <n-form-item style="width: 100%" :span="12" label="生日">
            <n-date-picker
              style="width: 100%"
              v-model:value="editFormValue.birthday"
              type="date"
              clearable
            />
          </n-form-item>
        </n-form>
      </div>
      <template #footer>
        <n-space style="display: flex; justify-content: flex-end">
          <n-button @click="cancelUpdate">取消</n-button>
          <n-button type="info" @click="confirmUpdate">应用</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import type { FormInst, UploadFileInfo } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { useUserInfoStore } from '@/stores/userInfo'
import { validateEmail, validateUsername } from '@/utils/validate'
import { updateUsers } from '@/http/user'
import _ from 'lodash'
import router from '@/router'

const editFormRef = ref<FormInst | null>(null)
const personalInfoBox = ref(null)
const userInfoStore = useUserInfoStore()
const defaultFileList = ref([] as object[])
const message = useMessage()
const state = reactive({
  showModal: false,
})
interface editFormType {
  _id: string
  userName: string
  email: string
  desc: string
  avatar: string
  sex: string
  birthday: null
}
const editFormValue: editFormType = reactive({
  _id: '',
  userName: '',
  email: '',
  desc: '',
  avatar: '',
  sex: '',
  birthday: null,
})
// 表单验证规则
const rules = {
  userName: {
    required: true,
    trigger: ['input', 'blur'],
    validator: validateUsername,
  },
  email: {
    required: true,
    trigger: ['input', 'blur'],
    validator: validateEmail,
  },
}
// avatar上传成功后将头像地址替换掉
const avatarUploadFinish = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
  const res = (event?.target as XMLHttpRequest).response
  message.success(JSON.parse(res).message)
  const newAvatar = JSON.parse(res).url
  userInfoStore.setUserAvatar(newAvatar)
  return file
}

// 上传失败
const avatarUploadError = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
  const res = (event?.target as XMLHttpRequest).response
  message.error(JSON.parse(res).message)
  return file
}
// 选择性别
const handleChangeSex = (e: Event) => {
  editFormValue.sex = (e.target as HTMLInputElement).value
}
const updateInfo = () => {
  state.showModal = true
  initEditForm()
}
// 初始化表单
const initEditForm = () => {
  Object.assign(editFormValue, _.cloneDeep(userInfoStore.data.user))
  defaultFileList.value = [
    {
      id: 'default',
      name: 'avatar',
      url: userInfoStore.data.user.avatar,
      status: 'finished',
    },
  ]
}
// 取消应用
const cancelUpdate = () => {
  state.showModal = false
  initEditForm()
}
// 确认应用
const confirmUpdate = async () => {
  const params = {
    birthday: editFormValue.birthday,
    email: editFormValue.email,
    desc: editFormValue.desc,
    sex: editFormValue.sex,
    updatedAt: new Date().toISOString(),
    userName: editFormValue.userName,
  }
  const response = await updateUsers(params.email, params)
  const res = response.data
  if (res.code === 200) {
    const updateUserInfo = {
      token: userInfoStore.data.token,
      user: res.data,
    }
    userInfoStore.setUserInfo(updateUserInfo)
    initEditForm()
    state.showModal = false
    message.success(res.message)
  } else {
    message.error(res.message)
  }
}
</script>

<style scoped lang="scss">
.personal-info-box {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  .personal-box {
    flex: 1;
    display: flex;
    justify-content: space-between;
    background-color: #2e33380d;
    padding: 10px;
    border-radius: 8px;
    .personal-info {
      display: flex;
      .avatar-box {
        margin-right: 18px;
        width: 100px;
        height: 100px;
        max-width: 100px;
        max-height: 100px;
        display: flex;
        align-items: center;
        .n-image {
          width: 100%;
          object-fit: cover;
        }
      }
      .info-box {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        span {
          font-size: 18px;
          font-weight: 600;
        }
      }
    }
    .btn-box {
      display: flex;
      align-items: center;
      .n-button {
        margin-left: 5px;
      }
      .qrcode-box {
        display: flex;
        align-items: center;
        padding: 6px;
        border-radius: 8px;
        background-color: aliceblue;
        border: 1px solid rgba(0, 0, 0, 0.1);
        margin-left: 10px;
        cursor: pointer;
        img {
          width: 24px;
          height: 24px;
        }
      }
    }
  }

  .spatial-box {
    flex: 0.3;
    display: flex;
    gap: 24px;
    flex-direction: column;
    background-color: #2e33380d;
    padding: 10px;
    border-radius: 8px;
  }
  :deep(.n-form) {
    display: flex;
    flex-direction: column;
  }
}
</style>
