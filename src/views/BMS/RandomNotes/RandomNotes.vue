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
        <header-detail :data="headerData"></header-detail>
        <div class="list-notes-box">
          <div class="published-box">
            <div v-for="(item, idx) in notesData" :key="idx" class="published-content">
              <div class="title-box">
                <div class="title-box-left">
                  <h3>{{ item.title }}</h3>
                  <img :src="weatherIconsURLs[item.weather]" alt="weather" />
                </div>
                <div>
                  <n-button
                    strong
                    secondary
                    round
                    type="error"
                    class="delete-btn"
                    @click="deleteNoteBtn(item._id)"
                  >
                    <img src="@/assets/images/Delete.svg" alt="delete notes" />
                  </n-button>
                  <n-button
                    strong
                    secondary
                    round
                    type="info"
                    class="edit-btn"
                    @click="handleEditNote(item._id)"
                  >
                    <img src="@/assets/images/Edit.svg" alt="edit notes" />
                  </n-button>
                </div>
              </div>
              <span class="note-update-time">{{ _formatTime(item.updatedAt).time }}</span>
              <p class="note-content-detail-box">{{ item.content }}</p>
              <div class="content-img-box"><img :src="item.cover" alt="cover" /></div>
            </div>
          </div>
          <div class="edit-release-box">
            <n-form ref="formRef" inline :label-width="80" :model="createForm" :rules="rules">
              <div style="width: 100%">
                <div class="title-box">
                  <h3>新建随笔随记</h3>
                  <div class="title-btn-box">
                    <n-button strong secondary @click="clearClick">重置</n-button>
                    <n-button type="info" @click="createValidateClick">发布</n-button>
                  </div>
                </div>
                <div class="note-title-box">
                  <n-form-item path="title">
                    <n-input
                      v-model:value="createForm.title"
                      type="text"
                      maxlength="200"
                      show-count
                      clearable
                      placeholder="请输入标题"
                    />
                    <n-popover trigger="hover">
                      <template #trigger>
                        <img :src="initWeather" alt="weather" />
                      </template>
                      <div style="padding: 20px">
                        <n-grid :x-gap="24" :y-gap="24" :cols="4">
                          <n-grid-item v-for="(item, idx) in weatherIconData" :key="idx">
                            <img
                              :src="weatherIconsURLs[item]"
                              style="cursor: pointer"
                              @click="changeWeatherIcon(item)"
                              alt="weather"
                            />
                          </n-grid-item>
                        </n-grid>
                      </div>
                    </n-popover>
                  </n-form-item>
                </div>
                <div class="note-content-box">
                  <n-form-item path="content">
                    <n-input
                      v-model:value="createForm.content"
                      type="textarea"
                      maxlength="9999"
                      show-count
                      clearable
                      placeholder="请输入内容"
                      :autosize="{
                        minRows: 10,
                        maxRows: 30,
                      }"
                    />
                  </n-form-item>
                </div>
              </div>
              <n-divider />
              <div class="note-img-box">
                <n-form-item>
                  <n-upload
                    :default-file-list="newFileImgageList"
                    :max="1"
                    list-type="image-card"
                    :custom-request="createCustomUpload"
                    :finish="createUploadFinish"
                    :error="createUploadError"
                    :headers="{
                      Authorization: `Bearer ${userInfoStore.data.token}`,
                    }"
                  ></n-upload>
                </n-form-item>
              </div>
            </n-form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <n-modal v-model:show="showDeleteModal">
    <n-card style="width: 600px" title="确认删除？" size="huge" role="dialog" aria-modal="true">
      <div class="title-btn-box" style="display: flex; justify-content: flex-end; gap: 20px">
        <n-button strong secondary @click="showDeleteModal = false">取消</n-button>
        <n-button type="error" @click="handleDeleteNote">删除</n-button>
      </div>
    </n-card>
  </n-modal>
  <EditNote v-model:showEdit="showEditModal" :data="notesEditData"></EditNote>
</template>

<script setup lang="ts">
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import HeaderDetail from '@/views/BMS/components/HeaderDetail.vue'
import type { FormInst, UploadFileInfo } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { useUserInfoStore } from '@/stores/userInfo'
import { createNotesApi, getNotesApi, uploadNoteImageApi, delteNoteApi } from '@/http/notes'
import { _formatTime } from '@/utils/publickFun'
import EditNote from './EditRandomNotes.vue'

const message = useMessage()
const userInfoStore = useUserInfoStore()
const showDeleteModal = ref(false)
const formRef = ref<FormInst | null>(null)
interface NoteItem {
  _id: string
  title: string
  content: string
  updatedAt: string
  weather: string
  cover: string
}
type notesDataType = NoteItem[]
const notesData = ref<notesDataType>([])
interface createFormType {
  uid: string
  email: string
  title: string
  content: string
  tempFile: UploadFileInfo | null
  cover: string
  weather: string
}

interface WeatherIcons {
  [key: string]: string
}

const weatherIconData = [
  'cloudy',
  'overcast',
  'pour',
  'rain',
  'snow',
  'sun',
  'thunderstorm',
  'wind',
]
const weatherIconsURLs: WeatherIcons = {
  cloudy: new URL('@/assets/images/Weather/cloudy.svg', import.meta.url).href,
  overcast: new URL('@/assets/images/Weather/overcast.svg', import.meta.url).href,
  pour: new URL('@/assets/images/Weather/pour.svg', import.meta.url).href,
  rain: new URL('@/assets/images/Weather/rain.svg', import.meta.url).href,
  snow: new URL('@/assets/images/Weather/snow.svg', import.meta.url).href,
  sun: new URL('@/assets/images/Weather/sun.svg', import.meta.url).href,
  thunderstorm: new URL('@/assets/images/Weather/thunderstorm.svg', import.meta.url).href,
  wind: new URL('@/assets/images/Weather/wind.svg', import.meta.url).href,
}
const rules = {
  title: [
    {
      required: true,
      message: '请输入标题',
      trigger: 'blur',
    },
  ],
  content: [
    {
      required: true,
      message: '请输入内容',
      trigger: 'blur',
    },
  ],
  weather: [
    {
      required: true,
      message: '请选择天气',
      trigger: 'change',
    },
  ],
  tempFile: [
    {
      required: false,
      message: '请上传图片',
      trigger: 'blur',
    },
  ],
}

const newFileImgageList = reactive([
  {
    id: 'createFile',
    name: 'createFile',
    url: '',
    status: 'finished',
  },
])

const createForm: createFormType = reactive({
  uid: '',
  email: '',
  title: '',
  content: '',
  tempFile: null,
  cover: '',
  weather: '',
})
const headerData = reactive({
  title: '随笔随记',
  url: '',
})

const currentWeather = ref('sun')
// 切换天气图标
const changeWeatherIcon = (val: string) => {
  currentWeather.value = val
}

const initWeather = computed(() => {
  return weatherIconsURLs[currentWeather.value]
})

// 自定义上传函数（不实际上传）
const createCustomUpload = ({ file }: { file: UploadFileInfo }) => {
  createForm.tempFile = file
}
// 上传完成后的回调（手动设置 url）
const createUploadFinish = () => {
  message.success('文件已选择')
}

const createUploadError = () => {
  message.error('文件选择失败')
}
// 删除Note
const deleteNoteId = ref('')
const deleteNoteBtn = (val: string) => {
  showDeleteModal.value = true
  deleteNoteId.value = val
}
const handleDeleteNote = async () => {
  const response = await delteNoteApi({ _id: deleteNoteId.value })
  const res = response.data
  if (res.code === 200) {
    message.success(res.message)
    notesData.value = notesData.value.filter((item) => item._id !== deleteNoteId.value)
  } else {
    message.error(res.message)
  }
  showDeleteModal.value = false
}

// 编辑Note
const showEditModal = ref(false)
const notesEditData = ref<NoteItem[]>([])
const handleEditNote = async (val: string) => {
  showEditModal.value = true
  const data = notesData.value.find((item) => item._id === val)
  notesEditData.value = data ? [data] : []
}

// 清空内容
const clearClick = () => {
  formRef.value?.restoreValidation()
  newFileImgageList[0].url = ''
  createForm.tempFile = null
  createForm.title = ''
  createForm.content = ''
  createForm.cover = ''
  currentWeather.value = 'sun'
}
// 文件上传
const uploadFile = async (id: string) => {
  if (createForm.tempFile && createForm.tempFile.file) {
    const formData = new FormData()
    formData.append('noteImages', createForm.tempFile?.file)
    formData.append('_id', id)
    try {
      const response = await uploadNoteImageApi(formData)
      const res = response.data
      if (res.code === 200) {
        createForm.cover = res.data.url
        message.success(res.message)
        return true
      } else {
        message.error(res.message)
        return false
      }
    } catch (err) {
      message.error('图片上传失败，请重试')
      console.error(err)
      return false
    }
  } else {
    return true
  }
}
// 发布校验提交
const createValidateClick = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      createForm.uid = userInfoStore.data.user._id
      createForm.email = userInfoStore.data.user.email
      createForm.weather = currentWeather.value
      const response = await createNotesApi(createForm) // 创建Note数据
      const res = response.data
      if (res.code === 200) {
        // 是否本地选择了图片文件
        if (createForm.tempFile) {
          const isUpload = await uploadFile(res.data._id)
          if (isUpload) {
            getNotesData()
            message.success('更新成功')
          } else {
            message.error('更新失败')
          }
        } else {
          getNotesData()
          message.success('更新成功')
        }

        message.success(res.message)
      } else {
        message.error(res.message)
      }
    } else {
      console.log(errors)
      message.error('确少必填项')
    }
  })
}
const getNotesData = async () => {
  const params = {
    title: '',
    weather: '',
  }
  const response = await getNotesApi(params)
  const res = response.data
  if (res.code === 200) {
    notesData.value = res.data
  } else {
    message.error(res.message)
  }
}
onMounted(() => {
  getNotesData()
})
</script>

<style lang="scss" scoped>
@include g.bms;

.main-router-box {
  padding: 10px;
  gap: 12px;

  .list-notes-box {
    display: flex;
    padding-top: 20px;
    max-height: 84vh;
    height: 90vh;
    gap: 24px;

    .published-box {
      flex: 1;
      min-width: 320px;
      max-height: 100%;
      @include g.scrollbarCustom;
      overflow-y: auto;
      box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
      background-color: #2e33380d;
      padding: 20px;
      border-radius: 8px;

      .published-content {
        height: auto;
        min-height: 180px;
        background-color: rgba(22, 117, 211, 0.1);
        margin-bottom: 20px;
        padding: 20px;
        display: flex;
        border-radius: 10px;
        flex-direction: column;
        .title-box {
          display: flex;
          justify-content: space-between;

          .title-box-left {
            display: flex;
            align-items: center;
            h3 {
              font-size: 20px;
              font-weight: 600;
              line-height: 1.54;
            }
            img {
              width: 24px;
              height: 24px;
              margin-left: 10px;
            }
          }

          .delete-btn,
          .edit-btn {
            margin-left: 10px;
            img {
              width: 16px;
              height: 16px;
            }
          }
        }
        .note-update-time {
          font-size: 14px;
          line-height: 1.54;
          color: var(--text-color);
        }
        .note-content-detail-box {
          margin-top: 16px;
          font-size: 14px;
          line-height: 1.54;
          font-weight: 400;
          color: var(--text-color);
        }

        .content-img-box {
          margin-top: 16px;
          img {
            width: 84px;
            height: 84px;
            border-radius: 4px;
          }
        }
      }

      .published-content:last-child {
        margin-bottom: 0;
      }
    }

    .edit-release-box {
      width: 480px;
      min-width: 440px;
      border-radius: 8px;
      box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
      background-color: rgba(22, 117, 211, 0.1);
      padding: 20px;

      .n-form {
        display: flex;
        flex-direction: column;
        width: 100%;
        justify-content: space-between;
        height: 100%;
        .title-box {
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;

          .title-btn-box {
            display: flex;
            gap: 10px;
          }
        }

        .note-title-box {
          width: 100%;

          img {
            margin-left: 10px;
            cursor: pointer;
          }
        }

        .note-content-box {
          width: 100%;
        }
      }
    }
  }
}
</style>
