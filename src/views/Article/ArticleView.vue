<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <div class="article-menu-box">
    <classify-meun :classify="classify"></classify-meun>
    <article-card :articleData="articleData"></article-card>
    <div class="more-btn">
      <n-button tertiary round> 加载更多 </n-button>
    </div>
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
import { reactive } from 'vue'
const articleData = reactive({
  data: 8,
  columns: 3,
})
const classify = reactive([
  {
    name: '全部',
    number: 8,
  },
  {
    name: '学习',
    number: 2,
  },
  {
    name: '总结',
    number: 1,
  },
  {
    name: '充电',
    number: 3,
  },
  {
    name: '爱好',
    number: 2,
  },
])
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
