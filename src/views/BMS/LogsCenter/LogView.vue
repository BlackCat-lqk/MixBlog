<template>
  <div class="bms-main-box">
    <div class="header-box">
      <header-view></header-view>
    </div>
    <div class="content-box">
      <div class="sidebar-box">
        <naviga-menu></naviga-menu>
      </div>
      <div class="main-router-box">正在开发中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
</script>

<style scoped lang="scss">
@include g.bms;
.main-router-box {
  padding: 10px;
  gap: 12px;
  display: flex;
  flex-direction: column;
  @include g.flexCenter;
  color: var(--text-color);
  font-size: 24px;
}
</style>
