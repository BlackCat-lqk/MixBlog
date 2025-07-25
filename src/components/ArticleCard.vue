<template>
  <div
    class="article-cards-box"
    :style="{ gridTemplateColumns: 'repeat(' + props.articleData.columns + ', 1fr)' }"
  >
    <div
      class="article-card-box"
      v-for="(item, idx) in props.articleData.data"
      :key="idx"
      @click="articleClick(item)"
    >
      <div class="article-card-header">
        <div class="article-card-header-img">
          <img :src="item.cover" />
        </div>
        <div class="article-card-header-title">
          <h3>{{ item.title }}</h3>
          <p>{{ _formatTime(item.updatedAt) }}</p>
        </div>
      </div>
      <div class="article-card-content">
        <p>
          {{ item.intro }}
        </p>
      </div>
      <div class="article-card-footer">
        <span>
          分类:
          <n-tag :bordered="false">{{ item.category }}</n-tag>
          &nbsp;标签:
          <n-tag
            style="margin-right: 5px"
            v-for="(tag, idx) in item.tags"
            :key="idx"
            :bordered="false"
            round
            type="info"
          >
            {{ tag }}
          </n-tag>
        </span>
        <div class="views-comment-icon">
          <span>
            <n-icon>
              <img width="20px" src="@/assets/images/likes.svg" />
            </n-icon>
            {{ item.likes.length }}
          </span>
          <span>
            <n-icon>
              <img width="20px" src="@/assets/images/views.svg" />
            </n-icon>
            {{ item.views.length }}
          </span>
          <span>
            <n-icon>
              <img width="20px" src="@/assets/images/comment.svg" />
            </n-icon>
            {{ item.comments.length }}
          </span>
        </div>
      </div>
    </div>
  </div>
  <ArticleDetail v-model:showModal="showActiveDrawer" :data="articleDetail"></ArticleDetail>
</template>
<script setup lang="ts">
import { defineProps, reactive, ref } from 'vue'
import { _formatTime } from '@/utils/publickFun'
import ArticleDetail from '@/views/Article/ArticleDetail.vue'
const showActiveDrawer = ref(false)
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

interface articleDetailType {
  _id: string
  title: string
  content: string
  intro: string
  category: string
  updatedAt: string
  tags: string[]
  comments: Comment[],
  likes: LikeView[]
  views: LikeView[]
}
let articleDetail: articleDetailType = reactive({
  _id: '',
  title: '',
  content: '',
  intro: '',
  category: '',
  updatedAt: '',
  tags: [],
  comments: [],
  likes: [],
  views: []
})
const props = defineProps({
  articleData: {
    type: Object,
    default: () => {},
  },
})
const articleClick = (data: articleDetailType) => {
  articleDetail = data
  showActiveDrawer.value = true
}
</script>
<style lang="scss" scoped>
.article-cards-box {
  display: grid;
  gap: 32px 40px;
  justify-content: center;
  .article-card-box {
    border-radius: 16px;
    padding: 24px;
    margin-top: 28px;
    cursor: pointer;
    transition: all 0.2s;
    background-color: var(--box-bg-color1);
    box-shadow: 0 0 10px 0 var(--border-color);
    &:hover {
      .article-card-header-title h3 {
        color: #0aa9db;
      }
    }
    .article-card-header {
      margin-top: -53px;
      display: flex;
      align-items: center;
      gap: 24px;
      .article-card-header-img {
        width: 160px;
        height: 120px;
        border-radius: 5px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      .article-card-header-title {
        gap: 14px;
        padding-top: 16px;
        h3 {
          padding-top: 16px;
          font-size: 20px;
          line-height: 1.4;
          font-weight: 600;
          transition: all 0.2s;
          color: var(--text-color);
        }
        p {
          color: var(--text-color2);
          font-size: 14px;
          line-height: 1.54;
        }
      }
    }
    .article-card-content {
      height: 44px;
      padding: 15px 0;
      p {
        height: 44px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        font-size: 14px;
        line-height: 1.54;
        color: var(--text-color1);
      }
    }
    .article-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 14px;
        line-height: 1.54;
        color: var(--text-color2);
      }
      .views-comment-icon {
        display: flex;
        align-items: center;
        gap: 15px;
        span {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      }
    }
  }
}
</style>
