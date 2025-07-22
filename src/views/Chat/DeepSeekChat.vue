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
      <n-button strong secondary round type="primary"
        ><img
          style="margin-right: 5px"
          width="24px"
          src="@/assets/images/NewChat.svg"
        />开启新对话</n-button
      >
      <n-button strong secondary round type="primary"
        ><img
          style="margin-right: 5px"
          width="24px"
          src="@/assets/images/history.svg"
        />历史会话</n-button
      >
    </div>
    <div class="chat-content-box">
      <div class="messages">
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
          <strong v-if="message.role === 'user'"
            ><img
              v-show="message.role === 'user'"
              width="32px"
              style="padding: 8px"
              src="@/assets/images/ChatUser.svg"
          /></strong>
          <strong v-else
            ><img width="32px" style="padding: 8px" src="@/assets/images/ChatsAI.svg"
          /></strong>
          <quill-view :content="md.render(message.content)"></quill-view>
        </div>
        <div v-show="isLoading" :class="['message']">
          <strong v-show="isLoading"
            ><img width="32px" style="padding: 8px" src="@/assets/images/ChatsAI.svg" />
            <n-space vertical>
              <n-skeleton height="40px" width="33%" />
              <n-skeleton height="40px" width="66%" :sharp="false" />
              <n-skeleton height="40px" round />
              <n-skeleton height="40px" circle />
            </n-space>
          </strong>
        </div>
        <div v-if="streamingResponse" class="message assistant">
          <strong>DeepSeek:</strong>
          <div>{{ streamingResponse }}</div>
        </div>
      </div>
    </div>
    <div class="chat-option-box">
      <n-input
        v-model:value="userInput"
        type="textarea"
        placeholder="发送消息~"
        style="--n-border: none; --n-border-hover: none"
        @keyup.enter="sendMessage"
      />
      <div class="chat-option">
        <div class="chat-option-item">
          Use Streaming
          <n-switch v-model:value="useStreaming" />
        </div>
        <div class="chat-option-send">
          <n-button strong secondary type="primary" @click="sendMessage" :disabled="isLoading">
            {{ isLoading ? 'Sending...' : 'Send' }}
            <img width="32px" style="margin-left: 10px" src="@/assets/images/send.svg" />
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
import { ref } from 'vue'
import { chatWithDeepSeek, streamChatWithDeepSeek } from '@/http/deepseek'
import QuillView from '@/components/QuillView.vue'
import MarkdownIt from 'markdown-it'
import HeaderNav from '@/views/Header/HeaderNav.vue'
import FooterNav from '@/views/Footer/FooterNav.vue'

// 定义类型
interface MarkdownOptions {
  html?: boolean
  linkify?: boolean
  typographer?: boolean
  breaks?: boolean
}

// 创建 markdown-it 实例
const md: MarkdownIt = new MarkdownIt({
  html: true, // 启用 HTML 标签
  linkify: true, // 自动转换 URL 为链接
  typographer: true, // 优化排版
  breaks: true, // 转换换行符为 <br>
} as MarkdownOptions)

const userInput = ref('')
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
const messages = ref<ChatMessage[]>([])
const streamingResponse = ref('')
const isLoading = ref(false)
const useStreaming = ref(false)

const sendMessage = async () => {
  if (!userInput.value.trim()) return

  const userMessage: ChatMessage = {
    role: 'user',
    content: userInput.value,
  }

  messages.value.push(userMessage)
  isLoading.value = true
  streamingResponse.value = ''

  try {
    if (useStreaming.value) {
      await streamChatWithDeepSeek(
        {
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
}
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
    .messages {
      height: calc(100% - 50px);
      overflow-y: auto;
      margin: 10px 0;
      padding: 10px;
      border-radius: 8px;
      line-height: 1.5;
      @include g.scrollbarCustom;
      font-size: 18px;
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
