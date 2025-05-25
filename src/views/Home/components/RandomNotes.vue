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
      <notes-card></notes-card>
    </div>
    <div class="random-notes-more">
      <n-button tertiary round @click="moreNotes"> 更多 </n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { addDays, isYesterday } from 'date-fns'
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import NotesCard from '@/components/NotesCard.vue'

const router = useRouter()
const value = ref(addDays(Date.now(), 1).valueOf())
const message = useMessage()

const moreNotes = () => {
  router.push('/random-notes')
}
const handleUpdateValue = (
  _: number,
  { year, month, date }: { year: number; month: number; date: number },
) => {
  message.success(`${year}-${month}-${date}`)
}
const isDateDisabled = (timestamp: number) => {
  if (isYesterday(timestamp)) {
    return true
  }
  return false
}
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
