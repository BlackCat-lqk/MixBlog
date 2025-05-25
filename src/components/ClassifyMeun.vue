<template>
  <div class="classify-box">
    <div class="classify-item-box">
      <div class="classify-item-box-bg">
        <div class="classify-item" v-for="(item, idx) in props.classify" :key="idx">
          <span>{{ item.name }}{{ item.number }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
interface ClassifyItem {
  name: string
  number: number
}
const props = defineProps<{
  classify: ClassifyItem[]
}>()
</script>

<style scoped lang="scss">
.classify-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 80px 0 40px 0;
  .classify-item-box {
    @include g.flexCenter;
    flex: 1;
    .classify-item-box-bg {
      background-color: #fff;
      @include g.flexCenter;
      @include g.borderRadius(8px);
    }
  }
  .classify-item {
    width: 77px;
    @include g.flexCenter;
    height: 50px;
    margin: 5px 10px;
    background-color: #fff;
    @include g.borderRadius(8px);
    &:hover {
      background-color: #bab8b8;
      cursor: pointer;
    }
  }
}
</style>
