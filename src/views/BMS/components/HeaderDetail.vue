<template>
  <div class="header-detail-box">
    <div class="title">{{ props.title }}</div>
    <div>
      <n-input type="text" placeholder="搜索">
        <template #suffix>
          <img src=" /src/assets/images/Search.svg" alt="search" />
        </template>
      </n-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
})
</script>

<style scoped lang="scss">
.header-detail-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    font-size: 24px;
    line-height: 1.34;
    font-weight: 600;
    color: #1e2025;
  }
  img {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
}
</style>
