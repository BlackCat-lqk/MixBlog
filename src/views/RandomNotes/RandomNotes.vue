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
              <span>{{ item.date }}</span>
            </div>
            <div class="note-whter"><img src="@/assets/images/WeatherSunny.svg" /></div>
          </div>
          <div class="random-notes-list-content">
            <p>{{ item.title }}</p>
            <p>{{ item.content }}</p>
          </div>
        </div>
      </div>
      <div class="random-notes-comment"></div>
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
import { ref, onMounted } from 'vue'
import type { NoteItem } from '@/apiType/note'

const notesList = ref<NoteItem[]>([])
const notesDetail = ref<NoteItem>({
  id: '',
  title: '',
  content: '',
  date: '',
})

const handleNotesDetail = (item: NoteItem) => {
  notesDetail.value = item
}

onMounted(async () => {
  try {
    const res = await fetch('/api/notes/list')
    const data = await res.json()
    notesList.value = data.data
  } catch (error) {
    console.error('请求失败:', error)
  }
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
    gap: 56px;
    display: flex;
    flex-direction: column;
    align-items: space-between;
    padding: 0px 5px;
    .random-notes-list {
      height: 680px;
      min-height: 640px;
      display: grid;
      gap: 24px;
      overflow: auto;
      grid-template-columns: repeat(auto-fill, minmax(1, 1fr)); /* 每个子元素最小200px，自动换行 */
      grid-auto-rows: 180px;
      @include g.scrollbarCustom;
      padding-right: 10px;
      .random-notes-list-item {
        width: 100%;
        height: 100%;
        background-color: #fff;
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
          > p:first-child {
            font-size: 20px;
            line-height: 1.4;
            padding-bottom: 8px;
            font-weight: 600;
          }
          > p:last-child {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .random-notes-comment {
      height: 240px;
      background-color: #fff;
      margin-right: 16px;
      border-radius: 15px;
    }
  }
  .random-notes-content {
    flex: 1;
    background-color: #fff;
    border-radius: 5px;
  }
}
</style>
