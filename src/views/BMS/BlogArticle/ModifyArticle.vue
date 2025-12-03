<template>
  <n-modal-provider>
    <div class="main-router-box">
      <div class="quill-editor-box">
        <div class="title-cover-introduc-box">
          <div class="title-cover-box">
            <div class="title-box">
              <div class="title-input-box">
                <n-input placeholder="请输入标题" v-model:value="editParams.title" />
              </div>
              <div class="classify-tag-box">
                <n-select
                  v-model:value="editParams.category"
                  clearable
                  :options="state.classifyOptions"
                  placeholder="请选择分类"
                >
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
                    <n-checkbox-group :value="editParams.tags" @update:value="handleUpdateTags">
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
                      <div class="tags-footer-box">
                        <n-button type="info" strong secondary @click="cancleSelectTags"
                          >取消</n-button
                        >
                        <n-button type="info" @click="state.showModal = false">确定</n-button>
                      </div>
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
                @remove="onRemoveFile"
                disabled="true"
                :headers="{
                  Authorization: `Bearer ${userInfoStore.data.token}`,
                }"
              >
                <div v-if="!editParams.cover" class="cover-box-icon">
                  <img src="@/assets/images/Add.svg" alt="新增封面" />
                  <span style="color: var(--text-color)">封面800*600</span>
                </div>
                <img v-else style="width: 100%" :src="editParams.cover" alt="封面" />
              </n-upload>
              <span style="font-size: 12px; color: red;">暂未开放封面修改</span>
            </div>
          </div>
          <div class="introduction-box">
            <n-input
              v-model:value="editParams.intro"
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
    <div class="n-footer-box">
      <n-button @click="canleEdit" type="info"> 取消 </n-button>
      <n-button type="info" @click="saveArticle"> 确认修改 </n-button>
    </div>
  </n-modal-provider>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'
import TiptapEditor from '@/components/TiptapEditor.vue'
import { getCategoryTagsApi } from '@/http/categoryTags'
import { useUserInfoStore } from '@/stores/userInfo'
import { updateBlogArticleApi } from '@/http/blogArticle'

const props = defineProps({
  data: {
    type: Object,
  },
})

const emits = defineEmits(['canleEdit'])
const canleEdit = () => {
  emits('canleEdit')
}
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
  _id: string
  status: string
  email: string
}
const editParams: CreateParamsType = reactive({
  title: '',
  category: '',
  tags: [],
  content: '',
  cover: '',
  intro: '',
  _id: '',
  status: '',
  email: '',
})
const newFileImgageList = reactive([
  {
    id: 'createFile',
    name: 'createFile',
    url: editParams.cover,
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
// 移除文件
const onRemoveFile = () => {
  editParams.cover = ''
  newFileImgageList[0].url = ''
  newFileImgageList[0].status = ''
}

const createUploadError = () => {
  message.error('文件选择失败')
}
// 选择更新标签
const handleUpdateTags = (value: (string | number)[]) => {
  editParams.tags = value
  message.info(JSON.stringify(value))
}
// 取消选择标签
const cancleSelectTags = () => {
  state.showModal = false
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

// 修改保存博客文章
const saveArticle = async () => {
  // 先保存文章内容，如果有上传图片再保存图片
  editParams.content = state.tiptapEditorValue
  // 保存文章
  console.log(editParams)
  const response = await updateBlogArticleApi(editParams)
  const res = response.data
  if (res.code === 200) {
      message.success('更新成功')
      canleEdit()
  } else {
    message.error(res.message)
  }
}

const initData = () => {
  if (props.data) {
    editParams.title = props.data.title
    editParams.category = props.data.selectCategory
    editParams.tags = props.data.selectTags
    editParams.content = props.data.content
    state.tiptapEditorValue = props.data.content
    newFileImgageList[0].url = props.data.cover
    editParams.cover = props.data.cover
    editParams.intro = props.data.intro
    editParams._id = props.data._id
    editParams.status = props.data.status
    if (!props.data.cover) {
      newFileImgageList[0].status = ''
    }
  }
}

onMounted(() => {
  getCategoryTags()
  initData()
})
</script>

<style lang="scss" scoped>
.main-router-box {
  display: flex;
  flex-direction: column;
  .quill-editor-box {
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
           display: flex;
           justify-content: center;
           flex-direction: column;
           margin-bottom: 20px;
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
.tags-footer-box {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
}
.n-footer-box {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
}
</style>
