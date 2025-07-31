<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <div class="random-notes-main">
    <div class="random-notes-list-box">
      <div class="random-notes-list">
        <div
          class="random-notes-list-item"
          v-for="(item, idx) in notesList"
          :key="idx"
          @click="handleNotesDetail(item)"
        >
          <div class="random-notes-list-date">
            <div class="note-date">
              <span>{{ _formatTime(item.updatedAt) }}</span>
            </div>
            <div class="note-whter"><img :src="weatherIconsURLs[item.weather]" /></div>
          </div>
          <div class="random-notes-list-content">
            <p>{{ item.title }}</p>
            <p class="note-content-p">{{ item.content }}</p>
            <img :src="item.cover" />
          </div>
        </div>
      </div>
    </div>
    <div class="random-notes-content">
      <notes-card :notesDetail="notesDetail"></notes-card>
    </div>
  </div>
  <footer>
    <FooterNav></FooterNav>
  </footer>
</template>

<script setup lang="ts">
import HeaderNav from '@/views/Header/HeaderNav.vue'
import FooterNav from '@/views/Footer/FooterNav.vue'
import NotesCard from '@/components/NotesCard.vue'
import { getNotesApi } from '@/http/notes'
import { _formatTime } from '@/utils/publickFun'
interface NotesType {
  id: string
  title: string
  content: string
  updatedAt: string
  weather: string
  cover: string
}
const notesList = ref<NotesType[]>([])
const notesDetail = ref<NotesType>({
  id: '',
  title: '',
  content: '',
  updatedAt: '',
  weather: '',
  cover: '',
})

const handleNotesDetail = (item: NotesType) => {
  notesDetail.value = item
}
interface WeatherIcons {
  [key: string]: string
}
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
// 获取所有笔记
const getAllNotes = async () => {
  const params = {
    title: '',
    weather: '',
  }
  const response = await getNotesApi(params)
  const res = response.data
  if (res.code == 200) {
    if (res.data.length > 0) {
      notesList.value = res.data
      notesDetail.value = res.data[0]
    }
  } else {
    console.log(res.message)
  }
}

onMounted(() => {
  getAllNotes()
})
</script>

<style scoped lang="scss">
.random-notes-main {
  min-width: 1240px;
  max-width: 1480px;
  flex: 1;
  display: flex;
  margin-bottom: 40px;
  margin-top: calc(2vh + 80px);
  gap: 56px;
  .random-notes-list-box {
    width: 424px;
    height: 900px;
    gap: 72px;
    display: flex;
    flex-direction: column;
    align-items: space-between;
    padding: 10px;
    background-color: var(--box-bg-color4);
    border-radius: 8px;
    .random-notes-list {
      display: grid;
      gap: 24px;
      grid-template-columns: repeat(auto-fill, minmax(1, 1fr)); /* 每个子元素最小200px，自动换行 */
      overflow: hidden;
      &:hover {
        @include g.scrollbarCustom;
        overflow: auto;
      }
      .random-notes-list-item {
        width: 100%;
        height: 100%;
        background-color: var(--box-bg-color1);
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        cursor: pointer;
        .random-notes-list-date {
          height: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          padding-bottom: 0;
          .note-date {
            span {
              display: flex;
              align-items: center;
              font-size: 12px;
              line-height: 1.62;
              color: var(--sub-text-color);
            }
          }
          .note-whter {
            width: 30px;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
        .random-notes-list-content {
          flex: 1;
          padding: 10px;
          padding-top: 0;
          img {
            width: 160px;
            height: 160px;
            border-radius: 8px;
            object-fit: cover;
            margin-top: 20px;
          }
          > p:first-child {
            font-size: 20px;
            line-height: 1.4;
            padding-bottom: 8px;
            font-weight: 600;
            color: var(--text-color);
          }
          .note-content-p {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            font-size: 14px;
            color: var(--text-color);
            text-rendering: optimizeLegibility;
            line-height: 1.54;
          }
        }
      }
    }
  }
  .random-notes-content {
    flex: 1;
    background-color: var(--box-bg-color1);
    border-radius: 5px;
    height: 920px;
  }
}
</style>
