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
        <div style="padding: 20px 0">
          <classify-manage></classify-manage>
        </div>
        <div class="list-photo-box">
          <div class="photo-box" v-for="(item, idx) in 8" :key="idx">
            <div class="images-box">
              <div class="top-mix-image">
                <img src="@/assets/wallpaper/nanning.jpg" />
              </div>
              <div class="footer-image-box">
                <div class="footer-image-item">
                  <img src="@/assets/wallpaper/about.jpg" />
                </div>
                <div class="footer-image-item">
                  <img src="@/assets/wallpaper/about1.png" />
                </div>
                <div class="footer-image-item">
                  <img src="@/assets/wallpaper/login-register-item2.jpg" />
                </div>
              </div>
            </div>
            <div class="photo-desc">
              <h3>Title</h3>
              <div class="photo-desc-info">
                <div>
                  <span>喜欢1</span>
                  <span>查看1</span>
                </div>

                <span>2025.5.31</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import HeaderDetail from '@/views/BMS/components/HeaderDetail.vue'
import ClassifyManage from '@/views/BMS/components/ClassifyManage.vue'
const title = '摄影图库'
</script>

<style lang="scss" scoped>
@include g.bms;
.main-router-box {
  padding: 10px;
  gap: 12px;
  .list-photo-box {
    display: flex;
    flex-wrap: wrap;
    gap: 32px;
    .photo-box {
      display: flex;
      flex-direction: column;
      .images-box {
        display: flex;
        flex-direction: column;
        width: 238px;
        height: 240px;
        border-radius: 10px;
        overflow: hidden;
        .top-mix-image {
          width: 100%;
          height: 160px;
          margin-bottom: 2px;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .footer-image-box {
          display: flex;
          .footer-image-item {
            width: 78px;
            height: 78px;
            margin-right: 2px;
            &:last-child {
              margin-right: 0;
            }
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
      }
      .photo-desc {
        display: flex;
        flex-direction: column;
        margin-top: 20px;
        h3 {
          font-size: 16px;
          line-height: 1.34;
          font-weight: bold;
        }
        .photo-desc-info {
          display: flex;
          justify-content: space-between;
          padding-top: 10px;
          span {
            margin: 0 5px;
            font-size: 12px;
            color: #999;
            line-height: 1.34;
          }
        }
      }
    }
  }
}
</style>
