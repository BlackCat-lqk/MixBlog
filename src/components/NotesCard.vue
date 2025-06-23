<template>
  <div v-if="hasNote" class="random-notes-right-box">
    <n-card>
      <template #header>
        <div class="random-notes-title">
          <span>{{ props.notesDetail.title }}</span>
          <div class="random-notes-date">
            <p>{{ props.notesDetail.date }}</p>
            <n-icon size="20">
              <img src="@/assets/images/WeatherSunny.svg" alt="" />
            </n-icon>
          </div>
        </div>
      </template>
      <n-divider />
      <div class="random-notes-content">
        <p>
          {{ props.notesDetail.content }}
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

const props = defineProps({
  notesDetail: {
    type: Object,
    default: () => ({}),
  },
})

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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: calc(100% - 300px);
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
