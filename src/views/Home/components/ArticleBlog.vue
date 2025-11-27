<template>
  <div class="article-box">
    <div class="article-title-box">
      <h1>{{ $t('article.title') }}</h1>
      <p>{{ $t('article.subTitle') }}</p>
    </div>
    <article-card :articleData="articleData"></article-card>
    <div class="article-more">
      <n-button tertiary round @click="moreArticle"> {{ $t('common.more') }} </n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ArticleCard from '@/components/ArticleCard.vue'
import { getAllBlogArticleApi } from '@/http/blogArticle'
import { getArticleCachedData } from '@/utils/apiCache'
import { useMessage } from 'naive-ui'
import type { HomeArticleBlogType as articelDataType } from '@/tsInterface'
const message = useMessage()

const router = useRouter()
const articleData = reactive({
  data: [],
  columns: 2,
})
const moreArticle = () => {
  router.push('/articles')
}
// 获取所有文章数据
const getAllBlogArticleData = async () => {
  const response = await getArticleCachedData('', getAllBlogArticleApi)
  const res = response.data
  if (res.code === 200) {
    articleData.data = res.data.list
      .filter((item: articelDataType) => item.status === 'published')
      .slice(0, 4)
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
    margin: 40px 0;
    @include g.moreBtn(94px, 48px);
    .n-button {
      color: var(--text-color);
    }
  }
}
</style>
