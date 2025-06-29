<template>
  <div>H5 Home</div>
  <van-button type="default" @click="testGetData">笔记列表</van-button>
</template>

<script lang="ts" setup>
import { apiNotesList } from '@/http/randomNotes'
import { reactive } from 'vue'

const state = reactive({
  list: [],
  loading: false,
  finished: false,
})
// 请求本地模拟数据
const testGetData = async () => {
  const res = await apiNotesList()
  state.list = res.data
}
</script>

<style scoped lang="scss"></style>
