<template>
  <div v-if="hasNote" class="random-notes-right-box">
    <n-card>
      <template #header>
        <div class="random-notes-title">
          <span>文章标题</span>
          <div class="random-notes-date">
            <p>2025-05-29</p>
            <n-icon size="20">
              <img src="@/assets/images/WeatherSunny.svg" alt="" />
            </n-icon>
          </div>
        </div>
      </template>
      <n-divider />
      <div class="random-notes-content">
        <p>
          短短的春节已经结束，我的2025年正式开启。无论是工作还是生活种种。从这一刻起，我要用一个全新的面貌去面对2025年。对于之前的种种遗憾和失落心情通通盖下定论就此翻过。让他们尘封在这一刻之前。接下来的一切都是崭新的，这一刻也都是崭新的。我要时刻关注我对新一年许下的心愿，和那些积极的规划。用全新的心态去迎接我对自己的挑战。让这些心愿都朝着设想的方向前进。一定是一个更好的自己在下一刻等着我。朋友们如果你对2025有所计划，让我们一起努力，一起去为自己加油吧！加油！加油！加油
        </p>
      </div>
    </n-card>
  </div>
  <div v-else class="random-notes-right-box no-note">
    <n-empty description="暂无内容">
      <template #extra>
        <n-button size="small"> 去写文章 </n-button>
      </template>
    </n-empty>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const hasNote = ref(true)
</script>

<style scoped lang="scss">
.random-notes-right-box {
  height: 100%;
  flex: 1;
  background-color: #fff;
  border-radius: 15px;
  @include g.borderRadius(10px);
  box-shadow: -4px 4px 8px 2px rgba(147, 146, 146, 0.5);
  :deep(.n-card.n-card--bordered) {
    height: 100%;
    .n-card-header {
      padding-bottom: 0;
    }
    .random-notes-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > span {
        font-size: 24px;
        line-height: 34px;
        font-weight: 600;
      }
      .random-notes-date {
        @include g.flexCenter;
        p {
          font-size: 16px;
          padding-right: 8px;
        }
      }
    }
    .random-notes-content {
      font-family: serif;
      font-size: 16px;
      line-height: 42px;
      text-align: justify;
      letter-spacing: 1px;
      padding: 0 10px;
      background-size: 12px 42px;
      text-decoration-line: underline;
      text-decoration-style: dashed;
      text-decoration-color: #ccc;
      text-underline-offset: 10px;
    }
  }
}
.no-note {
  @include g.flexCenter;
}
</style>
