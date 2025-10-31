<template>
  <el-dialog
    v-model="dialogVisible"
    title="OnlyOffice 编辑器"
    width="90%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="5vh"
    @close="handleClose"
  >
    <div :loading="loading"   class="editor-container">
      <div id="onlyoffice-editor" ref="editorRef"></div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, onBeforeUnmount, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  realPath: {
    type: String,
    required: true
  },
})

const emit = defineEmits(['update:modelValue', 'save'])

const dialogVisible = ref(false)
const loading = ref(false)
const editorRef = ref(null)
let docEditor = null

// 监听 modelValue 变化
watch(() => props.modelValue, (val) => {
  dialogVisible.value = val
  if (val) {
    initEditor()
  }
})

// 监听 dialogVisible 变化，同步到父组件
watch(dialogVisible, (val) => {
  emit('update:modelValue', val)
  if (!val) {
    destroyEditor()
  }
})

// 初始化编辑器
const initEditor = async () => {
  loading.value = true

  try {
    // 等待 DOM 更新
    await nextTick()

    // 检查 DocsAPI 是否已加载
    if (!window.DocsAPI) {
      await loadOnlyOfficeScript()
    }

    // 调用接口获取配置
    const res = await onlyOfficeConfig({
      isEdit: props.isEdit,
      fileId: props.fileId,
      realPath: props.realPath
    })

    if (res.code === 200 && res.data) {
      const config = res.data
      config.document.url = `https://mixblog.cn/` + config.document.url
      // config.editorConfig.callbackUrl = `https://mixblog.cn/` + config.editorConfig.callbackUrl
      // console.log('配置地址',config.document.url);

      // 初始化编辑器
      docEditor = new window.DocsAPI.DocEditor('onlyoffice-editor', {
        ...config,
        width: '100%',
        height: '100%',
        events: {
          onReady: function() {
            // console.log('文档已加载')
            loading.value = false
            ElMessage.success('文档加载成功')
          },
          onDocumentStateChange: function(event) {
            console.log('文档状态改变', event)
          },
          onSave: function(event) {
            // console.log('用户手动保存触发', event)
            ElMessage.success('保存成功')
            emit('save', event)
          },
          onError: function(error) {
            console.error('编辑器错误', error)
            loading.value = false
            ElMessage.error('编辑器加载失败: ' + (error.data || '未知错误'))
          },
          onWarning: function(warning) {
            console.warn('编辑器警告', warning)
            ElMessage.warning('编辑器警告: ' + (warning.data || ''))
          }
        }
      })
    } else {
      throw new Error(res.message || '获取配置失败')
    }
  } catch (error) {
    console.error('初始化编辑器失败:', error)
    loading.value = false
    ElMessage.error('初始化编辑器失败: ' + (error.message || '未知错误'))
    dialogVisible.value = false
  }
}

// 动态加载 OnlyOffice API 脚本
const loadOnlyOfficeScript = () => {
  return new Promise((resolve, reject) => {
    // 检查脚本是否已存在
    const existingScript = document.querySelector('script[src*="documents/api.js"]')
    if (existingScript) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = '@/utils/onlyoffice.js'
    script.onload = () => {
      // console.log('OnlyOffice API 脚本加载成功')
      resolve()
    }
    script.onerror = () => {
      reject(new Error('OnlyOffice API 脚本加载失败'))
    }
    document.head.appendChild(script)
  })
}

// 销毁编辑器
const destroyEditor = () => {
  if (docEditor) {
    try {
      docEditor.destroyEditor()
      docEditor = null
      // console.log('编辑器已销毁')
    } catch (error) {
      console.error('销毁编辑器失败:', error)
    }
  }
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
}

// 组件卸载前销毁编辑器
onBeforeUnmount(() => {
  destroyEditor()
})
</script>

<style scoped lang="scss">
.editor-container {
  width: 100%;
  height: 75vh;
  position: relative;

  #onlyoffice-editor {
    width: 100%;
    height: 100%;
  }
}

:deep(.el-dialog__header) {
  background: linear-gradient(90deg, #308CED 0%, #5BA3F5 100%);
  padding: 15px 20px;

  .el-dialog__title {
    color: #fff;
    font-weight: 500;
  }

  .el-dialog__headerbtn {
    top: 15px;

    .el-dialog__close {
      color: #fff;
      font-size: 20px;

      &:hover {
        color: #f0f0f0;
      }
    }
  }
}

:deep(.el-dialog__body) {
  padding: 0;
}
</style>

