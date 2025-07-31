<template>
  <div class="photo-gallery-box">
    <div class="photo-gallery-switch-box">
      <div class="photo-gallery-title">
        <h1>{{ $t('photo.title') }}</h1>
        <p>{{ $t('photo.subTitle') }}</p>
      </div>
      <div class="photo-gallery-switch">
        <n-button tertiary round @click="getPrevious" :disabled="state.step <= 0">
          <n-icon>
            <img
              v-if="themeStore.currentTheme == 'light'"
              src="@/assets/images/ArrowLeft.svg"
              alt="prove"
            />
            <img v-else src="@/assets/images/ArrowLeftWhite.svg" alt="prove" />
          </n-icon>
        </n-button>
        <n-button tertiary round @click="getNext" :disabled="state.step >= state.dataCount">
          <n-icon>
            <img
              v-if="themeStore.currentTheme == 'light'"
              src="@/assets/images/ArrowRight.svg"
              alt="next"
            />
            <img v-else src="@/assets/images/ArrowRightWhite.svg" alt="next" />
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
            <p>{{ _formatTime(photoItem.updatedAt) }}</p>
            <div class="views-comment-icon">
              <span>
                <img width="20px" src="@/assets/images/likes.svg" alt="likes" />
                {{ photoItem.likes.length }}
              </span>
              <span>
                <img width="20px" src="@/assets/images/views.svg" alt="views" />
                {{ photoItem.views.length }}
              </span>
              <span>
                <img width="20px" src="@/assets/images/comment.svg" alt="comment" />
                {{ photoItem.comments.length }}
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
          <template #default>
            <div style="display: flex">
              <div class="photo-item" v-for="(item, idx) in photoItem.photos" :key="idx">
                <img :src="item" alt="photo" loading="lazy" />
              </div>
            </div>
          </template>
        </n-marquee>
      </div>
    </div>
    <div class="more-box">
      <n-button tertiary round @click="morePhotography"> {{ $t('common.more') }} </n-button>
    </div>
  </div>
  <ImageDetail v-model:showModal="showActiveDrawer" :data="imagesDetail"></ImageDetail>
</template>

<script lang="ts" setup>
import ImageDetail from '@/views/ImageLibrary/ImageDetail.vue'
import { getPhotoLibraryApi } from '@/http/photoLibrary'
import { useThemeStore } from '@/stores/themeStore'
import { _formatTime } from '@/utils/publickFun'
const themeStore = useThemeStore()
const router = useRouter()
const showActiveDrawer = ref(false)
export interface Comment {
  _id: string
  userId: string
  userName: string
  avatar: string
  content: string
  parentId: string | null
  createdAt: string
  children?: Comment[]
}

export interface LikeView {
  userId: string
  userName: string
  email: string
  viewedAt: string
  likedAt: string
}
interface photoItemType {
  _id: string
  title: string
  photos: string[]
  content: string
  updatedAt: string
  category: string
  comments: Comment[]
  likes: LikeView[]
  views: LikeView[]
}
const photoItem = ref<photoItemType>({
  _id: '',
  title: '',
  photos: [],
  content: '',
  updatedAt: '',
  category: '',
  comments: [],
  likes: [],
  views: [],
})
const state = reactive({
  photoLibrary: [],
  step: 0,
  dataCount: 0,
})
let imagesDetail: photoItemType = reactive({
  _id: '',
  title: '',
  content: '',
  category: '',
  updatedAt: '',
  photos: [],
  comments: [],
  likes: [],
  views: [],
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
    console.log('error')
  }
}
// 切换上一页
const getPrevious = () => {
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
        color: var(--text-color);
        font-size: 32px;
        line-height: 1.34;
        font-weight: 600;
      }
      p {
        color: var(--sub-text-color);
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
      background-image: var(--box-bg-color3);
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
          color: var(--text-color);
          font-size: 32px;
          line-height: 1.34;
          font-weight: 600;
          margin: 4px 0px;
        }
        p {
          color: var(--sub-text-color);
          font-size: 16px;
          line-height: 32px;
          text-align: justify;
        }
        .photo-gallery-title-data {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .views-comment-icon {
            display: flex;
            align-items: center;
            gap: 15px;
            padding-right: 20px;
            span {
              display: flex;
              align-items: center;
              gap: 8px;
            }
          }
          p {
            font-size: 14px;
            line-height: 1.54;
            color: var(--sub-text-color);
          }
          span {
            font-size: 14px;
            line-height: 1.54;
            color: var(--sub-text-color);
            margin-left: 15px;
          }
        }
      }
      .photo-gallery-desc-p {
        color: var(--text-color);
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
