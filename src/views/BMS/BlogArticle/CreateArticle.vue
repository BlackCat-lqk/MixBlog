<template>
  <n-modal-provider>
    <div class="bms-main-box">
      <div class="header-box">
        <header-view></header-view>
      </div>
      <div class="content-box">
        <div class="sidebar-box">
          <naviga-menu></naviga-menu>
        </div>
        <div class="main-router-box">
          <div class="header-option-box">
            <h3>新建博客文章</h3>
            <div class="option-btn-box">
              <n-button strong secondary @click="saveArticle('unpublished')">保存</n-button>
              <n-button strong type="info" @click="saveArticle('published')">发布</n-button>
            </div>
          </div>
          <div class="quill-editor-box">
            <div class="title-cover-introduc-box">
              <div class="title-cover-box">
                <div class="title-box">
                  <div class="title-input-box">
                    <n-input placeholder="请输入标题" v-model:value="createParams.title" />
                  </div>
                  <div class="classify-tag-box">
                    <n-select
                      v-model:value="createParams.category"
                      clearable
                      :options="state.classifyOptions"
                      placeholder="请选择分类"
                    >
                      <template #action>
                        <n-button type="info" style="width: 100%" strong secondary>
                          <img style="width: 16px" src="@/assets/images/Add.svg" />新增分类
                        </n-button>
                      </template>
                    </n-select>
                    <span>|</span>
                    <n-button secondary @click="state.showModal = true"> 插入标签 </n-button>
                    <n-modal v-model:show="state.showModal" :mask-closable="false">
                      <n-card
                        style="width: 600px"
                        title="选择标签"
                        :bordered="false"
                        size="huge"
                        role="dialog"
                        aria-modal="true"
                      >
                        <n-checkbox-group
                          :value="createParams.tags"
                          @update:value="handleUpdateTags"
                        >
                          <n-space align="center" item-style="display: flex;">
                            <n-checkbox
                              v-for="(item, idx) in state.tagsOption"
                              :key="idx"
                              :value="item"
                              :label="item"
                            />
                          </n-space>
                        </n-checkbox-group>
                        <template #footer>
                          <n-button type="info" strong secondary @click="cancleSelectTags"
                            >取消</n-button
                          >
                          <n-button type="info" @click="state.showModal = false">确定</n-button>
                        </template>
                      </n-card>
                    </n-modal>
                  </div>
                </div>
                <div class="cover-box">
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
                  >
                    <div class="cover-box-icon">
                      <img src="@/assets/images/Add.svg" />
                      <span>封面800*600</span>
                    </div>
                  </n-upload>
                </div>
              </div>
              <div class="introduction-box">
                <n-input
                  v-model:value="createParams.intro"
                  type="textarea"
                  placeholder="请输入简介..."
                  show-count
                  maxlength="150"
                />
              </div>
            </div>
            <tiptap-editor v-model:content="state.tiptapEditorValue"></tiptap-editor>
          </div>
        </div>
      </div>
    </div>
  </n-modal-provider>
</template>

<script setup lang="ts">
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import { ref, reactive, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'
import TiptapEditor from '@/components/TiptapEditor.vue'
import { getCategoryTagsApi } from '@/http/categoryTags'
import { useUserInfoStore } from '@/stores/userInfo'
import { uploadArticleCoverApi, createBlogArtileApi } from '@/http/blogArticle'
const message = useMessage()

const userInfoStore = useUserInfoStore()
const tempFile = ref<UploadFileInfo | null>(null)

const state = reactive({
  showModal: false,
  classifyOptions: [],
  tagsOption: [],
  tiptapEditorValue: '',
})
interface CreateParamsType {
  title: string
  category: string
  tags: (string | number)[]
  content: string
  cover: string
  intro: string
  uid: string
  email: string
  status: string
}
const createParams: CreateParamsType = reactive({
  title: '',
  category: '',
  tags: [],
  content: '',
  cover: '',
  intro: '',
  uid: '',
  email: '',
  status: '',
})
const newFileImgageList = reactive([
  {
    id: 'createFile',
    name: 'createFile',
    url: '',
    status: 'finished',
  },
])
// 自定义上传函数（不实际上传）
const createCustomUpload = ({ file }: { file: UploadFileInfo }) => {
  tempFile.value = file
}
// 上传完成后的回调（手动设置 url）
const createUploadFinish = () => {
  message.success('文件已选择')
}

const createUploadError = () => {
  message.error('文件选择失败')
}
// 文件上传
const uploadFile = async (id: string) => {
  if (tempFile.value && tempFile.value.file) {
    const formData = new FormData()
    formData.append('articleImages', tempFile.value?.file)
    formData.append('_id', id)
    try {
      const response = await uploadArticleCoverApi(formData)
      const res = response.data
      if (res.code === 200) {
        createParams.cover = res.data.cover
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

// 选择更新标签
const handleUpdateTags = (value: (string | number)[]) => {
  createParams.tags = value
  message.info(JSON.stringify(value))
}
// 取消选择标签
const cancleSelectTags = () => {
  state.showModal = false
  createParams.tags = []
}

// 获取分类和标签选项
const getCategoryTags = async () => {
  const response = await getCategoryTagsApi('article')
  const res = response.data
  if (res.code == 200) {
    state.classifyOptions = res.data.category.map((item: string) => {
      return {
        label: item,
        value: item,
      }
    })
    state.tagsOption = res.data.tags
  } else {
    message.error(res.message)
  }
}

// 保存/发布博客文章
const saveArticle = async (status: string) => {
  console.log(status)
  // createParams.cover = tempFile.value
  // 先保存文章内容，如果有上传图片再保存图片
  createParams.content = state.tiptapEditorValue
  createParams.email = userInfoStore.data.user.email
  createParams.uid = userInfoStore.data.user._id
  createParams.status = status
  // 保存文章
  const response = await createBlogArtileApi(createParams)
  const res = response.data
  if (res.code === 200) {
    // 成功后再上传文件
    const fileResonse = await uploadFile(res.data._id)
    if (fileResonse) {
      message.success(status === 'published' ? '发布成功' : '保存成功')
    } else {
      message.error(status === 'published' ? '发布失败' : '保存失败')
    }
  } else {
    message.error(res.message)
  }
}

onMounted(() => {
  getCategoryTags()
})
</script>

<style lang="scss" scoped>
@include g.bms;

.main-router-box {
  display: flex;
  flex-direction: column;

  .header-option-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;

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

    .title-cover-introduc-box {
      display: flex;
      flex-direction: column;

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
</style>
