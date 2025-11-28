<template>
  <div class="feedback-container">
    <!-- 反馈触发按钮 -->
    <div v-if="!showForm" class="feedback-trigger" :style="positionStyle" @click="openFeedbackForm">
      <img src="@/assets/images/feedback.svg" alt="feedback" />
    </div>
    <!-- 反馈表单弹窗 -->
    <div v-if="showForm" class="feedback-modal">
      <div class="feedback-modal-content">
        <div class="feedback-header">
          <h3>{{ title }}</h3>
          <button class="close-button" @click="closeFeedbackForm">×</button>
        </div>

        <form @submit.prevent="submitFeedback" class="feedback-form">
          <!-- 反馈类型选择 -->
          <div class="form-group">
            <label class="form-label">反馈类型</label>
            <div class="feedback-type-selector">
              <button
                v-for="type in feedbackTypes"
                :key="type.value"
                type="button"
                class="type-button"
                :class="{ active: formData.feedbackType === type.value }"
                @click="formData.feedbackType = type.value"
              >
                {{ type.label }}
              </button>
            </div>
          </div>

          <!-- 主题 -->
          <div class="form-group">
            <label for="subject" class="form-label">主题</label>
            <input
              id="subject"
              v-model="formData.subject"
              type="text"
              class="form-input"
              placeholder="请简要描述您的反馈"
              required
            />
          </div>

          <!-- 详细描述 -->
          <div class="form-group">
            <label for="description" class="form-label">详细描述</label>
            <textarea
              id="description"
              v-model="formData.description"
              class="form-textarea"
              rows="4"
              placeholder="请详细描述您的问题或建议..."
              required
            ></textarea>
          </div>

          <!-- 截图功能 -->
          <div class="form-group">
            <label class="form-label">截图（可选，最多3张）</label>
            <div class="screenshots-area">
              <div class="screenshots-placeholder">
                <button type="button" class="screenshots-btn" @click="captureScreenshot">
                  上传截图
                </button>
              </div>
            </div>
          </div>

          <!-- 联系方式 -->
          <div class="form-group">
            <label for="contact" class="form-label">联系方式</label>
            <input
              id="contact"
              v-model="formData.contact"
              type="text"
              class="form-input"
              placeholder="请输入邮箱或手机号以便我们回复您"
            />
          </div>

          <!-- 提交按钮 -->
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeFeedbackForm">取消</button>
            <button type="submit" class="btn-primary" :disabled="submitting">
              {{ submitting ? '提交中...' : '提交反馈' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 成功提示 -->
    <div v-if="showSuccess" class="feedback-success">
      <div class="success-content">
        <span class="success-icon">✅</span>
        <p>感谢您的反馈！</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { upsertFeedbackApi } from '@/http/feedback'
import type { IFeedbackType as FeedbackType,
  IFeedbackFormData as FeedbackFormData,
  IFeedbackProps as Props
 } from '@/tsInterface'

// 组件属性
const props = withDefaults(defineProps<Props>(), {
  positionBottom: 100,
  positionRight: 100,
  title: '帮助我们改进',
  apiUrl: '',
})

const positionStyle = {
  bottom: props.positionBottom + 'px',
  right: props.positionRight + 'px',
}

// 反馈类型选项
const feedbackTypes: FeedbackType[] = [
  { value: 'bug', label: '问题反馈' },
  { value: 'suggestion', label: '功能建议' },
  { value: 'praise', label: '表扬' },
  { value: 'other', label: '其他' },
]

// 响应式状态
const showForm = ref(false)
const showSuccess = ref(false)
const submitting = ref(false)

// 表单数据
const formData = reactive<FeedbackFormData>({
  feedbackType: 'bug',
  subject: '',
  description: '',
  screenshots: [],
  environment: {
    url: '',
    userAgent: '',
    viewport: '',
    timestamp: '',
  },
  contact: '',
})

// 环境信息
const environmentInfo = reactive({
  url: '',
  userAgent: '',
  viewport: '',
  timestamp: '',
})

// 收集环境信息
const collectEnvironmentInfo = () => {
  environmentInfo.url = window.location.href
  environmentInfo.userAgent = navigator.userAgent
  environmentInfo.viewport = `${window.innerWidth} × ${window.innerHeight}`
  environmentInfo.timestamp = new Date().toISOString()
}

// 打开反馈表单
const openFeedbackForm = () => {
  collectEnvironmentInfo()
  showForm.value = true
}

// 关闭反馈表单
const closeFeedbackForm = () => {
  showForm.value = false
  // 重置表单
  if (!submitting.value) {
    formData.subject = ''
    formData.description = ''
    formData.screenshots = []
    formData.contact = ''
  }
}

// 截图功能（简化版）
const captureScreenshot = () => {
  // 实际项目中这里会实现完整的截图功能
  // 这里仅做演示
  alert('非常抱歉，该功能暂未开放...')
}

// 提交反馈
const submitFeedback = async () => {
  submitting.value = true

  try {
    // 准备提交数据
    const submitData = {
      ...formData,
      environment: environmentInfo,
    }
    const response = await upsertFeedbackApi(submitData)
    const res = response.data
    if (res.code === 200) {
      // 显示成功消息
      showSuccess.value = true
      showForm.value = false

      // 3秒后隐藏成功消息
      setTimeout(() => {
        showSuccess.value = false
      }, 3000)
    } else {
      alert('提交失败，请稍后重试')
    }
  } catch (error) {
    console.error('提交反馈出错:', error)
    alert('提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// 键盘快捷键支持（按ESC关闭）
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showForm.value) {
    closeFeedbackForm()
  }
}

// 添加和移除事件监听器
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.feedback-container {
  position: relative;
  z-index: 1000;
}

.feedback-trigger {
  position: fixed;
  bottom: 100px;
  right: 100px;
  opacity: 0.5;
}

.feedback-trigger img {
  width: 48px;
  height: 48px;
  cursor: pointer;
}

.feedback-trigger:hover {
  opacity: 1;
}

.feedback-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.feedback-modal-content {
  background-color: var(--bg-color);
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 0 6px 2px rgba(130, 155, 156, 0.2);
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.feedback-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--text-color);
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-color);
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-button:hover {
  background-color: var(--box-bg-color4);
  color: var(--text-color);
}

.feedback-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-color);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.feedback-type-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.type-button {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background-color: #fafafa;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.type-button:hover {
  background-color: #f0f8ff;
  border-color: #91d5ff;
}

.type-button.active {
  background-color: #e6f7ff;
  border-color: #1890ff;
  color: #1890ff;
  font-weight: 500;
}

.screenshots-area {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  padding: 16px;
  text-align: center;
}

.screenshots-preview {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
}

.screenshots-placeholder {
  color: #8c8c8c;
}

.screenshots-btn {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.screenshots-btn:hover {
  background-color: #e6f7ff;
  border-color: #91d5ff;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #1890ff;
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background-color: #40a9ff;
}

.btn-primary:disabled {
  background-color: #bae7ff;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: white;
  color: #262626;
  border: 1px solid #d9d9d9;
}

.btn-secondary:hover {
  background-color: #fafafa;
  border-color: #8c8c8c;
}

.feedback-success {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background-color: #52c41a;
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s;
}

.success-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-icon {
  font-size: 16px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 600px) {
  .feedback-modal-content {
    width: 95%;
    margin: 10px;
  }

  .feedback-type-selector {
    flex-direction: column;
  }

  .type-button {
    width: 100%;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
