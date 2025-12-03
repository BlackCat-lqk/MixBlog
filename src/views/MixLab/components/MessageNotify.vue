<template>
  <Teleport to="body">
    <div v-if="props.show" class="global-notification" :class="{ expanded: isExpanded }">
      <!-- 通知图标 -->
      <div class="notification-icon" :class="{ shaking: isShaking }" @click="toggleNotification">
        <img width="64px" src="@/assets/images/MixLab/message.svg" alt="message" />
        <span class="notification-badge" v-if="true">1</span>
      </div>

      <!-- 通知内容 -->
      <div class="notification-content">
        <div class="notification-header">
          <slot name="title">
            <h3>Notification</h3>
          </slot>
          <slot name="headerClose">
            <button class="close-btn" @click="closeNotification">×</button>
          </slot>
        </div>
        <div class="notification-body">
          <slot name="content">
            <p>你有一条信息</p>
          </slot>
          <div class="notification-sender">
            <slot name="footer">特朗普</slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  size: [Number, String],
  color: String,
  class: String,
})

watch(
  () => props.show,
  (val) => {
    if (val) {
      toggleNotification()
    }
  },
)

const emits = defineEmits(['update:show'])

const isShaking = ref(false)
const isExpanded = ref(false)
const hasUnread = ref(true)

// 触发图标抖动动画
const setTimeoutId = ref<ReturnType<typeof setTimeout> | null>(null)
const triggerShake = () => {
  isShaking.value = true
  setTimeoutId.value = setTimeout(() => {
    isShaking.value = false
    // 抖动结束后展开通知
    isExpanded.value = true
    hasUnread.value = false
  }, 300)
}

// 切换通知显示状态
const toggleNotification = () => {
  if (!isExpanded.value) {
    triggerShake()
  }
  isExpanded.value = false
}

// 关闭通知
const closeNotification = () => {
  isExpanded.value = false
  emits('update:show', false)
}

// 组件挂载后自动触发一次抖动
onMounted(() => {
  setTimeout(triggerShake, 1000)
})
onUnmounted(() => {
  if (setTimeoutId.value) {
    clearTimeout(setTimeoutId.value)
  }
})
</script>

<style scoped>
.global-notification {
  position: fixed;
  top: 20%;
  right: 50%;
  transform: translate(50%, -50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.notification-icon {
  position: absolute;
  cursor: pointer;
  background: rgb(255, 255, 255);
  border: 4px solid #008079;
  width: 40px;
  height: 40px;
  padding: 8px;
  border-radius: 50%;
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.5s ease;
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  animation-fill-mode: forwards;
}

.notification-icon:hover {
  transform: scale(1.05);
}

@keyframes shake {
  0%,
  5% {
    transform: translateX(0) rotate(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-2px) rotate(-5deg);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(2px) rotate(5deg);
  }
  99%,
  100% {
    visibility: hidden;
  }
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff4d4f;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.notification-content {
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  margin-top: 10px;
  opacity: 0;
  position: relative;
  /* display: none; */
  transform: translateY(-10px) scale(0.95);
  pointer-events: none;
  transition: all 0.3s ease;
}

.global-notification.expanded .notification-content {
  opacity: 1;
  /* display: block; */
  transform: translateY(0) scale(1);
  pointer-events: auto;
  transition: all 0.3s ease;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f9f9f9;
  border-radius: 12px 12px 0 0;
}

.notification-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #999;
  line-height: 1;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.close-btn:hover {
  background-color: #f0f0f0;
  color: #666;
}

.notification-body {
  padding: 20px;
}

.notification-body p {
  margin: 0 0 16px 0;
  line-height: 1.6;
  color: #666;
  font-size: 14px;
}

.notification-sender {
  font-weight: 500;
  color: #333;
  text-align: right;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .global-notification {
    top: 10px;
    right: 10px;
    left: 10px;
    align-items: center;
  }

  .notification-content {
    width: 100%;
    max-width: 320px;
  }
}
</style>
