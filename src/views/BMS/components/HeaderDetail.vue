<template>
  <div class="header-detail-box">
    <div class="title">{{ props.data.title }}</div>
    <div class="op-box">
      <n-button v-if="props.data?.url" strong type="info" @click="$router.push(props.data.url)">去新建</n-button>
      <n-input type="text" placeholder="搜索">
        <template #suffix>
          <img src=" /src/assets/images/Search.svg" alt="search" />
        </template>
      </n-input>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
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
  .op-box {
    display: flex;
    align-items: center;
    .n-input {
      margin-left: 10px;
    }
  }
}
</style>
