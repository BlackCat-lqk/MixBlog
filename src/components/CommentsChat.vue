<!-- components/ArticleComments.vue -->
<template>
  <div class="article-comments">
    <!-- 主评论输入框 -->
    <div class="main-comment-input">
      <n-input
        v-model:value="newCommentContent"
        placeholder="快来评论吧~"
        type="textarea"
        maxlength="500"
        show-count
        clearable
      />
      <div class="comment-actions">
        <n-button @click="submitMainComment" type="info" :disabled="!newCommentContent.trim()"
          >发表评论</n-button
        >
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comments-container">
      <div v-if="commentGroups.length === 0" class="no-comments">还没有评论，快来抢沙发吧！</div>

      <template v-for="group in commentGroups" :key="group.root._id">
        <div class="comment-group">
          <!-- 主评论 -->
          <div class="main-comment">
            <div class="comment-header">
              <div class="avatar">
                <img :src="group.root.avatar" loading="lazy" />
              </div>
              <span class="username">{{ group.root.userName }}</span>
              <span class="time">{{ formatTime(group.root.createdAt) }}</span>
            </div>
            <div class="comment-content">
              {{ group.root.content }}
            </div>
            <div class="comment-actions">
              <n-button strong secondary type="info" @click="handleReplyToComment(group.root)"
                >锐评</n-button
              >
            </div>
          </div>

          <!-- 针对这条主评论的所有回复 -->
          <div class="replies-container">
            <template v-for="reply in group.replies" :key="reply._id">
              <div class="reply-item">
                <div class="comment-header">
                  <div class="avatar">
                    <img :src="reply.avatar" loading="lazy" />
                  </div>
                  <span class="username">{{ reply.userName }}</span>
                  <span class="time">{{ formatTime(reply.createdAt) }}</span>
                </div>
                <div class="comment-content">
                  <!-- 如果是回复其他回复，显示回复信息 -->
                  <span v-if="reply.parentId && reply.parentId !== group.root._id" class="reply-info">
                    回复 {{ replyParentNames[reply._id] }}：
                  </span>
                  {{ reply.content }}
                </div>
                <div class="comment-actions">
                  <n-button strong secondary type="info" @click="handleReplyToComment(reply)"
                    >回复</n-button
                  >
                </div>
              </div>
            </template>
          </div>

          <!-- 回复输入框 -->
          <div v-if="replyTarget && replyTarget._id in getCommentIds(group)" class="reply-input">
            <n-input
              v-model:value="replyContent"
              placeholder="写下你的回复..."
              type="textarea"
              maxlength="500"
              show-count
              clearable
            />
            <div class="reply-actions">
              <n-button type="info" @click="submitReply">提交</n-button>
              <n-button strong secondary type="info" @click="cancelReply">取消</n-button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatTime } from '@/utils/commentUtils'

export interface Comment {
  _id: string
  userId: string
  userName: string
  avatar: string
  email?: string
  content: string
  parentId: string | null
  createdAt: string
  children?: Comment[]
}

// 定义组件的 props
const props = defineProps<{
  comments: Comment[] // 从父组件传入的评论数据
}>()

// 定义组件的 emits
const emit = defineEmits<{
  (e: 'submit-comment', data: { content: string; parentId?: string }): void
  (e: 'reply-comment', comment: Comment): void
}>()

// 本地状态
const newCommentContent = ref('')
const replyTarget = ref<Comment | null>(null)
const replyContent = ref('')

// 预计算回复父级名称映射
const replyParentNames = computed(() => {
  const names: Record<string, string> = {}
  const commentMap: Record<string, Comment> = {}

  // 创建评论映射
  props.comments.forEach((comment) => {
    commentMap[comment._id] = comment
  })

  // 为每个回复设置父级名称
  props.comments.forEach((comment) => {
    if (comment.parentId && comment.parentId !== comment._id) {
      const parent = commentMap[comment.parentId]
      if (parent) {
        names[comment._id] = parent.userName
      }
    }
  })

  return names
})

// 按主评论分组 - 使用记忆化优化
const commentGroups = computed(() => {
  const groups: { root: Comment; replies: Comment[] }[] = []
  const commentMap: Record<string, Comment> = {}

  // 创建评论映射
  props.comments.forEach((comment) => {
    commentMap[comment._id] = comment
  })

  // 分离主评论和回复
  const rootComments: Comment[] = []
  const replyComments: Comment[] = []

  props.comments.forEach((comment) => {
    if (!comment.parentId) {
      rootComments.push(comment)
    } else {
      replyComments.push(comment)
    }
  })

  // 预先构建父级到子级的映射
  const parentToChildren: Record<string, Comment[]> = {}
  replyComments.forEach((reply) => {
    if (!parentToChildren[reply.parentId!]) {
      parentToChildren[reply.parentId!] = []
    }
    parentToChildren[reply.parentId!].push(reply)
  })

  // 构建分组
  rootComments.forEach((root) => {
    // 收集所有直接和间接回复
    const replies: Comment[] = []
    const queue = [...(parentToChildren[root._id] || [])]

    while (queue.length > 0) {
      const current = queue.shift()!
      replies.push(current)

      // 添加当前回复的子回复
      if (parentToChildren[current._id]) {
        queue.push(...parentToChildren[current._id])
      }
    }

    groups.push({
      root,
      replies: replies.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    })
  })

  return groups
})

// 获取组内所有评论ID - 优化为简单查找
const getCommentIds = (group: { root: Comment; replies: Comment[] }): Record<string, boolean> => {
  const ids: Record<string, boolean> = { [group.root._id]: true }
  group.replies.forEach((reply) => {
    ids[reply._id] = true
  })
  return ids
}

// 处理回复评论
const handleReplyToComment = (comment: Comment) => {
  replyTarget.value = comment
  emit('reply-comment', comment)
}

// 提交主评论
const submitMainComment = () => {
  if (newCommentContent.value.trim()) {
    emit('submit-comment', {
      content: newCommentContent.value,
    })
    newCommentContent.value = ''
  }
}

// 提交回复
const submitReply = () => {
  if (replyContent.value.trim() && replyTarget.value) {
    emit('submit-comment', {
      content: replyContent.value,
      parentId: replyTarget.value._id,
    })
    replyContent.value = ''
    replyTarget.value = null
  }
}

// 取消回复
const cancelReply = () => {
  replyContent.value = ''
  replyTarget.value = null
}
</script>

<style lang="scss" scoped>
.article-comments {
  padding: 20px;
  will-change: transform; /* 提示浏览器优化 */
}

.main-comment-input {
  margin-bottom: 30px;
}

.comment-actions {
  margin-top: 12px;
  text-align: right;
}

.comments-container {
  border-top: 1px solid var(--border-color);
  padding-top: 20px;
  contain: content; /* 限制浏览器重绘范围 */
}

.no-comments {
  text-align: center;
  color: var(--text-color2);
  padding: 40px 0;
}

.comment-group {
  margin-bottom: 30px;
  border: 1px solid var(--border-color);
  box-shadow: 0 0 10px 3px var(--border-color);
  border-radius: 4px;
  padding: 16px;
  contain: layout style; /* 优化渲染性能 */
}

.main-comment {
  padding: 12px;
  background-color: var(--box-bg-color4);
  border-radius: 4px;
  margin-bottom: 16px;
}

.replies-container {
  padding-left: 20px;
}

.reply-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
  contain: content;
}

.reply-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 12px;
    overflow: hidden;
    flex-shrink: 0; /* 防止头像被压缩 */

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block; /* 消除图片下方间隙 */
    }
  }
}

.username {
  font-weight: bold;
  color: var(--text-color1);
  margin-right: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.time {
  font-size: 0.8em;
  color: var(--text-color2);
  flex-shrink: 0; /* 防止时间被压缩 */
}

.reply-info {
  color: #007bff;
  font-weight: 500;
}

.comment-content {
  margin-bottom: 8px;
  line-height: 1.5;
  word-break: break-word; /* 防止长文本溢出 */
}

.reply-input {
  margin-top: 16px;
  padding: 12px;
  background-color: var(--box-bg-color4);
  border-radius: 4px;
}

.reply-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 优化滚动性能 */
.comments-container {
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
}

.comment-group, .reply-item {
  transform: translateZ(0);
  backface-visibility: hidden;
}
</style>
