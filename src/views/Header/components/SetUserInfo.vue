<template>
  <div class="personal-info-box" ref="personalInfoBox"></div>
  <n-modal v-model:show="state.showModal" :to="personalInfoBox" :mask-closable="false">
    <n-card
      style="width: 600px"
      :title="$t('header.personSet.title')"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <div>
        <n-form ref="editFormRef" inline :model="editFormValue" :rules="rules">
          <n-form-item
            :span="12"
            style="width: 100%"
            :label="$t('header.personSet.email')"
            path="email"
          >
            <n-input v-model:value="editFormValue.email" disabled />
          </n-form-item>
          <n-form-item style="width: 100%" :label="$t('header.personSet.avatar')">
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
          <n-form-item
            style="width: 100%"
            :span="12"
            :label="$t('header.personSet.username')"
            path="userName"
          >
            <n-input
              v-model:value="editFormValue.userName"
              :placeholder="$t('header.personSet.usernamePlaceholder')"
            />
          </n-form-item>
          <n-form-item style="width: 100%" :span="12" :label="$t('header.personSet.intro')">
            <n-input
              type="textarea"
              rows="4"
              v-model:value="editFormValue.desc"
              :placeholder="$t('header.personSet.introPlaceholder')"
            />
          </n-form-item>
          <n-form-item style="width: 100%" :span="12" :label="$t('header.personSet.sex')">
            <n-space>
              <n-radio :checked="editFormValue.sex === '男'" value="男" @change="handleChangeSex">
                {{ t('header.personSet.sexOption') }}
              </n-radio>
              <n-radio :checked="editFormValue.sex === '女'" value="女" @change="handleChangeSex">
                {{ t('header.personSet.sexOption1') }}
              </n-radio>
              <n-radio
                :checked="editFormValue.sex === '保密'"
                value="保密"
                @change="handleChangeSex"
              >
                {{ t('header.personSet.sexOption2') }}
              </n-radio>
            </n-space>
          </n-form-item>
          <n-form-item style="width: 100%" :span="12" :label="$t('header.personSet.birthday')">
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
          <n-button @click="cancelUpdate">{{ t('header.personSet.cancelBtn') }}</n-button>
          <n-button type="info" @click="confirmUpdate">{{
            t('header.personSet.saveBtn')
          }}</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import type { FormInst, UploadFileInfo } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { useUserInfoStore } from '@/stores/userInfo'
import { validateEmail, validateUsername } from '@/utils/validate'
import { updateUsers } from '@/http/user'
import cloneDeep from 'lodash/cloneDeep'
import type { SetUserInfoEditFormType as editFormType } from '@/tsInterface'
const { t } = useI18n()

const personalInfoBox = ref(null)
const editFormRef = ref<FormInst | null>(null)
const userInfoStore = useUserInfoStore()
const defaultFileList = ref([] as object[])
const message = useMessage()
const emits = defineEmits(['update:show'])
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})
watch(
  () => props.show,
  (newVal) => {
    state.showModal = newVal
  },
)
const state = reactive({
  showModal: false,
})

// 表单
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
// 选择性别
const handleChangeSex = (e: Event) => {
  editFormValue.sex = (e.target as HTMLInputElement).value
}

// 初始化表单
const initEditForm = () => {
  Object.assign(editFormValue, cloneDeep(userInfoStore.data.user))
  defaultFileList.value = [
    {
      id: 'default',
      name: 'avatar',
      url: userInfoStore.data.user.avatar,
      status: 'finished',
    },
  ]
}

// avatar上传成功后将头像地址替换掉
const avatarUploadFinish = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
  if (event != undefined) {
    const res = (event.target as XMLHttpRequest).response
    message.success(JSON.parse(res).message)
    const newAvatar = JSON.parse(res).url
    userInfoStore.setUserAvatar(newAvatar)
    return file
  }
}

// 上传失败
const avatarUploadError = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
  if (event != undefined) {
    const res = (event.target as XMLHttpRequest).response
    message.error(JSON.parse(res).message)
    return file
  }
}

// 取消应用
const cancelUpdate = () => {
  state.showModal = false
  emits('update:show')
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
    emits('update:show')
    message.success(res.message)
  } else {
    message.error(res.message)
  }
}
onMounted(() => {
  initEditForm()
})
</script>

<style lang="scss" scoped>
.personal-info-box {
  display: flex;
  gap: 24px;
  // margin-bottom: 24px;
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
