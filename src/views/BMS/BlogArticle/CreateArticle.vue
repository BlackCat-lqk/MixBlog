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
        <div class="header-option-box">
          <h3>新建博客文章</h3>
          <div class="option-btn-box">
            <n-button strong secondary>保存</n-button>
            <n-button strong type="info">发布</n-button>
          </div>
        </div>
        <div class="quill-editor-box">
          <div class="title-cover-introduc-box">
            <div class="title-cover-box">
              <div class="title-box">
                <div class="title-input-box">
                  <n-input placeholder="请输入标题" v-model:value="title" />
                </div>
                <div class="classify-tag-box">
                  <n-select
                    v-model:value="classifyValue"
                    :options="classifyOption"
                    placeholder="请选择分类"
                  >
                    <template #action>
                      <n-button type="info" style="width: 100%" strong secondary>
                        <img style="width: 16px" src="@/assets/images/Add.svg" />新增分类
                      </n-button>
                    </template>
                  </n-select>
                  <span>|</span>
                  <n-button secondary @click="insertTag"> 插入标签 </n-button>
                </div>
              </div>
              <div class="cover-box">
                <n-upload
                  list-type="image-card"
                  @preview="handlePreview"
                  :default-file-list="previewFileList"
                >
                  <div class="cover-box-icon">
                    <img src="@/assets/images/Add.svg" />
                    <span>封面800*600</span>
                  </div>
                </n-upload>
                <n-modal
                  v-model:show="showModalRef"
                  preset="card"
                  style="width: 600px"
                  title="预览"
                >
                  <img :src="previewImageUrlRef" style="width: 100%" />
                </n-modal>
              </div>
            </div>
            <div class="introduction-box">
              <n-input
                v-model:value="introduction"
                type="textarea"
                placeholder="请输入简介..."
                show-count
                maxlength="150"
              />
            </div>
          </div>
          <QuillEditor v-model="articleContent" :options="options" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import { QuillEditor } from '@vueup/vue-quill'
import type { UploadFileInfo } from 'naive-ui'
import { ref } from 'vue'
import { useDialog, useMessage } from 'naive-ui'

const title = ref('')
const dialog = useDialog()
const message = useMessage()
const articleContent = ref('')
const introduction = ref('')
const showModalRef = ref(false)
const previewImageUrlRef = ref('')
const classifyValue = ref(null)

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

const options = {
  modules: {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
        ['blockquote', 'code-block'], // 引用代码块

        [{ header: 1 }, { header: 2 }], // 标题
        [{ list: 'ordered' }, { list: 'bullet' }], // 有序/无序列表
        [{ script: 'sub' }, { script: 'super' }], // 上标/下标

        [{ indent: '-1' }, { indent: '+1' }], // 缩进
        [{ direction: 'rtl' }], // 文字方向

        [{ size: ['small', false, 'large', 'huge'] }], // 字号
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题级别

        [{ color: [] }, { background: [] }], // 颜色选择器
        [{ font: [] }], // 字体选择
        [{ align: [] }], // 对齐方式

        ['clean'], // 清除样式
        ['link', 'image', 'video'], // 插入链接、图片、视频
      ],
    },
  },
  placeholder: 'Compose an epic...',
  readOnly: false,
  theme: 'snow',
}

const previewFileList = ref([])

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

const handlePreview = (file: UploadFileInfo) => {
  const { url } = file
  previewImageUrlRef.value = url as string
  showModalRef.value = true
  console.log(previewImageUrlRef.value)
}
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
