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
            <div v-for="(item, idx) in 8" :key="idx" class="published-content">
              <div class="title-box">
                <div class="title-box-left">
                  <h3>端午节{{ item }}</h3>
                  <img src="@/assets/images/Weather/snow.svg" />
                </div>
                <n-button class="delete-btn">
                  <img src="@/assets/images/Delete.svg" />
                </n-button>
              </div>
              <span>2025/05/31 12:02:32</span>
              <p>今天端午节，下午去看龙舟比赛，希望不要下雨哈哈哈</p>
              <div class="content-img-box"><img src="@/assets/wallpaper/nanning.jpg" /></div>
            </div>
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
      flex: 1;
      min-width: 320px;
      max-height: 100%;
      overflow-y: auto;
      .published-content {
        height: 180px;
        min-height: 180px;
        background-color: #2e33380d;
        margin-bottom: 20px;
        padding: 20px;
        display: flex;
        border-radius: 10px;
        flex-direction: column;
        .title-box {
          display: flex;
          justify-content: space-between;
          .title-box-left {
            img {
              width: 12px;
              height: 12px;
            }
          }
          .delete-btn {
            img {
              width: 12px;
              height: 12px;
            }
          }
        }
        .content-img-box {
          img {
            width: 84px;
            height: 84px;
          }
        }
      }
      .published-content:last-child {
        margin-bottom: 0;
      }
    }
    .edit-release-box {
      width: 680px;
      min-width: 440px;
      border: 1px solid #000;
    }
  }
}
</style>
