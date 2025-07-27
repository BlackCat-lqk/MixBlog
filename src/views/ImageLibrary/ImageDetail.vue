<template>
  <div>
    <n-drawer
      v-model:show="activeDrawer"
      placement="bottom"
      style="height: 98%; border-radius: 10px 10px 0 0"
      to="body"
      @after-leave="closeDrawer"
    >
      <n-drawer-content closable>
        <template #header>
          <div class="image-header-box">
            <div class="image-header-title">
              <h3>{{ props.data.title }}</h3>
            </div>
            <div class="image-header-info-box">
              <div class="image-header-info">
                <n-tag :bordered="false" type="info">{{ props.data.category }}</n-tag>
                <p>{{ _formatTime(props.data.updatedAt) }}</p>
              </div>
              <div class="image-header-data-info">
                <div style="cursor: pointer">
                  <img width="32px" src="@/assets/images/likes.svg" @click="likeArticle" />
                  <span>{{ state.likes }}</span>
                </div>
                <div>
                  <img width="32px" src="@/assets/images/views.svg" />
                  <span>{{ state.views }}</span>
                </div>
                <div class="comment-animation" @click="showComment = !showComment">
                  <img width="32px" src="@/assets/images/comment-pen.svg" />
                  <span>{{ state.comments }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="image-content-box">
          <div class="image-intro">
            <p>{{ props.data.content }}</p>
          </div>
          <div class="image-content">
            <div class="image-content-inner">
              <n-image
                v-for="(item, idx) in props.data.photos"
                :key="idx"
                :src="item"
                object-fit="cover"
                width="100%"
              />
            </div>
          </div>
          <div :class="showComment ? 'photo-comment-area' : 'photo-comment-hide'">
            <div class="comment-area-header">
              <img width="32px" src="@/assets/images/close1.svg" @click="showComment = false" />
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
import { watch, ref, reactive } from 'vue'
import { _formatTime } from '@/utils/publickFun'
import CommentsChat from '@/components/CommentsChat.vue'
import { useUserInfoStore } from '@/stores/userInfo'
import { addPhotoCommentApi, likePhotoApi, viewPhotoApi } from '@/http/photoLibrary'
import { useMessage } from 'naive-ui'
import { useDeviceStore } from '@/stores/deviceInfo'
import { useRouter } from 'vue-router'
import _ from 'lodash'

const router = useRouter()
const userInfoStore = useUserInfoStore()
const deviceStore = useDeviceStore()
const message = useMessage()
const activeDrawer = ref(false)
const comments = ref<Comment[]>([])
const showComment = ref(false)
const state = reactive({
  likes: 0,
  views: 0,
  comments: 0,
})
const emits = defineEmits(['update:showModal'])
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

export interface LikeView {
  userId: string
  userName: string
  email: string
  viewedAt: string
  likedAt: string
}
interface photoDetailType {
  _id: string
  title: string
  content: string
  category: string
  updatedAt: string
  photos: string[]
  comments: Comment[]
  likes: LikeView[]
  views: LikeView[]
}

// Drawer 关闭后的回调
const closeDrawer = () => {
  showComment.value = false
}

// 处理提交评论事件
const handleSubmitComment = _.debounce(async (data: { content: string; parentId?: string }) => {
  // 调用 API 提交评论
  const params = {
    libraryId: props.data._id,
    userId: userInfoStore.data.user._id,
    userName: userInfoStore.data.user.userName,
    avatar: userInfoStore.data.user.avatar,
    email: userInfoStore.data.user.email,
    content: data.content,
    parentId: data.parentId || null,
  }
  const result = await addPhotoCommentApi(params)
  const res = result.data
  if (res.code === 200) {
    const newComment: Comment = {
      _id: res.data._id,
      userId: userInfoStore.data.user._id,
      userName: userInfoStore.data.user.userName,
      avatar: userInfoStore.data.user.avatar,
      content: res.data.content,
      parentId: res.data.parentId || null,
      createdAt: res.data.createdAt,
    }
    comments.value.push(newComment)
    message.success('评论成功')
    state.comments += 1
  } else if (res.code === 401) {
    message.info('请先登录')
    router.push('/register-login')
  } else {
    message.warning('评论出错了')
  }
}, 300)
// 处理回复评论事件
const handleReplyComment = (comment: Comment) => {
  console.log('回复评论:', comment)
}
// 处理点赞事件
const likeArticle = _.debounce(async () => {
  const params = {
    libraryId: props.data._id,
    userId: userInfoStore.data.user._id,
    userName: userInfoStore.data.user.userName,
    email: userInfoStore.data.user.email,
  }
  const result = await likePhotoApi(params)
  const res = result.data
  if (res.code === 200) {
    if (res.type == 'like') {
    } else {
      console.log('取消点赞')
    }
    state.likes = res.data
  } else if (res.code === 401) {
    message.info('请先登录')
    router.push('/register-login')
  } else {
    message.warning('点赞失败')
  }
}, 300)

// 浏览接口
const viewArticle = async () => {
  const params = {
    libraryId: props.data._id,
    userId: userInfoStore.data.user._id,
    ip: deviceStore.ip,
  }
  const result = await viewPhotoApi(params)
  const res = result.data
  if (res.code === 200) {
    state.views = res.data
  }
}

const props = defineProps({
  data: {
    type: Object as () => photoDetailType,
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
      comments.value = props.data.comments
      state.comments = props.data.comments.length
      state.likes = props.data.likes.length
      state.views = props.data.views.length
      viewArticle()
      emits('update:showModal', false)
    }
  },
)
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
body {
  .image-header-box {
    max-width: 1264px;
    min-width: 1040px;
    padding: 0 120px;
    .image-header-title {
      font-size: 28px;
      font-weight: 600;
      line-height: 40px;
    }
    .image-header-info-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .image-header-info {
        display: flex;
        padding: 16px 0 20px 0;
        align-items: center;
        gap: 10px;
        p {
          font-size: 14px;
          color: var(--sub-text-color);
        }
      }
      .image-header-data-info {
        display: flex;
        gap: 24px;
        div {
          display: flex;
          align-items: center;
          gap: 5px;
          span {
            font-size: 16px;
            color: var(--sub-text-color);
          }
        }
        .comment-animation {
          cursor: pointer;
          animation: comment-shking 5s infinite;
        }
        @keyframes comment-shking {
          0%,
          90% {
            transform: translate(0);
          }
          91% {
            transform: translate(-2px, 2px);
          }
          92% {
            transform: translate(2px, -2px);
          }
          93% {
            transform: translate(-2px, -2px);
          }
          94% {
            transform: translate(2px, 2px);
          }
          95% {
            transform: translate(-2px, 2px);
          }
          96% {
            transform: translate(2px, -2px);
          }
          97% {
            transform: translate(-2px, -2px);
          }
          98% {
            transform: translate(2px, 2px);
          }
          99% {
            transform: translate(-2px, 2px);
          }
          100% {
            transform: translate(0);
          }
        }
      }
    }
  }
  .image-content-box {
    max-width: 1264px;
    min-width: 1040px;
    padding: 0 120px;
    position: relative;
    .photo-comment-area,
    .photo-comment-hide {
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
      transition: all 0.3s ease-in-out;
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
    .photo-comment-hide {
      bottom: -100%;
    }
    .image-comment-float {
      position: fixed;
      top: 50%;
      right: 0%;
      max-width: 1264px;
      min-width: 1040px;
      transform: translate(60%, 0%);
    }
    .image-comment-area {
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 0%);
      max-width: 1264px;
      min-width: 1040px;
      height: 500px;
      border-radius: 8px;
      background-color: var(--box-bg-color5);
      color: var(--text-color);
    }
    .image-intro {
      background-color: var(--box-bg-color1);
      padding: 32px;
      display: flex;
      justify-content: center;
      border-radius: 8px;
      p {
        font-size: 18px;
        line-height: 1.54;
        color: var(--text-color);
      }
    }
    .image-content {
      padding-top: 40px;
      display: flex;
      justify-content: center;
      .image-content-inner {
        width: 800px;
        :deep(.n-image) {
          width: 100%;
          object-fit: cover;
          border-radius: 8px;
          margin: 20px 0;
        }
        p {
          font-size: 18px;
          line-height: 1.54;
          color: #0b1926;
        }
      }
    }
  }
}
</style>
