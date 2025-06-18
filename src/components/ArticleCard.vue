<template>
  <div
    class="article-cards-box"
    :style="{ gridTemplateColumns: 'repeat(' + props.articleData.columns + ', 1fr)' }"
  >
    <div class="article-card-box" v-for="(item, idx) in props.articleData.data" :key="idx">
      <div class="article-card-header">
        <div class="article-card-header-img">
          <img :src="item.cover" />
        </div>
        <div class="article-card-header-title">
          <h3>{{ item.title }}</h3>
          <p>{{ item.updatedAt }}</p>
        </div>
      </div>
      <div class="article-card-content">
        <p>
          {{ item.content }}
        </p>
      </div>
      <div class="article-card-footer">
        <span>分类：{{ item.category }}&nbsp;&nbsp;标签：{{ (item.tags).join('|') }}</span>
        <div>
          <span>
            <n-icon size="small">
              <img src="@/assets/images/CommentOutlined.svg" />
            </n-icon>
            0
          </span>
          <span>
            <n-icon size="small">
              <img src="@/assets/images/View.svg" />
            </n-icon>
            {{ item.views }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  articleData: {
    type: Object,
    default: () => {},
  },
})
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
    background-color: #fff;
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
          object-fit: cover;
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
      span {
        font-size: 14px;
        line-height: 1.54;
        color: #0b1926b8;
      }
    }
  }
}
</style>
