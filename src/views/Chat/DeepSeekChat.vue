<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <div class="chat-main-box">
    <div class="relative w-[500px] h-[500px]">
      <Orb
        class="orb"
        :hoverIntensity="0.5"
        :rotateOnHover="true"
        :hue="0"
        :forceHoverState="false"
      />
    </div>
    <div class="chat-header-box">
      <n-button strong secondary round type="primary" @click="startNewChat"
        ><img
          style="margin-right: 5px"
          width="24px"
          src="@/assets/images/NewChat.svg"
          alt="NewChat"
        />{{ $t('chat.startChat') }}</n-button
      >
      <!-- <n-button strong secondary round type="primary"
        ><img
          style="margin-right: 5px"
          width="24px"
          src="@/assets/images/history.svg"
        />历史会话</n-button
      > -->
    </div>
    <div class="chat-content-box">
      <div class="messages">
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
          <strong v-if="message.role === 'user'"> </strong>
          <strong v-else>
            <div style="display: flex; align-items: center">
              <img
                width="32px"
                class="mix-ai-icon"
                src="@/assets/images/ChatsAI.svg"
                alt="Mix AI"
              />
            </div>
          </strong>
          <quill-view :content="message.content"></quill-view>
        </div>
        <div v-show="isLoading" :class="['message']">
          <strong v-show="isLoading">
            <div style="display: flex; align-items: center">
              {{ $t('chat.padding') }}
              <img
                width="20px"
                class="chat-loading-icon"
                src="@/assets/images/Loading.svg"
                alt="Loading"
              />
            </div>
            <n-space vertical>
              <n-skeleton height="40px" width="66%" :sharp="false" />
            </n-space>
          </strong>
        </div>
        <div v-if="streamingResponse" class="message assistant">
          <div>{{ streamingResponse }}</div>
        </div>
      </div>
    </div>
    <div class="chat-option-box">
      <n-input
        v-model:value="userInput"
        type="textarea"
        :placeholder="$t('chat.sendMsg')"
        style="--n-border: none; --n-border-hover: none"
        @keyup.enter="sendMessage"
      />
      <div class="chat-option">
        <div class="chat-option-item">
          使用流式对话
          <n-switch v-model:value="useStreaming" />
        </div>
        <div class="chat-option-item">
          深度思考
          <n-switch v-model:value="useThink" />
        </div>
        <div class="chat-option-send">
          <n-button strong secondary type="primary" @click="sendMessage" :disabled="isLoading">
            {{ isLoading ? 'Sending...' : 'Send' }}
            <img width="32px" style="margin-left: 10px" src="@/assets/images/send.svg" alt="Send" />
          </n-button>
        </div>
      </div>
    </div>
  </div>
  <footer>
    <FooterNav></FooterNav>
  </footer>
</template>

<script lang="ts" setup>
import Orb from '@/views/VueBits/BitsOrb.vue'
import { chatWithDeepSeek, streamChatWithDeepSeek } from '@/http/deepseek'
import QuillView from '@/components/QuillView.vue'
import HeaderNav from '@/views/Header/HeaderNav.vue'
import FooterNav from '@/views/Footer/FooterNav.vue'
import { useUserInfoStore } from '@/stores/userInfo'
import { useMessage } from 'naive-ui'
import type { IChatMessage as ChatMessage } from '@/tsInterface'

const router = useRouter()
const message = useMessage()
const userInfoStore = useUserInfoStore()
import debounce from 'lodash/debounce'

const userInput = ref('')
const messages = ref<ChatMessage[]>([])
const streamingResponse = ref('')
const isLoading = ref(false)
const useStreaming = ref(true)
const useThink = ref(false)

// 开启新对话
const startNewChat = () => {
  // 清空消息历史
  messages.value = []
  // 清空输入框
  userInput.value = ''
  // 重置流式响应
  streamingResponse.value = ''
  // 重置加载状态
  isLoading.value = false
}
const sendMessage = debounce(async () => {
  if (!userInput.value.trim()) return
  // 检查是否登录
  if (!userInfoStore.data.user.isLogin) {
    message.error('请先登录')
    router.push('/register-login')
    return
  }
  const userMessage: ChatMessage = {
    role: 'user',
    content: userInput.value,
  }

  messages.value.push(userMessage)
  isLoading.value = true
  streamingResponse.value = ''
  userInput.value = ''
  try {
    if (useStreaming.value) {
      await streamChatWithDeepSeek(
        {
          model: useThink ? 'deepseek-reasoner' : 'deepseek-chat',
          messages: [...messages.value],
        },
        (chunk) => {
          streamingResponse.value += chunk
        },
      )

      messages.value.push({
        role: 'assistant',
        content: streamingResponse.value,
      })
      streamingResponse.value = ''
    } else {
      const response = await chatWithDeepSeek({
        model: useThink ? 'deepseek-reasoner' : 'deepseek-chat',
        messages: [...messages.value],
      })

      messages.value.push({
        role: 'assistant',
        content: response.choices[0].message.content,
      })
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    isLoading.value = false
    userInput.value = ''
  }
}, 300)
</script>

<style lang="scss" scoped>
.chat-main-box {
  width: 100%;
  height: calc(94vh - 40px);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--text-color);
  font-family: Arial, sans-serif;
  gap: 5px;
  padding: 20px 0;
  margin-top: 5vh;
  .orb {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    height: 70%;
    z-index: 0;
  }
  .chat-header-box {
    width: 70%;
    height: 50px;
    min-height: 50px;
    border-radius: 8px;
    display: flex;
    padding: 10px;
    align-items: center;
    background-color: var(--box-bg-color1);
    gap: 12px;
  }
  .chat-content-box {
    width: 70%;
    height: calc(100% - 200px);
    border-radius: 8px;
    padding: 0 10px;
    .chat-loading-icon {
      animation: loading 1s ease-in-out infinite;
    }
    @keyframes loading {
      0% {
        rotate: 0deg;
      }
      100% {
        rotate: 360deg;
      }
    }
    .messages {
      height: calc(100% - 50px);
      overflow-y: auto;
      margin: 10px 0;
      padding: 10px;
      border-radius: 8px;
      line-height: 1.5;
      @include g.scrollbarCustom;
      font-size: 18px;
      .mix-ai-icon {
        animation: aicolor 5s ease-in-out infinite;
        border-radius: 50%;
      }
      @keyframes aicolor {
        0% {
          background: linear-gradient(to right, #a8ff78, #fffb00);
        }
        100% {
          background: linear-gradient(to right, #fffb00, #a8ff78);
        }
      }
    }
    .user {
      background-color: var(--box-bg-color7);
      box-shadow: 0 0 10px 0 var(--border-color);
      backdrop-filter: blur(5px);
      text-align: right;
      margin-left: 20%;
      border-radius: 8px;
      margin-bottom: 20px;
      padding: 5px;
    }
    .assistant {
      background-color: var(--box-bg-color7);
      box-shadow: 0 0 10px 0 var(--border-color);
      backdrop-filter: blur(5px);
      margin-right: 20%;
      border-radius: 8px;
      margin-bottom: 20px;
      padding: 5px;
    }
    :deep(.ql-snow) {
      border: none;
    }
    :deep(.ql-editor) {
      font-size: 18px;
    }
  }
  .chat-option-box {
    width: 70%;
    height: 120px;
    border-radius: 8px;
    padding: 10px;
    background-color: var(--bg);
    display: flex;
    flex-direction: column;
    :deep(.n-input) {
      background-color: var(--box-bg-color1);
    }
    .chat-option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
    }
  }
}
</style>
