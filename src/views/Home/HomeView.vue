<template>
  <div class="home">
    <banner-view></banner-view>
    <home-data></home-data>
    <article-blog></article-blog>
    <random-notes></random-notes>
    <photography-gallery></photography-gallery>
  </div>
</template>

<script lang="ts" setup>
import BannerView from './components/BannerView.vue'
import ArticleBlog from './components/ArticleBlog.vue'
import HomeData from './components/HomeData.vue'
import RandomNotes from './components/RandomNotes.vue'
import PhotographyGallery from './components/PhotographyGallery.vue'
import { recordVisitApi, getVisitorIpApi } from '@/http/visit'
import { getDeviceType } from '@/utils/deviceUtils'
import { useDeviceStore } from '@/stores/deviceInfo'

const deviceStore = useDeviceStore()
// 记录访问统计
const recordVisit = async () => {
  const userAgent = getDeviceType()
  const res = await getVisitorIpApi()
  const params = {
    userAgent,
    ipAddress: res.data.ip,
    ...res.data,
  }
  const response = await recordVisitApi(params)
  const result = response.data
  if (result.code === 200) {
    deviceStore.setDeviceInfo({ userAgent, ip: res.data.ip })
    return
  } else {
    return
  }
}

onMounted(() => {
  recordVisit()
})
</script>

<style scoped lang="scss">
.home {
  min-width: 1240px;
  max-width: 1480px;
  .home-data {
    height: 400px;
    display: flex;
    .home-data-detail {
      width: 316px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-right: 30px;
      & > div {
        flex: 0.44;
        background-image: linear-gradient(
          121deg,
          rgba(186, 255, 16, 0.1) 0%,
          rgba(255, 37, 243, 0.09) 100%
        );
        @include g.borderRadius(24px);
        padding: 32px 40px;
      }
    }
    .home-data-banner {
      flex: 1;
      @include g.borderRadius(24px);
      overflow: hidden;
      .carousel-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
