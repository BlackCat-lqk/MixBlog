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
        <div class="list-tag-box">
          <n-list hoverable clickable>
            <n-list-item v-for="(item, idx) in 5" :key="idx">
              <div class="list-content">
                <img class="cover-img" src="@/assets/wallpaper/about.jpg" />
                <div class="list-content-detail">
                  <h3>iPhone 17：未来科技的巅峰之作</h3>
                  <div class="footer-box">
                    <p>科技|产品</p>
                    <p>2023-03-01</p>
                    <div>
                      <img src="@/assets/images/View.svg" />
                      <span>1</span>
                    </div>
                    <div>
                      <img src="@/assets/images/Like.svg" />
                      <span>0</span>
                    </div>
                    <div>
                      <img src="@/assets/images/CommentOutlined.svg" />
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="option-box">
                <div class="option-btn">
                  <img src="@/assets/images/Rollback.svg" />
                  <img src="@/assets/images/Edit.svg" />
                  <img src="@/assets/images/Delete.svg" />
                </div>
              </div>
            </n-list-item>
          </n-list>
          <div class="tags-box">
            <div class="tags-title">
              <span>标签</span>
              <n-button secondary strong>
                <img src=" @/assets/images/seting.svg" />
                管理分组
              </n-button>
            </div>
            <div class="tags-list">
              <n-tag size="large" round v-for="(item, idx) in 5" :key="idx">
                标签{{ item }}：
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
import { ref } from 'vue'

const title = '博客文章'
const isAddInput = ref(false)
</script>

<style lang="scss" scoped>
@include g.bms;
.main-router-box {
  padding: 10px;
  gap: 12px;
  .list-tag-box {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    .n-list {
      flex: 1;
    }
    :deep(.n-list-item) {
      background-color: #2e33380d;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 15px;
      &:last-child {
        margin-bottom: 0;
      }
      .n-list-item__main {
        display: flex;
        justify-content: space-between;
      }
      .list-content {
        height: 160px;
        display: flex;
        .cover-img {
          width: 180px;
          height: 100%;
          object-fit: cover;
          margin-right: 15px;
          border-radius: 8px;
        }
        .list-content-detail {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 15px 0;
          h3 {
            font-size: 18px;
            font-weight: 600;
            line-height: 1.34;
          }
          .footer-box {
            display: flex;
            justify-content: space-evenly;
            gap: 18px;
            div {
              display: flex;
              align-items: center;
            }
            img {
              width: 14px;
            }
          }
        }
      }
      .option-box {
        width: 450px;
        height: 160px;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        .option-btn {
          display: flex;
          justify-content: flex-end;
          img {
            width: 24px;
            margin-left: 15px;
          }
        }
      }
    }
    .tags-box {
      width: 320px;
      background-color: #2e33380d;
      padding: 10px;
      .tags-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        span {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }
        img {
          width: 16px;
        }
      }
      .tags-list {
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
    }
  }
}
</style>
