<template>
  <div class="article-box">
    <div class="article-title-box">
      <h1>博客文章</h1>
      <p>我的所思、所想，像模像样的文章...</p>
    </div>
    <div class="article-cards-box">
      <div class="article-card-box" v-for="(item, idx) in 4" :key="idx">
        <n-card
          :segmented="{
            content: true,
            footer: 'soft',
          }"
        >
          <template #header>
            <div class="article-card-title">
              <div class="article-card-title-img">
                <img src="@/assets/wallpaper/login-register-item2.jpg" />
              </div>
              <div class="article-card-title-text">
                <h1>我的个人博客</h1>
                <p>2025-5-22</p>
              </div>
            </div>
          </template>
          卡片内容
          <template #footer> #footer </template>
        </n-card>
      </div>
    </div>
    <div class="article-more">
      <n-button tertiary round> 更多 </n-button>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

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
  .article-cards-box {
    display: grid;
    grid-template-columns: minmax(480px, 1000px) minmax(480px, 1000px);
    gap: 32px 40px;
    justify-content: center;
    .article-card-box {
      border-radius: 16px;
      padding: 24px;
      padding-left: 0;
      width: 100%;
      margin-top: 28px;
      height: 216px;
      cursor: pointer;
      transition: all 0.2s;
      .article-card-title {
        display: flex;
        .article-card-title-img {
          width: 160px;
          height: 120px;
          position: relative;
          margin-right: 10px;
          img {
            position: absolute;
            width: 100%;
            height: 100%;
            bottom: 50px;
            border-radius: 5px;
          }
        }
        .article-card-title-text {
          h1 {
            color: var(--text-color);
          }
          p {
            color: var(--sub-text-color);
          }
        }
      }
    }
  }
  .article-more {
    @include g.flexCenter;
    margin: 50px;
  }
}
</style>
