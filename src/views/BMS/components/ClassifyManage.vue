<template>
  <div class="classify-manage-box">
    <div class="classify-box">
      <n-tag size="large" round v-for="(item, idx) in 27" :key="idx">
        分类{{ item }}：
        <span>99</span>
      </n-tag>
      <div v-if="isAddInput">
        <n-input :style="{ width: '240px' }"> </n-input>
        <n-button type="primary" ghost @click="isAddInput = !isAddInput"> 取消 </n-button>
        <n-button type="info"> 确认 </n-button>
      </div>

      <n-button v-else secondary round strong @click="isAddInput = !isAddInput">
        <img src=" @/assets/images/Add.svg" />
        Add
      </n-button>
    </div>
    <div class="manage-option-box">
      <n-button secondary strong @click="showModal = true">
        <img src=" @/assets/images/seting.svg" />
        管理分组
      </n-button>
    </div>
    <div>
      <n-modal
        v-model:show="showModal"
        preset="dialog"
        title="确认"
        content="你确认"
        positive-text="确认"
        negative-text="算了"
        @positive-click="showModal = false"
        @negative-click="showModal = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isAddInput = ref(false)
const showModal = ref(false)
</script>

<style scoped lang="scss">
.classify-manage-box {
  display: flex;
  justify-content: space-between;
  background-color: #2e33380d;
  padding: 10px;
  border-radius: 8px;
  .classify-box {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    img {
      width: 16px;
    }
    span {
      font-size: 16px;
      color: #000;
      font-weight: 600;
    }
  }
  .manage-option-box {
    display: flex;
    height: 100%;
    img {
      width: 16px;
    }
  }
}
</style>
