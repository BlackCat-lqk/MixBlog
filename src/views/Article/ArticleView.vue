<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <div class="article-menu-box">
    <classify-meun :classify="classify" @classifyEmit="handleClassify"></classify-meun>
    <article-card :articleData="articleData"></article-card>
    <div class="more-btn" v-if="!isClassify">
      <n-button
        v-if="articleData.data.length < articleData.deepData.length"
        tertiary
        round
        @click="moreArticle"
      >
        {{ $t('common.more') }}
      </n-button>
      <n-gradient-text v-else type="info"> {{ $t('common.noMore') }} </n-gradient-text>
    </div>
    <div v-else class="more-btn"></div>
  </div>
  <footer>
    <FooterNav></FooterNav>
  </footer>
</template>

<script setup lang="ts">
import HeaderNav from '@/views/Header/HeaderNav.vue'
import FooterNav from '@/views/Footer/FooterNav.vue'
import ClassifyMeun from '@/components/ClassifyMeun.vue'
import ArticleCard from '@/components/ArticleCard.vue'
import { getAllBlogArticleApi } from '@/http/blogArticle'
import { useMessage } from 'naive-ui'
const { t } = useI18n()
import _ from 'lodash'
const message = useMessage()
const isClassify = ref(false)
const articleData = reactive({
  data: [],
  columns: 3,
  deepData: [],
})
const classifyAll = computed(() => t('common.all'))
const classify = reactive([
  {
    name: classifyAll.value,
    number: 0,
  },
])

interface articelDataType {
  status: string
  category: string
}
// 获取所有文章数据
const getAllBlogArticleData = async () => {
  const response = await getAllBlogArticleApi('')
  const res = response.data
  if (res.code === 200) {
    const listData = res.data.list.filter((item: articelDataType) => item.status === 'published')
    articleData.deepData = _.cloneDeep(listData)
    classify[0].number = res.data.pagination.total
    for (const key in res.data.stats.categories) {
      classify.push({
        name: key,
        number: res.data.stats.categories[key],
      })
    }
    articleData.data = listData.slice(0, 6)
  } else {
    message.error(res.message)
  }
}

// 加载更多文章
const moreArticle = () => {
  articleData.data = articleData.deepData.slice(0, articleData.data.length + 6)
}

// 过滤分类
const handleClassify = (name: string) => {
  const listData = _.cloneDeep(articleData.deepData)
  const filterData = listData.filter((item: articelDataType) => {
    return item.category === name
  })
  if (name === classifyAll.value) {
    isClassify.value = false
    articleData.data = listData.slice(0, 6)
  } else {
    isClassify.value = true
    articleData.data = filterData
  }
}

// 初始化文章数据
onMounted(() => {
  getAllBlogArticleData()
})
</script>

<style scoped lang="scss">
.article-menu-box {
  min-width: 1240px;
  max-width: 1480px;
  margin-top: 2vh;
  flex: 1;
  .more-btn {
    @include g.flexCenter;
    margin: 50px;
    @include g.moreBtn(94px, 48px);
  }
}
</style>
