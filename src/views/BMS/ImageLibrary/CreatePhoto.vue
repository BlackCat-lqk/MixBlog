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
        <n-form ref="formRef" :model="createForm" :rules="rules">
          <div class="header-option-box">
            <h3>新建摄影图库</h3>
            <div class="option-btn-box">
              <n-button strong secondary @click="cancleCreate">取消</n-button>
              <n-button strong type="info" @click="confirmPublish">发布</n-button>
            </div>
          </div>
          <div class="quill-editor-box">
            <div class="title-cover-introduc-box">
              <div class="title-cover-box">
                <div class="title-box">
                  <div class="title-input-box">
                    <n-form-item path="title">
                      <n-input placeholder="请输入标题" v-model:value="createForm.title" />
                    </n-form-item>
                  </div>
                  <div class="classify-tag-box">
                    <n-form-item path="category">
                      <n-select style="width: 240px;" v-model:value="createForm.category" :options="classifyOption"
                        placeholder="请选择分类">
                        <template #action>
                          <n-button type="info" style="width: 100%" strong secondary>
                            <img style="width: 16px" src="@/assets/images/Add.svg" />新增分类
                          </n-button>
                        </template>
                      </n-select>
                    </n-form-item>
                    <span>|</span>
                    <n-button secondary @click="insertTag"> 插入标签 </n-button>
                  </div>
                </div>
              </div>
              <div class="introduction-box">
                <n-form-item path="content">
                  <n-input v-model:value="createForm.content" :autosize="{
                    minRows: 8,
                    maxRows: 24,
                  }" type="textarea" placeholder="请输入内容..." show-count maxlength="800" />
                </n-form-item>
              </div>
              <div class="photos-box">
                <n-form-item label="上传照片（最多上传10张图片）" path="tempFile">
                  <n-upload :max="10" list-type="image-card" :custom-request="createCustomUpload"
                    :finish="createUploadFinish" :error="createUploadError" :headers="{
                      Authorization: `Bearer ${userInfoStore.data.token}`,
                    }"></n-upload>
                </n-form-item>
              </div>
            </div>
          </div>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import type { UploadFileInfo, FormInst, FormItemRule } from 'naive-ui'
import { reactive, ref } from 'vue'
import { useDialog, useMessage } from 'naive-ui'
import { useUserInfoStore } from '@/stores/userInfo'
import { useRouter } from 'vue-router'
import { createPhotoLibraryApi, uploadPhotoImageApi } from '@/http/photoLibrary'

const userInfoStore = useUserInfoStore()
const dialog = useDialog()
const message = useMessage()
const router = useRouter()
const formRef = ref<FormInst | null>(null)
// 存储已选择的文件列表
const selectedFiles = ref<UploadFileInfo[]>([]);
// const showModalRef = ref(false)
// const previewImageUrlRef = ref('')

const classifyOption = [
  {
    label: 'Drive My Car',
    value: 'song1',
  },
  {
    label: 'Norwegian Wood',
    value: 'song2',
  },
]

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
  tempFile: [
    {
      required: true,
      message: '请至少上传一张图片',
      trigger: 'blur',
      validator: (_rule: FormItemRule, value: unknown) => {
        const files = value as UploadFileInfo[];
        if (!Array.isArray(files) || files.length === 0) {
          throw new Error('请至少上传一张图片');
        }
      },
    },
  ],
  category: [
    {
      required: true,
      message: '请选择分类',
      trigger: 'blur',
    },
  ]
}

interface CreateFormType {
  uid: string
  email: string
  title: string
  content: string
  photos: (string | number)[]
  category: string
  tags: (string | number)[]
  tempFile: UploadFileInfo[]
}

const createForm: CreateFormType = reactive({
  uid: '',
  email: '',
  title: '',
  content: '',
  photos: [],
  category: '',
  tags: [],
  tempFile: [],
})

const newFileImgageList = reactive([
  {
    id: 'createFile',
    name: 'createFile',
    url: '',
    status: 'finished',
  },
])

const insertTag = () => {
  dialog.create({
    title: '警告',
    content: '你确定？',
    positiveText: '确定',
    negativeText: '不确定',
    draggable: true,
    onPositiveClick: () => {
      message.success('确定')
    },
    onNegativeClick: () => {
      message.error('不确定')
    },
  })
}
// 自定义上传函数（不实际上传）
const createCustomUpload = ({ file }: { file: UploadFileInfo }) => {
  selectedFiles.value.push(file);
  createForm.tempFile = selectedFiles.value;
}
// 上传完成后的回调（手动设置 url）
const createUploadFinish = () => {
  message.success('文件已选择')
}
// 取消新增
const cancleCreate = () => {
  // 清空表单
  formRef.value?.restoreValidation()
  createForm.title = ''
  createForm.content = ''
  createForm.photos = []
  createForm.category = ''
  createForm.tags = []
  newFileImgageList[0].url = ''
  createForm.tempFile = []
  router.push('/bms/photo')
}

// 文件上传
const uploadFile = async (id: string) => {
  if (!createForm.tempFile || createForm.tempFile.length === 0) {
    return false;
  }

  const formData = new FormData();
  createForm.tempFile.forEach((file) => {
    if (file.file) {
      formData.append('photos', file.file); // 使用统一的 key 'photos'
    }
  });
  formData.append('_id', id);

  try {
    const response = await uploadPhotoImageApi(formData);
    const res = response.data;
    if (res.code === 200) {
      createForm.photos = res.data.urls;
      message.success(res.message);
      return true;
    } else {
      message.error(res.message);
      return false;
    }
  } catch (err) {
    message.error('图片上传失败，请重试');
    console.error(err);
    return false;
  }
};

// 发布校验提交
const confirmPublish = (e: MouseEvent) => {
  e.preventDefault()
  console.log(createForm)
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      createForm.uid = userInfoStore.data.user._id
      createForm.email = userInfoStore.data.user.email
      const response = await createPhotoLibraryApi(createForm) // 创建图库数据
      const res = response.data
      if (res.code === 200) {
        // 是否本地选择了图片文件
        if (createForm.tempFile) {
          const isUpload = await uploadFile(res.data._id)
          if (isUpload) {
            message.success('更新成功')
          } else {
            message.error('更新失败')
          }
        } else {
          message.success('更新成功')
        }

        message.success(res.message)
      } else {
        message.error(res.message)
      }
    }
    else {
      console.log(errors)
      message.error('确少必填项')
    }
  })
}

const createUploadError = () => {
  message.error('文件选择失败')
}
</script>

<style lang="scss" scoped>
@include g.bms;

.main-router-box {
  .n-form {
    display: flex;
    flex-direction: column;
    width: 100%;

    .header-option-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      width: calc(100% - 40px);

      h3 {
        font-size: 24px;
        line-height: 1.34;
        font-weight: 600;
      }

      .n-button {
        margin-left: 15px;
        border-radius: 8px;
      }
    }

    .quill-editor-box {
      padding: 10px 20px;
      min-height: 50%;
      width: calc(100% - 40px);

      .title-cover-introduc-box {
        display: flex;
        flex-direction: column;
        width: calc(100% - 40px);

        .title-cover-box {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .title-box {
            min-width: 300px;
            margin-bottom: 30px;

            .title-input-box {
              margin-bottom: 20px;
            }

            .classify-tag-box {
              display: flex;
              align-items: center;

              span {
                margin: 0 10px;
              }
            }
          }

          .cover-box {
            .cover-box-icon {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 10px;

              img {
                width: 16px;
                height: 16px;
              }

              span {
                margin-top: 4px;
                font-size: 14px;
                color: #1e2025b8;
                line-height: 18px;
              }
            }
          }
        }
      }

      .introduction-box {
        margin-bottom: 30px;
      }
    }
  }
}
</style>
