<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <div class="image-library-out-box">
    <classify-meun :classify="classify" @classifyEmit="handleClassify"></classify-meun>
    <div class="image-library-box">
      <div
        class="image-library-box-item"
        v-for="(item, idx) in photoData.data"
        :key="idx"
        :style="{ backgroundImage: 'url(' + item.photos[0] + ')' }"
        @click="handleDetailImage(item)"
      >
        <div class="image-numbers">
          <p>{{ item.photos.length }}</p>
        </div>
        <div class="image-desc">
          <p class="title">{{ item.title }}</p>
          <p class="introduce">
            {{ item.content }}
          </p>
        </div>
      </div>
    </div>
    <div class="more-btn" v-if="!isClassify">
      <n-button
        v-if="photoData.data.length < photoData.deepData.length"
        tertiary
        round
        @click="moreArticle"
      >
        {{ $t('common.loadMore') }}
      </n-button>
      <n-gradient-text v-else type="info"> {{ $t('common.noMore') }} </n-gradient-text>
    </div>
    <div v-else class="more-btn"></div>
  </div>
  <footer>
    <FooterNav></FooterNav>
  </footer>
  <ImageDetail v-model:showModal="showActiveDrawer" :data="imagesDetail"></ImageDetail>
</template>

<script setup lang="ts">
import ImageDetail from '@/views/ImageLibrary/ImageDetail.vue'
import HeaderNav from '@/views/Header/HeaderNav.vue'
import FooterNav from '@/views/Footer/FooterNav.vue'
import ClassifyMeun from '@/components/ClassifyMeun.vue'
import { getPhotoLibraryApi } from '@/http/photoLibrary'
import { useMessage } from 'naive-ui'
import _ from 'lodash'
import type { ImagePhotoDetailType as dataType } from '@/tsInterface'
const { t } = useI18n()
const showActiveDrawer = ref(false)
const message = useMessage()
const isClassify = ref(false)
const photoData = reactive({
  data: [] as dataType[],
  columns: 3,
  deepData: [],
})
const classifyAll = computed(() => t('common.all'))
const classify = reactive([
  {
    name: classifyAll,
    number: 0,
  },
])
interface photoDataType {
  category: string
}
let imagesDetail: dataType = reactive({
  _id: '',
  title: '',
  content: '',
  category: '',
  createdAt: '',
  photos: [],
  comments: [],
  likes: [],
  views: [],
})
// 查看图库详情
const handleDetailImage = (data: dataType) => {
  showActiveDrawer.value = true
  imagesDetail = data
}
// 获取所有图片数据
const getAllPhotoData = async () => {
  const response = await getPhotoLibraryApi()
  const res = response.data
  if (res.code === 200) {
    const listData = res.data.list
    photoData.deepData = _.cloneDeep(listData)
    classify[0].number = res.data.pagination.total
    for (const key in res.data.stats.categories) {
      classify.push({
        name: key,
        number: res.data.stats.categories[key],
      })
    }
    photoData.data = listData.slice(0, 6)
  } else {
    message.error(res.message)
  }
}
// 加载更多图库
const moreArticle = () => {
  photoData.data = photoData.deepData.slice(0, photoData.data.length + 6)
}
// 过滤分类
const handleClassify = (name: string) => {
  const listData = _.cloneDeep(photoData.deepData)
  const filterData = listData.filter((item: photoDataType) => {
    return item.category === name
  })
  if (name === '全部') {
    isClassify.value = false
    photoData.data = listData.slice(0, 6)
  } else {
    isClassify.value = true
    photoData.data = filterData
  }
}
// 初始化图库数据
onMounted(() => {
  getAllPhotoData()
})
</script>

<style scoped lang="scss">
.image-library-out-box {
  min-width: 1480px;
  max-width: 1480px;
  margin-top: 2vh;
  flex: 1;
  .image-library-box {
    padding-top: 32px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    justify-content: center;
    .image-library-box-item {
      width: 100%;
      height: 472px;
      background-color: #fff;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      overflow: hidden;
      opacity: 0.88;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      @include g.borderRadius(24px);
      .image-numbers {
        position: absolute;
        right: 24px;
        top: 24px;
        width: 32px;
        height: 32px;
        background-color: #0000003d;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        p {
          color: #fff;
        }
      }
      .image-desc {
        gap: 8px;
        position: absolute;
        width: 100%;
        height: 168px;
        overflow: hidden;
        bottom: -128px;
        left: 0;
        padding: 120px 24px 0;
        transition: all 0.2s;
        background-image: linear-gradient(180deg, #0000, #0000008f);
        .title {
          font-size: 20px;
          line-height: 1.4;
          font-weight: 600;
          color: #fff;
        }
        .introduce {
          width: 100%;
          color: #fff;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 6;
          line-clamp: 6;
          text-overflow: ellipsis;
          transition: all 0.2s;
          opacity: 0;
          font-size: 14px;
          line-height: 1.54;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
      }
      &:hover {
        opacity: 1;
        .image-desc {
          bottom: 0;
        }
        .introduce {
          opacity: 1;
        }
      }
    }
  }
  .more-btn {
    @include g.flexCenter;
    margin: 50px;
    @include g.moreBtn(94px, 48px);
  }
}
</style>
