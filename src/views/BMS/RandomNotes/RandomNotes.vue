<template>
  <div class="bms-main-box">
    <div class="header-box">
      <header-view></header-view>
    </div>
    <div class="content-box">
      <div class="sidebar-box">
        <naviga-menu></naviga-menu>
      </div>
      <div class="main-router-box">
        <header-detail :title="title"></header-detail>
        <div class="list-notes-box">
          <div class="published-box">
            <div v-for="(item, idx) in 8" :key="idx" class="published-content"></div>
          </div>
          <div class="edit-release-box"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import HeaderDetail from '@/views/BMS/components/HeaderDetail.vue'
const title = '随笔随记'

</script>

<style lang="scss" scoped>
@include g.bms;
.main-router-box {
  padding: 10px;
  gap: 12px;
  .list-notes-box {
    display: flex;
    padding-top: 20px;
    max-height: 84vh;
    height: 90vh;
    .published-box {
      width: 320px;
      max-height: 100%;
      overflow-y: auto;
      border: 1px solid #000;
      .published-content {
        height: 240px;
      }
    }
    .edit-release-box {
      flex: 1;
      border: 1px solid #000;
    }
  }

}
</style>
