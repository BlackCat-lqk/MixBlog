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
        <div class="banner-set-header-box">
          <h3>首页Banner设置</h3>
          <n-button v-if="newCreate" type="info" @click="switchCreate">新建</n-button>
          <n-button v-else type="info" @click="switchCreate">取消新建</n-button>
        </div>
        <div class="banner-content-box">
          <div v-if="hasData" class="content-box">
            <div v-for="(item, index) in bannerData" :key="index" class="banner-item-box">
              <div class="banner-cover-box">
                <img :src="item.cover" alt="封面" />
              </div>
              <div>{{ item.title }}</div>
              <div>{{ item.sub }}</div>
              <div>{{ item.introduction }}</div>
              <div class="btn-box">
                <n-button type="info">{{ item.mainBtnName }}</n-button>
                <n-button strong secondary type="info">{{ item.childBtnName }}</n-button>
                <n-button class="op-btn" strong secondary type="success" @click="editBanner(item)"
                  ><img style="width: 18px" src="@/assets/images/Edit.svg" alt="编辑" />
                </n-button>
                <n-popconfirm @positive-click="handleDeleteBanner(item._id)">
                  <template #trigger>
                    <n-button class="op-btn" type="error" strong secondary
                      ><img style="width: 18px" src="@/assets/images/Delete.svg" alt="删除" />
                    </n-button>
                  </template>
                  确认删除？删除后的数据将无法恢复
                </n-popconfirm>
              </div>
            </div>
          </div>
          <div v-else class="content-box no-data-box">
            <n-empty description="还没有内容，去新建吧~!"></n-empty>
          </div>
          <div v-if="!newCreate" class="new-create-box">
            <n-form style="width: 100%" ref="formRef" :model="formBanner" :rules="rules">
              <n-form-item label="Banner标题">
                <n-input v-model:value="formBanner.title" maxlength="10" show-count clearable />
              </n-form-item>
              <n-form-item label="Banner副标题">
                <n-input v-model:value="formBanner.sub" maxlength="16" show-count clearable />
              </n-form-item>
              <n-form-item label="简要说明">
                <n-input
                  v-model:value="formBanner.introduction"
                  maxlength="24"
                  show-count
                  clearable
                />
              </n-form-item>
              <n-form-item label="主要按钮名称">
                <n-input
                  v-model:value="formBanner.mainBtnName"
                  maxlength="4"
                  show-count
                  clearable
                />
              </n-form-item>
              <n-form-item label="主要按钮地址">
                <n-input v-model:value="formBanner.mainBtnUrl" clearable />
              </n-form-item>
              <n-form-item label="次要按钮名称">
                <n-input
                  v-model:value="formBanner.childBtnName"
                  maxlength="4"
                  show-count
                  clearable
                />
              </n-form-item>
              <n-form-item label="次要按钮地址">
                <n-input v-model:value="formBanner.childBtnUrl" clearable />
              </n-form-item>
              <n-form-item label="上传封面" path="tempFile">
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
              <n-form-item class="banner-submit-btn-box">
                <n-button type="info" @click="submit">发布</n-button>
              </n-form-item>
            </n-form>
          </div>
        </div>
        <n-modal
          v-model:show="state.showEditModal"
          style="width: 600px; padding: 10px"
          preset="dialog"
          title="编辑Banner"
        >
          <div class="edit-from-box">
            <n-form ref="editFormRef" inline :model="editFormValue" :rules="rules">
              <n-grid :cols="24" :x-gap="24">
                <n-form-item-gi :span="12" label="标题" path="title">
                  <n-input v-model:value="editFormValue.title" />
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="副标题" path="sub">
                  <n-input v-model:value="editFormValue.sub" />
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="简介说明" path="introduction">
                  <n-input v-model:value="editFormValue.introduction" />
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="主按钮名称" path="mainBtnName">
                  <n-input v-model:value="editFormValue.mainBtnName" />
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="次按钮名称" path="childBtnName">
                  <n-input v-model:value="editFormValue.childBtnName" />
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="主按钮链接" path="mainBtnUrl">
                  <n-input v-model:value="editFormValue.mainBtnUrl" />
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="次按钮链接" path="childBtnUrl">
                  <n-input v-model:value="editFormValue.childBtnUrl" />
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="封面" path="cover">
                  <n-upload
                    :default-file-list="editFile"
                    :max="1"
                    list-type="image-card"
                    :custom-request="editCustomUpload"
                    :finish="editUploadFinish"
                    :error="editUploadError"
                    :headers="{
                      Authorization: `Bearer ${userInfoStore.data.token}`,
                    }"
                  ></n-upload>
                </n-form-item-gi>
              </n-grid>
            </n-form>
            <div class="edit-btn-space" style="display: flex; justify-content: flex-end">
              <n-button style="margin-right: 5px" @click="state.showEditModal = false">
                取消
              </n-button>
              <n-button type="info" @click="handleEditValidate"> 确认 </n-button>
            </div>
          </div>
        </n-modal>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import {
  createBanner,
  getAllBanners,
  deleteBanner,
  updateBanner,
  uploadBannerCoverApi,
} from '@/http/banner'
import { useMessage } from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'
import { useUserInfoStore } from '@/stores/userInfo'

const message = useMessage()
const userInfoStore = useUserInfoStore()

const rules = {
  tempFile: [
    {
      required: true,
      message: '请上传图片',
      trigger: ['blur', 'change'],
    },
    {
      validator: (rule: unknown, value: File | null) => {
        if (!value) {
          return new Error('请上传图片')
        }

        // 判断文件类型是否为图片
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedImageTypes.includes(value.type)) {
          return new Error('只能上传图片文件（如 JPEG、PNG、GIF、WEBP）')
        }
      },
      trigger: 'change',
    },
  ],
}

const editFile = reactive([
  {
    id: 'editFile',
    name: 'editFile',
    url: '',
    status: 'finished',
  },
])
const newFileImgageList = reactive([
  {
    id: 'createFile',
    name: 'createFile',
    url: '',
    status: 'finished',
  },
])
const state = reactive({
  showEditModal: false,
})
let editFormValue: bannerType = reactive({
  _id: '',
  uId: '',
  email: '',
  title: '',
  sub: '',
  introduction: '',
  mainBtnName: '',
  childBtnName: '',
  mainBtnUrl: '',
  childBtnUrl: '',
  cover: '',
  tempFile: null,
})
interface bannerType {
  _id: string
  uId: string
  email: string
  title: string
  sub: string
  introduction: string
  mainBtnName: string
  mainBtnUrl: string
  childBtnName: string
  childBtnUrl: string
  cover: string
  tempFile: UploadFileInfo | null
}
// 表单数据
const formBanner: bannerType = reactive({
  _id: '',
  uId: '',
  email: '',
  title: '',
  sub: '',
  introduction: '',
  mainBtnName: '',
  mainBtnUrl: '',
  childBtnName: '',
  childBtnUrl: '',
  cover: '',
  tempFile: null,
})
const bannerData = ref<bannerType[]>([])
const newCreate = ref(true)
const hasData = ref(true)
// 自定义上传函数（不实际上传）
const editCustomUpload = ({ file }: { file: UploadFileInfo }) => {
  editFormValue.tempFile = file
}
// 自定义上传函数（不实际上传）
const createCustomUpload = ({ file }: { file: UploadFileInfo }) => {
  formBanner.tempFile = file
}
// 上传完成后的回调（手动设置 url）
const editUploadFinish = () => {
  message.success('文件已选择')
}

const editUploadError = () => {
  message.error('文件选择失败')
}
// 上传完成后的回调（手动设置 url）
const createUploadFinish = () => {
  message.success('文件已选择')
}

const createUploadError = () => {
  message.error('文件选择失败')
}
const switchCreate = () => {
  newCreate.value = !newCreate.value
  initFrom()
}
const initFrom = () => {
  formBanner.uId = ''
  formBanner.email = ''
  formBanner.title = ''
  formBanner.sub = ''
  formBanner.introduction = ''
  formBanner.mainBtnName = ''
  formBanner.mainBtnUrl = ''
  formBanner.childBtnName = ''
  formBanner.childBtnUrl = ''
  formBanner.cover = ''
  formBanner.tempFile = null
}
// 新建提交函数
const submit = async () => {
  formBanner.uId = userInfoStore.data.user._id
  formBanner.email = userInfoStore.data.user.email
  const response = await createBanner(formBanner)
  const res = response.data
  if (res.code === 200) {
    initFrom()
    newCreate.value = true
    const id = res.data._id
    const isUpload = await uploadFile('create', id)
    if (isUpload) {
      getBannerList()
      message.success('更新成功')
    } else {
      message.error('更新失败')
    }
  } else {
    message.error(res.message)
  }
}
const getBannerList = async () => {
  const response = await getAllBanners()
  const res = response.data
  if (res.code == 200) {
    bannerData.value = res.data
  } else {
    message.error(res.message)
    return
  }
}
// 删除Banner配置
const handleDeleteBanner = async (ids: string) => {
  const res = await deleteBanner({ ids: [ids] })
  message.success(res.data.message)
  getBannerList()
}

// 编辑Banner配置
const editBanner = (item: bannerType) => {
  state.showEditModal = true
  editFormValue = item
  editFile[0].url = item.cover
}
// 文件上传
const uploadFile = async (type: string, id: string) => {
  const tempFile = type === 'edit' ? editFormValue.tempFile : formBanner.tempFile
  if (tempFile && tempFile.file) {
    const formData = new FormData()
    formData.append('bannerImages', tempFile?.file)
    formData.append('_id', id)
    try {
      const response = await uploadBannerCoverApi(formData)
      const res = response.data
      if (res.code === 200) {
        if (type === 'edit') {
          editFormValue.cover = res.data.url
        } else {
          formBanner.cover = res.data.url
        }
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
// 编辑Banner配置确认提交
const handleEditValidate = async () => {
  // 调用文件上传接口
  const id = editFormValue._id
  const isUpload = await uploadFile('edit', id)
  if (isUpload) {
    // 调用更新接口
    const res = await updateBanner(editFormValue._id, editFormValue)
    message.success(res.data.message)
    getBannerList()
    state.showEditModal = false
  } else {
    message.error('图片更新失败')
  }
}

onMounted(() => {
  getBannerList()
})
</script>

<style scoped lang="scss">
@include g.bms;

.main-router-box {
  padding: 10px;
  gap: 12px;
  display: flex;
  flex-direction: column;

  .banner-set-header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .banner-content-box {
    display: flex;

    .content-box {
      display: flex;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 12px;
      flex-wrap: wrap;

      .banner-item-box {
        background-color: #2e33380d;
        border-radius: 8px;
        padding: 10px;
        height: 320;
        max-height: 320px;
        max-width: 310px;
        box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);

        div {
          margin: 10px 0;
        }

        .btn-box {
          display: flex;

          .n-button {
            margin-right: 10px;
            width: 96px;
            height: 40px;
          }

          .op-btn {
            width: 40px;
            height: 40px;
          }
        }

        .banner-cover-box {
          width: 100%;
          height: 180px;
          min-width: 240px;
          min-height: 180px;
          border-radius: 8px;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 8px;
          }
        }
      }
    }

    .no-data-box {
      display: flex;
      align-items: center;

      .n-empty {
        width: 100%;
      }
    }

    .new-create-box {
      flex: 0.4;
      min-width: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 18px;
      background-color: #2e33380d;
      box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      padding: 20px;
      align-items: flex-start;
      height: auto;

      .banner-submit-btn-box {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
