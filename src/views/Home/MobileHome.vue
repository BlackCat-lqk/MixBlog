<template>
  <div>H5 Home</div>
  <van-button type="default" @click="testGetData">笔记列表</van-button>
  <van-button type="default" @click="testGetDetail">笔记详情</van-button>
  <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <van-cell v-for="item in state.list" :key="item" :title="item.title" />
  </van-list>
</template>

<script lang="ts" setup>
import { apiNotesList, apiNotesDetail } from '@/http/randomNotes'
import { reactive } from 'vue'

const state = reactive({
  list: [],
  loading: false,
  finished: false
})
// 请求本地模拟数据
const testGetData = async () => {
  const res = await apiNotesList()
  state.list = res.data
  console.log(state.list)
}

const onLoad = () => {
  testGetData()
  state.finished = true
}

const testGetDetail = async (id='1') => {
  const res = await apiNotesDetail(id)
  console.log(res.data)
}


</script>

<style scoped lang="scss"></style>
