<template>
  <div class="random-notes-box">
    <div class="random-notes-title-box">
      <h1>随笔随记</h1>
      <p>我的日常记录...</p>
    </div>
    <div class="random-notes-content-box">
      <div class="random-notes-left-box">
        <div class="calendar">
          <n-calendar
            v-model:value="value"
            :is-date-disabled="isDateDisabled"
            @update:value="handleUpdateValue"
          >
          </n-calendar>
        </div>
        <div class="random-notes-text">
          <p>记录生活</p>
          <p>记录美好</p>
          <p>记录瞬间</p>
        </div>
      </div>
      <notes-card :notesDetail="notesDetail"></notes-card>
    </div>
    <div class="random-notes-more">
      <n-button tertiary round @click="moreNotes"> 更多 </n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { addDays, isYesterday } from 'date-fns'
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import NotesCard from '@/components/NotesCard.vue'
import { getNotesApi } from '@/http/notes'

const router = useRouter()
const value = ref(addDays(Date.now(), 1).valueOf())
const message = useMessage()

const moreNotes = () => {
  router.push('/random-notes')
}
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
const isSameDay = (dateStrWithTime: string, dateStr: string): boolean => {
  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

  const date1 = new Date(dateStrWithTime)
  const date2 = new Date(dateStr)

  return formatDate(date1) === formatDate(date2)
}
const handleUpdateValue = (
  _: number,
  { year, month, date }: { year: number; month: number; date: number },
) => {
  message.success(`${year}-${month}-${date}`)
  notesList.value.filter((item : NotesType) => {
    if(isSameDay(item.updatedAt, `${year}-${month}-${date}`)){
      notesDetail.value = item
    }
  })
}
const isDateDisabled = (timestamp: number) => {
  if (isYesterday(timestamp)) {
    return true
  }
  return false
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
    if(res.data.length > 0){
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
.random-notes-box {
  margin-top: 10vh;
  .random-notes-title-box {
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    h1 {
      font-size: 32px;
      line-height: 1.34;
      font-weight: 600;
      color: var(--text-color);
    }
    p {
      color: var(--sub-text-color);
      font-size: 14px;
      padding-left: 20px;
    }
  }
  .random-notes-content-box {
    display: flex;
    height: 700px;
    .random-notes-left-box {
      margin-right: 40px;
      flex: 0.4;
      .calendar {
        padding: 10px;
        border-radius: 10px;
        background-color: var(--box-bg-color1);
      }
      :deep(.n-calendar) {
        height: auto;
        .n-calendar-dates {
          flex: 0.5;
        }
      }
      .random-notes-text {
        p {
          padding: 20px 0;
        }
        & > p:nth-child(1) {
          font-size: 40px;
          line-height: 56px;
          font-weight: 600;
        }
        & > p:nth-child(2) {
          font-size: 64px;
          line-height: 90px;
          font-weight: 600;
          color: #0b19263d;
        }
        & > p:nth-child(3) {
          font-size: 32px;
          line-height: 46px;
        }
      }
    }
  }
  .random-notes-more {
    @include g.flexCenter;
    margin: 50px;
    @include g.moreBtn(94px, 48px);
  }
}
</style>
