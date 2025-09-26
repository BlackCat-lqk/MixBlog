<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <div class="article-menu-box">
    <classify-meun :classify="classify" @classifyEmit="handleClassify"></classify-meun>
    <div class="search-box">
      <GradientFlow class-name="gradient-box">
        <template #content>
          <n-input
            style="--n-border-hover: none; --n-border-focus: none"
            v-model:value="searchArticle"
            type="text"
            clearable
            placeholder="输入文章标题/内容搜索"
            @input="handleSearch"
          />
        </template>
      </GradientFlow>
    </div>

    <article-card :articleData="articleData"></article-card>
    <div class="more-btn" v-if="!isClassify && articleData.data.length">
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
import GradientFlow from '@/views/MixLab/components/GradientFlow.vue'
import { getAllBlogArticleApi } from '@/http/blogArticle'
import { useMessage } from 'naive-ui'
const { t } = useI18n()
import _ from 'lodash'
const message = useMessage()
const isClassify = ref(false)
const searchArticle = ref('')
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
  title: string
  intro: string
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

// 搜索文章
const handleSearch = _.debounce((value: string) => {
  if (!value) {
    handleClassify('全部')
  } else {
    const listData = _.cloneDeep(articleData.deepData)
    articleData.data = listData.filter((item: articelDataType) => {
      return (
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.intro.toLowerCase().includes(value.toLowerCase())
      )
    })
  }
  console.log(value)
}, 300)

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
  .search-box {
    width: 100%;
    height: 40px;
    position: relative;
    display: flex;
    justify-content: center;
    margin-bottom: 80px;
    .gradient-box {
      width: 360px;
      border-radius: 30px;
      border: 2px solid transparent;
      :deep(.n-input) {
        width: 100%;
        height: 100%;
        border-radius: 30px;
        .n-input__input-el {
          height: 100%;
        }
        .n-input__input-el:hover {
          border: none;
        }
      }
    }
  }
  .more-btn {
    @include g.flexCenter;
    margin: 50px;
    @include g.moreBtn(94px, 48px);
  }
}
</style>
