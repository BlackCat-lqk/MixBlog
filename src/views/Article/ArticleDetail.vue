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
                <p>{{ _formatTime(props.data.updatedAt).date }}</p>
              </div>
              <div class="article-header-data-info">
                <div style="cursor: pointer">
                  <img
                    width="32px"
                    src="@/assets/images/likes.svg"
                    @click="likeArticle"
                    alt="likes"
                  />
                  <span>{{ state.likes }}</span>
                </div>
                <div>
                  <img width="32px" src="@/assets/images/views.svg" alt="views" />
                  <span>{{ state.views }}</span>
                </div>
                <div class="comment-animation" @click="showComment = !showComment">
                  <img width="32px" src="@/assets/images/comment-pen.svg" alt="comment" />
                  <span>{{ state.comments }}</span>
                </div>
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
              <quill-view :content="articleContent"></quill-view>
            </div>
          </div>
          <div :class="showComment ? 'article-comment-area' : 'article-comment-hide'">
            <div class="comment-area-header">
              <img
                width="32px"
                src="@/assets/images/close1.svg"
                @click="showComment = false"
                alt="close"
              />
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
import { _formatTime } from '@/utils/publickFun'
import { useUserInfoStore } from '@/stores/userInfo'
import { addArticleCommentApi, likeArticleApi, viewArticleApi } from '@/http/blogArticle'
import { useMessage } from 'naive-ui'
import { useDeviceStore } from '@/stores/deviceInfo'
import _ from 'lodash'
import { getAllBlogArticleApi } from '@/http/blogArticle'
const QuillView = defineAsyncComponent(() => import('@/components/QuillView.vue'))
const CommentsChat = defineAsyncComponent(() => import('@/components/CommentsChat.vue'))

const router = useRouter()
const deviceStore = useDeviceStore()
const message = useMessage()
const userInfoStore = useUserInfoStore()
const activeDrawer = ref(false)
const emits = defineEmits(['update:showModal'])
const showComment = ref(false)
const articleContent = ref('')

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

const state = reactive({
  likes: 0,
  views: 0,
  comments: 0,
})

export interface LikeView {
  userId: string
  userName: string
  email: string
  viewedAt: string
  likedAt: string
}

interface articleDetailType {
  _id: string
  title: string
  content?: string
  intro: string
  category: string
  updatedAt: string
  tags: string[]
  comments: Comment[]
  likes: LikeView[]
  views: LikeView[]
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
const comments = ref<Comment[]>([])

// 处理提交评论事件
const handleSubmitComment = _.debounce(async (data: { content: string; parentId?: string }) => {
  // 调用 API 提交评论
  const params = {
    articleId: props.data._id,
    userId: userInfoStore.data.user._id,
    userName: userInfoStore.data.user.userName,
    avatar: userInfoStore.data.user.avatar,
    email: userInfoStore.data.user.email,
    content: data.content,
    parentId: data.parentId || null,
  }
  const result = await addArticleCommentApi(params)
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
// 处理点赞事件
const likeArticle = _.debounce(async () => {
  const params = {
    articleId: props.data._id,
    userId: userInfoStore.data.user._id,
    userName: userInfoStore.data.user.userName,
    email: userInfoStore.data.user.email,
  }
  const result = await likeArticleApi(params)
  const res = result.data
  console.log(res)
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

// 处理回复评论事件
const handleReplyComment = (comment: Comment) => {
  console.log('回复评论:', comment)
  // 可以在这里处理回复相关的逻辑
}

// Drawer 关闭后的回调
const closeDrawer = () => {
  showComment.value = false
}

// 浏览接口
const viewArticle = async () => {
  const params = {
    articleId: props.data._id,
    userId: userInfoStore.data.user._id,
    ip: deviceStore.ip,
  }
  const result = await viewArticleApi(params)
  const res = result.data
  if (res.code === 200) {
    state.views = res.data
  }
}

watch(
  () => props.showModal,
  (newVal) => {
    if (newVal) {
      activeDrawer.value = true
    }
  },
)

const getArticleDetailSignal = async () => {
  const response = await getAllBlogArticleApi(props.data._id)
  const res = response.data
  const resDetail = res.data.list[0]
  if (res.code === 200) {
    console.log(resDetail)
    comments.value = resDetail.comments
    state.comments = resDetail.comments.length
    state.likes = resDetail.likes.length
    state.views = resDetail.views.length
    articleContent.value = resDetail.content
  } else {
    message.error(res.message)
  }
}

watch(
  () => activeDrawer.value,
  (newVal) => {
    if (newVal) {
      getArticleDetailSignal()
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
:deep(.ql-toolbar) {
  display: none;
}
:deep(.ql-snow) {
  border: none;
}

body {
  .article-header-box {
    max-width: 1264px;
    min-width: 1040px;
    padding: 0 120px;
    position: relative;
    .article-comment-float {
      position: absolute;
      bottom: 0%;
      right: 0%;
      cursor: pointer;
    }
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
  .article-content-box {
    max-width: 1264px;
    min-width: 1040px;
    padding: 0 120px;
    position: relative;
    .article-comment-area,
    .article-comment-hide {
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
    .article-comment-hide {
      bottom: -100%;
    }
    .article-intro {
      background-color: var(--box-bg-color4);
      padding: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px 8px 0px 0px;
      border-bottom: 1px solid var(--box-bg-color5);
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
      background-color: var(--box-bg-color4);
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
