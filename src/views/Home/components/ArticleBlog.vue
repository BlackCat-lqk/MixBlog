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
import { reactive, onMounted } from 'vue'
import { getAllBlogArticleApi } from '@/http/blogArticle'
import { useMessage } from 'naive-ui'
const message = useMessage()

const router = useRouter()
const articleData = reactive({
  data: [],
  columns: 2,
})
const moreArticle = () => {
  router.push('/articles')
}
interface articelDataType {
  status: string
}
// 获取所有文章数据
const getAllBlogArticleData = async () => {
  const response = await getAllBlogArticleApi()
  const res = response.data
  if (res.code === 200) {
    articleData.data = res.data.list.filter((item: articelDataType) => item.status === 'published')

  } else {
    message.error(res.message)
  }
}

// 初始化文章数据
onMounted(() => {
  getAllBlogArticleData()
})
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
