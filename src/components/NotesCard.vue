<template>
  <div v-if="hasNote" class="random-notes-right-box">
    <n-card>
      <template #header>
        <div class="random-notes-title">
          <span>{{ props.notesDetail.title }}</span>
          <div class="random-notes-date">
            <p>{{ _formatTime(props.notesDetail.updatedAt).time }}</p>
            <n-icon size="20">
              <img :src="weatherIconsURLs[props.notesDetail.weather]" alt="weather" />
            </n-icon>
          </div>
        </div>
      </template>
      <n-divider />
      <div class="random-notes-content">
        <p>
          {{ props.notesDetail.content }}
        </p>
        <img :src="props.notesDetail.cover" loading="lazy" alt="笔记内容图片" />
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
import { _formatTime } from '@/utils/publickFun'
import type { IWeatherIcons as WeatherIcons } from '@/tsInterface'

const props = defineProps({
  notesDetail: {
    type: Object,
    default: () => ({}),
  },
})
const weatherIconsURLs: WeatherIcons = {
  cloudy: new URL('@/assets/images/Weather/cloudy.svg', import.meta.url).href,
  overcast: new URL('@/assets/images/Weather/overcast.svg', import.meta.url).href,
  pour: new URL('@/assets/images/Weather/pour.svg', import.meta.url).href,
  rain: new URL('@/assets/images/Weather/rain.svg', import.meta.url).href,
  snow: new URL('@/assets/images/Weather/snow.svg', import.meta.url).href,
  sun: new URL('@/assets/images/Weather/sun.svg', import.meta.url).href,
  thunderstorm: new URL('@/assets/images/Weather/thunderstorm.svg', import.meta.url).href,
  wind: new URL('@/assets/images/Weather/wind.svg', import.meta.url).href,
}

const hasNote = ref(true)
</script>

<style scoped lang="scss">
.random-notes-right-box {
  height: 100%;
  flex: 1;
  background-color: var(--box-bg-color1);
  border-radius: 15px;
  @include g.borderRadius(10px);
  box-shadow:
    rgba(240, 46, 170, 0.4) -5px 5px,
    rgba(240, 46, 170, 0.3) -10px 10px,
    rgba(240, 46, 170, 0.2) -15px 15px,
    rgba(240, 46, 170, 0.1) -20px 20px,
    rgba(240, 46, 170, 0.05) -25px 25px;
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
      img {
        margin-top: 20px;
        width: auto;
        max-width: 100%;
        max-height: 500px;
        height: auto;
        object-fit: cover;
        border-radius: 8px;
      }
    }
    .n-card__content {
      overflow-y: auto;
      @include g.scrollbarCustom;
    }
  }
}
.no-note {
  @include g.flexCenter;
}
</style>
