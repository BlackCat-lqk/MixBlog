<template>
  <div
    class="article-cards-box"
    :style="{ gridTemplateColumns: 'repeat(' + props.articleData.columns + ', 1fr)' }"
  >
    <div class="article-card-box" v-for="(item, idx) in props.articleData.data" :key="idx" @click="articleClick(item)">
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
          >
            {{ tag }}
          </n-tag>
        </span>
        <div>
          <span>
            <n-icon>
              <img src="@/assets/images/CommentOutlined.svg" />
            </n-icon>
            0
          </span>
          <span>
            <n-icon>
              <img src="@/assets/images/View.svg" />
            </n-icon>
            {{ item.views }}
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
interface articleDetailType {
  title: string
  content: string
  intro: string
  category: string
  updatedAt: string
  tags: string[]
}
let articleDetail: articleDetailType = reactive({
  title: '',
  content: '',
  intro: '',
  category: '',
  updatedAt: '',
  tags: []
})
const props = defineProps({
  articleData: {
    type: Object,
    default: () => {},
  },
})
const articleClick = (data: articleDetailType) => {
  showActiveDrawer.value = true
  articleDetail = data
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
    width: 380px;
    min-width: 380px;
    max-width: 380px;
    margin-top: 28px;
    cursor: pointer;
    transition: all 0.2s;
    background-color: #fff;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
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
        }
        p {
          color: #0b19267a;
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
        color: #0b1926;
      }
    }
    .article-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 14px;
        line-height: 1.54;
        color: #0b1926b8;
      }
    }
  }
}
</style>
