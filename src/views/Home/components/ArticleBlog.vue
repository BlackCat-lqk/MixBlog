<template>
  <div class="article-box">
    <div class="article-title-box">
      <h1>博客文章</h1>
      <p>我的所思、所想，像模像样的文章...</p>
    </div>
    <article-card :articleData="articleData"></article-card>
    <div class="article-more">
      <n-button tertiary round @click="moreArticle"> 更多 </n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import ArticleCard from '@/components/ArticleCard.vue'
import { reactive } from 'vue'

const router = useRouter()
const articleData = reactive({
  data: 4,
  columns: 2,
})
const moreArticle = () => {
  router.push('/articles')
}
</script>

<style scoped lang="scss">
.article-box {
  margin-top: 10vh;
  .article-title-box {
    color: var(--text-color);
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    h1 {
      font-size: 32px;
      line-height: 1.34;
      font-weight: 600;
    }
    p {
      color: var(--sub-text-color);
      font-size: 14px;
      padding-left: 20px;
    }
  }
  .article-more {
    @include g.flexCenter;
    margin: 50px;
    @include g.moreBtn(94px, 48px);
  }
}
</style>
