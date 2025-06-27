<template>
  <div class="photo-gallery-box">
    <div class="photo-gallery-switch-box">
      <div class="photo-gallery-title">
        <h1>摄影图库</h1>
        <p>将美好的回忆和漂亮的相片留下来...</p>
      </div>
      <div class="photo-gallery-switch">
        <n-button tertiary round @click="getPrevious" :disabled="state.step <= 0">
          <n-icon>
            <img src="@/assets/images/ArrowLeft.svg" alt="left" />
          </n-icon>
        </n-button>
        <n-button tertiary round  @click="getNext" :disabled="state.step >= state.dataCount">
          <n-icon>
            <img src="@/assets/images/ArrowRight.svg" alt="left" />
          </n-icon>
        </n-button>
      </div>
    </div>
    <div
      class="photo-gallery-centent"
      :style="{ backgroundImage: 'url(' + photoItem.photos[0] + ')' }"
      @click="handleDetailImage(photoItem)"
    >
      <div class="photo-gallery-bg"></div>
      <div class="photo-gallery-desc">
        <div class="photo-gallery-title">
          <h1>{{ photoItem.title }}</h1>
          <div class="photo-gallery-title-data">
            <p>{{ photoItem.updatedAt }}</p>
            <div>
              <span>
                <n-icon size="small">
                  <img src="@/assets/images/CommentOutlined.svg" />
                </n-icon>
                12
              </span>
              <span>
                <n-icon size="small">
                  <img src="@/assets/images/View.svg" />
                </n-icon>
                24
              </span>
            </div>
          </div>
        </div>
        <div class="photo-gallery-desc-p">
          <p>{{ photoItem.content }}</p>
        </div>
      </div>
      <div v-if="photoItem.photos.length > 0" class="photo-gallery-preview">
        <n-marquee auto-fill>
            <div style="display: flex">
              <div class="photo-item" v-for="(item, idx) in photoItem.photos" :key="idx">
                <img :src="item" />
              </div>
            </div>

        </n-marquee>
      </div>
    </div>
    <div class="more-box">
      <n-button tertiary round @click="morePhotography"> 更多 </n-button>
    </div>
  </div>
  <ImageDetail v-model:showModal="showActiveDrawer" :data="imagesDetail"></ImageDetail>
</template>

<script lang="ts" setup>
import ImageDetail from '@/views/ImageLibrary/ImageDetail.vue'
import { useRouter } from 'vue-router'
import { reactive, onMounted, ref } from 'vue'
import { getPhotoLibraryApi } from '@/http/photoLibrary'
const router = useRouter()
const showActiveDrawer = ref(false)
interface photoItemType {
  title: string
  photos: string[]
  content: string
  updatedAt: string
  category: string
}
const photoItem = ref<photoItemType>({
  title: '',
  photos: [],
  content: '',
  updatedAt: '',
  category: '',
})
const state = reactive({
  photoLibrary: [],
  step: 0,
  dataCount: 0,
})
let imagesDetail: photoItemType = reactive({
  title: '',
  content: '',
  category: '',
  updatedAt: '',
  photos: []
})
// 获取图库信息
const getPhotoLibrary = async () => {
  const response = await getPhotoLibraryApi()
  const res = response.data
  if (res.code == 200) {
    state.step = 0
    state.dataCount = 0
    state.photoLibrary = res.data.list
    if (res.data.list.length > 0) {
      photoItem.value = state.photoLibrary[0]
      state.dataCount = res.data.list.length - 1
    }
  } else {
    console.log('获取图库列表失败')
  }
}
// 切换上一页
const getPrevious = () => {
  console.log(state.step)
  if (state.step > 0) {
    state.step--
    photoItem.value = {
      ...photoItem.value,
      photos: [],
    }
    photoItem.value = state.photoLibrary[state.step]
  }
}
// 切换下一页
const getNext = () => {
  console.log(state.step)
  if (state.step < state.dataCount) {
    state.step++
    photoItem.value = {
      ...photoItem.value,
      photos: [],
    }
    photoItem.value = state.photoLibrary[state.step]
  }
}
// 查看图片详情
const handleDetailImage = (data: photoItemType) => {
  showActiveDrawer.value = true
  imagesDetail = data
}
const morePhotography = () => {
  router.push('/image-library')
}
onMounted(() => {
  getPhotoLibrary()
})
</script>

<style scoped lang="scss">
.photo-gallery-box {
  display: flex;
  flex-direction: column;
  margin: 10vh 0;
  .photo-gallery-switch-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    .n-button {
      width: 94px;
      height: 48px;
      margin-left: 10px;
    }
    .photo-gallery-title {
      display: flex;
      align-items: center;
      h1 {
        font-size: 32px;
        line-height: 1.34;
        font-weight: 600;
      }
      p {
        color: #0b1926b8;
        font-size: 14px;
        padding-left: 20px;
      }
    }
  }
  .photo-gallery-centent {
    height: 768px;
    width: 100%;
    overflow: hidden;
    border-radius: 8px 0 0 8px;
    position: relative;
    // background-image: url('@/assets/wallpaper/login-register-item.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    .photo-gallery-bg {
      position: absolute;
      cursor: pointer;
      right: 0;
      height: 100%;
      width: 100%;
      background-image: linear-gradient(90deg, rgba(244, 242, 236, 0) 0%, #f4f2ec 100%);
      backdrop-filter: blur(1px);
    }
    .photo-gallery-desc {
      position: absolute;
      width: 30%;
      top: 40px;
      right: 0;
      @include g.borderRadius(10px);
      .photo-gallery-title {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        h1 {
          font-size: 32px;
          line-height: 1.34;
          font-weight: 600;
          margin: 4px 0px;
        }
        p {
          font-size: 16px;
          line-height: 32px;
          text-align: justify;
        }
        .photo-gallery-title-data {
          display: flex;
          align-items: center;
          justify-content: space-between;
          > div {
            display: flex;
          }
          p {
            font-size: 14px;
            line-height: 1.54;
            color: #0b1926;
          }
          span {
            font-size: 14px;
            line-height: 1.54;
            color: #0b19267a;
            margin-left: 15px;
          }
        }
      }
      .photo-gallery-desc-p {
        padding-top: 10px;
        font-size: 16px;
        line-height: 32px;
        text-align: justify;
      }
    }
    .photo-gallery-preview {
      position: absolute;
      width: 60%;
      height: 180px;
      bottom: 40px;
      left: 40px;
      @include g.borderRadius(10px);
      .photo-item {
        width: 200px;
        height: 180px;
        @include g.flexCenter;
        margin-right: 20px;
        @include g.borderRadius(8px);
        vertical-align: middle;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
  .more-box {
    @include g.flexCenter;
    margin: 40px 0;
    @include g.moreBtn(94px, 48px);
  }
}
</style>
