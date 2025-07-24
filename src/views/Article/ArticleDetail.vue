<template>
  <div>
    <n-drawer
      v-model:show="activeDrawer"
      placement="bottom"
      style="height: 98%; border-radius: 10px 10px 0 0"
      to="body"
    >
      <n-drawer-content closable>
        <template #header>
          <div class="article-header-box">
            <div class="article-header-title">
              <h3>{{ props.data.title }}</h3>
            </div>
            <div class="article-header-info-box">
              <div class="article-header-info">
                <n-tag :bordered="false">{{ props.data.category }}</n-tag>
                <n-tag
                  v-for="(tag, idx) in props.data.tags"
                  :key="idx"
                  type="info"
                  round
                  :bordered="false"
                  >{{ tag }}</n-tag
                >
                <p>{{ _formatTime(props.data.updatedAt) }}</p>
              </div>
              <div class="article-header-data-info">
                <n-icon>
                  <img width="20px" src="@/assets/images/likes.svg" />
                  <span>0</span>
                </n-icon>
                <n-icon>
                  <img width="20px" src="@/assets/images/views.svg" />
                  <span>0</span>
                </n-icon>
                <n-icon>
                  <img width="20px" src="@/assets/images/comment.svg" />
                  <span>0</span>
                </n-icon>
              </div>
            </div>
          </div>
        </template>
        <div class="article-content-box">
          <div class="article-intro">
            <p>{{ props.data.intro }}</p>
          </div>
          <div class="article-content">
            <div class="article-content-inner">
              <quill-view :content="props.data.content"></quill-view>
            </div>
          </div>
          <div v-if="!showComment" class="article-comment-float" @click="showComment = true">
            <img width="40px" src="@/assets/images/commentFloat.svg" />
          </div>
          <div v-else class="article-comment-area">
            <div class="comment-area-header">
              <img width="20px" src="@/assets/images/close1.svg" @click="showComment = false" />
            </div>
            <div class="comment-area-chat">
              <CommentsChat
                  :comments="comments"
                  @submit-comment="handleSubmitComment"
                  @reply-comment="handleReplyComment"
                />
            </div>
          </div>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { defineProps, watch, ref, defineEmits, onUnmounted } from 'vue'
import { _formatTime } from '@/utils/publickFun'
import QuillView from '@/components/QuillView.vue'
import CommentsChat from '@/components/CommentsChat.vue'
const activeDrawer = ref(false)
const emits = defineEmits(['update:showModal'])

interface articleDetailType {
  title: string
  content: string
  intro: string
  category: string
  updatedAt: string
  tags: string[]
}

export interface Comment {
  _id: string
  userId: string
  userName: string
  avatar: string
  content: string
  parentId: string | null
  createdAt: string
  children?: Comment[]
}

// 评论数据
const comments = ref<Comment[]>([
  {
    _id: '1',
    userId: 'userA',
    userName: '用户A',
    content: '这篇文章真不错！',
    parentId: null,
    avatar: '/uploads/defalut/web.svg',
    createdAt: '2023-01-01T10:00:00Z',
  },
  {
    _id: '2',
    userId: 'userB',
    userName: '用户B',
    content: '确实，我也这么认为',
    parentId: '1',
    avatar: '/uploads/defalut/web.svg',
    createdAt: '2023-01-01T10:05:00Z',
  },
  {
    _id: '3',
    userId: 'userC',
    userName: '用户C',
    content: '你们都太客气了',
    parentId: '2',
    avatar: '/uploads/defalut/web.svg',
    createdAt: '2023-01-01T10:10:00Z',
  },

  {
    _id: '5',
    userId: 'userI',
    userName: '我',
    content: '我我我我我学到了很多知识',
    parentId: null,
    avatar: '/uploads/defalut/web.svg',
    createdAt: '2023-01-01T10:02:00Z',
  },
  {
    _id: '6',
    userId: 'userC',
    userName: '用户C',
    content: '学到了很多知识',
    parentId: '5',
    avatar: '/uploads/defalut/web.svg',
    createdAt: '2023-01-01T10:02:00Z',
  },
])

// 处理提交评论事件
function handleSubmitComment(data: { content: string; parentId?: string }) {
  // 调用 API 提交评论
  console.log('提交评论:', data);

  // 示例：添加新评论到列表（实际应该从 API 获取更新后的数据）
  const newComment: Comment = {
    _id: `comment_${Date.now()}`,
    userId: 'currentUser',
    userName: '当前用户',
    avatar: 'https://example.com/avatar.png',
    content: data.content,
    parentId: data.parentId || null,
    createdAt: new Date().toISOString()
  };

  comments.value.push(newComment);
}

// 处理回复评论事件
function handleReplyComment(comment: Comment) {
  console.log('回复评论:', comment);
  // 可以在这里处理回复相关的逻辑
}


const showComment = ref(false)

const props = defineProps({
  data: {
    type: Object as () => articleDetailType,
    required: true,
  },
  showModal: {
    type: Boolean,
    default: false,
  },
})
watch(
  () => props.showModal,
  (newVal) => {
    if (newVal) {
      activeDrawer.value = true
    }
  },
)

watch(
  () => activeDrawer.value,
  (newVal) => {
    if (newVal) {
      emits('update:showModal', false)
    }
  },
)
onUnmounted(() => {
  // 确保评论区域关闭，触发子组件的销毁
  showComment.value = false
  // 可以在这里添加其他清理逻辑
})
</script>

<style scoped lang="scss">
:deep(.n-drawer-header__main) {
  display: flex;
  justify-content: center;
}
:deep(.n-drawer-body-content-wrapper) {
  display: flex;
  justify-content: center;
  @include g.scrollbarCustom;
}
:deep(.ql-toolbar) {
  display: none;
}
:deep(.ql-container) {
  border: none;
}

body {
  .article-header-box {
    max-width: 1264px;
    min-width: 1040px;
    padding: 0 120px;
    .article-header-title {
      font-size: 28px;
      font-weight: 600;
      line-height: 40px;
      color: var(--sub-text-color);
    }
    .article-header-info-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .article-header-info {
        display: flex;
        padding: 16px 0 20px 0;
        align-items: center;
        gap: 10px;
        p {
          font-size: 14px;
          color: var(--sub-text-color);
        }
      }
      .article-header-data-info {
        display: flex;
        gap: 24px;
        .n-icon {
          display: flex;
          gap: 2px;
          span {
            font-size: 14px;
            color: var(--sub-text-color);
          }
        }
      }
    }
  }
  .article-content-box {
    max-width: 1264px;
    min-width: 1040px;
    padding: 0 120px;
    position: relative;
    .article-comment-float {
      position: fixed;
      top: 50%;
      right: 0%;
      max-width: 1264px;
      min-width: 1040px;
      transform: translate(60%, 0%);
      cursor: pointer;
    }
    .article-comment-area {
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 0%);
      max-width: 1264px;
      min-width: 1040px;
      height: 82%;
      border-radius: 8px;
      background-color: var(--box-bg-color5);
      color: var(--text-color);
      display: flex;
      flex-direction: column;
      padding: 5px;
      gap: 10px;
      .comment-area-header {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        img {
          cursor: pointer;
        }
      }
      .comment-area-chat {
        flex: 1;
        background-color: var(--box-bg-color4);
        border-radius: 5px;
        overflow: auto;
        padding: 20px;
        @include g.scrollbarCustom;
      }
    }
    .article-intro {
      background-color: var(--box-bg-color5);
      padding: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      p {
        font-size: 18px;
        line-height: 1.54;
        text-align: center;
        color: var(--text-color);
      }
    }
    .article-content {
      padding-top: 40px;
      display: flex;
      justify-content: center;
      .article-content-inner {
        width: 800px;
        p {
          font-size: 18px;
          line-height: 1.54;
          color: var(--text-color);
        }
      }
    }
  }
}
</style>
