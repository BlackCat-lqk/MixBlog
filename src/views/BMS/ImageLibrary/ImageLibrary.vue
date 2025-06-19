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
        <header-detail :data="headerData"></header-detail>
        <div style="padding: 20px 0">
          <classify-manage></classify-manage>
        </div>
        <div class="list-photo-box">
          <div class="photo-box" v-for="(item, idx) in state.photoLibraryData" :key="idx">
            <div class="images-box">
              <div class="top-mix-image">
                <img :src="item.photos[0]" />
              </div>
              <div class="footer-image-box">
                <div v-for="(photo, idx) in item.photos.length > 3 ? item.photos.slice(0, 3) : item.photos" :key="idx"
                  class="footer-image-item">
                  <img :src="photo" />
                </div>
                <template v-if="item.photos.length < 3">
                  <div v-for="n in (3 - item.photos.length)" :key="'placeholder' + n"
                    class="footer-image-item placeholder"></div>
                </template>
                <div v-show="item.photos.length > 3" class="footer-image-item more-overlay">
                  +{{ item.photos.length - 3 }}
                </div>
              </div>
            </div>
            <div class="photo-desc">
              <h3>{{ item.title }}</h3>
              <div class="photo-desc-info">
                <div>
                  <span>喜欢：{{ item.likes }}</span>
                  <span>查看：{{ item.views }}</span>
                </div>

                <span>{{ _formatTime(item.updatedAt) }}</span>
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
import { reactive, onMounted } from 'vue'
import { getPhotoLibraryApi } from '@/http/photoLibrary'
import { useMessage } from 'naive-ui'
import { _formatTime } from '@/utils/publickFun'

const message = useMessage()
const headerData = reactive({
  title: '摄影图库',
  url: '/bms/editPhoto',
})
interface PhotoLibraryType {
  _id: string
  title: string
  photos: string
  likes: number
  views: number
  updatedAt: string
}
interface StateType {
  photoLibraryData: Array<PhotoLibraryType>
}
const state: StateType = reactive({
  photoLibraryData: [],
})

// 获取图库列表数据
const getPhotoLibraryData = async () => {
  const response = await getPhotoLibraryApi()
  const res = response.data
  if (res.code == 200) {
    state.photoLibraryData = res.data
    message.success(res.message)
  } else {
    message.error(res.message)
  }

}

onMounted(() => {
  getPhotoLibraryData()
})

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
          .placeholder {
            background-color: #999;
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
