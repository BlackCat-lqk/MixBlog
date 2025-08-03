<template>
  <div class="home-data" ref="homeDataRef">
    <div class="home-data-detail">
      <div v-if="!stateLoading.statistics" class="skeleton-tatal-data">
        <div class="skeleton1">
          <n-skeleton height="48px" width="80px" round />
        </div>
        <div class="skeleton2">
          <n-skeleton height="40px" width="200px" round />
        </div>
      </div>
      <div v-else>
        <n-statistic tabular-nums>
          <n-number-animation ref="numberAnimationInstRef" :from="0" :to="state.totalCount" />
        </n-statistic>
        <p>{{ $t('homeData.total1') }}</p>
      </div>
      <div v-if="!stateLoading.statistics" class="skeleton-tatal-data">
        <div class="skeleton1">
          <n-skeleton height="48px" width="80px" round />
        </div>
        <div class="skeleton2">
          <n-skeleton height="40px" width="220px" round />
        </div>
      </div>
      <div v-else>
        <n-statistic tabular-nums>
          <n-number-animation ref="numberAnimationInstRef" :from="0" :to="state.todayCount" />
        </n-statistic>
        <p>{{ $t('homeData.total2') }}</p>
      </div>
    </div>
    <div
      v-if="!stateLoading.banner && !stateLoading.image"
      class="home-data-banner skeleton-banner"
    >
      <div class="skeleton1">
        <n-skeleton height="48px" width="220px" round />
      </div>
      <div class="skeleton2">
        <n-skeleton height="40px" width="280px" round />
      </div>
      <div class="skeleton3">
        <n-skeleton height="40px" width="320px" round />
      </div>
      <div class="skeleton4">
        <n-skeleton height="48px" width="120px" round />
        <n-skeleton height="48px" width="120px" round />
      </div>
      <div class="skeleton5">
        <div>
          <n-skeleton height="20px" width="80px" round />
          <n-skeleton height="20px" width="80px" round />
        </div>
      </div>
    </div>
    <div v-else class="home-data-banner">
      <n-carousel autoplay show-arrow dot-type="line" interval="3000" aria-hidden="false">
        <div v-for="(item, idx) in state.banners" :key="idx" class="carousel-box">
          <div class="mask-box"></div>
          <div class="banner-config-box">
            <p class="p-h3">{{ item.title }}</p>
            <p class="p-h4">{{ item.sub }}</p>
            <p>{{ item.introduction }}</p>
            <n-button type="primary" alt="main btn" @click="redirectToExternal(item.mainBtnUrl)">{{
              item.mainBtnName
            }}</n-button>
            <n-button
              strong
              secondary
              alt="sub btn"
              type="info"
              @click="redirectToExternal(item.childBtnUrl)"
              >{{ item.childBtnName }}</n-button
            >
          </div>
          <div class="carousel-img">
            <img :src="item.cover" alt="Banner cover" @load="onImageLoad" @error="onImageError" />
          </div>
        </div>
      </n-carousel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, reactive } from 'vue'
import { useScrollStore } from '@/stores/scrollStore'
import { getAllBanners } from '@/http/banner'
import { getVisitStatsApi } from '@/http/visit'
const scrollStore = useScrollStore()
const homeDataRef = ref()
interface bannerDataType {
  title: string
  sub: string
  introduction: string
  mainBtnName: string
  childBtnName: string
  mainBtnUrl: string
  childBtnUrl: string
  cover: string
}
const state = reactive({
  banners: [] as bannerDataType[],
  totalCount: 0,
  todayCount: 0,
})
const stateLoading = reactive({
  image: false, // 图片加载状态
  banner: false, // banner接口状态
  statistics: false, // 统计数据接口状态
})

// 图片加载完成事件
const onImageLoad = () => {
  stateLoading.image = true
}
// 图片加载失败事件
const onImageError = () => {
  stateLoading.image = false
}
// 获取banner图片数据
const getBannerData = async () => {
  const result = await getAllBanners()
  const res = result.data
  if (res.code == 200) {
    state.banners = res.data
    stateLoading.banner = true
  }
}
// 获取统计数据
const getStatisticsData = async () => {
  const response = await getVisitStatsApi()
  const res = response.data
  if (res.code == 200) {
    // 获取数据成功
    const data = res.data
    state.totalCount = data.totalCount
    state.todayCount = data.todayCount
    stateLoading.statistics = true
  }
}
const redirectToExternal = (url: string) => {
  window.open(url, '_blank')
}
watch(
  () => scrollStore.targetId,
  (newValue) => {
    if (newValue && homeDataRef.value) {
      homeDataRef.value.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  },
)
onMounted(() => {
  getStatisticsData()
  getBannerData()
})
</script>

<style scoped lang="scss">
.home-data {
  height: 400px;
  display: flex;
  scroll-margin-top: 80px;

  .home-data-detail {
    width: 316px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 30px;

    :deep(.n-statistic-value__content) {
      font-size: 48px;
      font-weight: 500;
      line-height: 48px;
      color: var(--text-color);
    }

    & > div {
      flex: 0.44;
      background-image: var(--box-bg-color);
      @include g.borderRadius(24px);
      padding: 32px 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      p {
        font-size: 24px;
        line-height: 48px;
        color: var(--text-color);
      }
    }
    .skeleton-tatal-data {
      padding: 0;
      position: relative;
      display: block;
      background-color: var(--box-bg-color1);
      background-image: none;
      .skeleton1 {
        position: absolute;
        left: 40px;
        top: 32px;
      }
      .skeleton2 {
        position: absolute;
        left: 40px;
        top: 88px;
      }
    }
  }

  .home-data-banner {
    flex: 1;
    @include g.borderRadius(24px);
    overflow: hidden;
    box-shadow: 0 0 10px rgba(46, 46, 46, 0.1);
    :deep(.n-carousel__arrow) {
      background-color: rgba(0, 0, 0, 0.2);
    }
    .carousel-box {
      width: 100%;
      height: 100%;
      position: relative;
      .mask-box {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: var(--box-bg-color2);
        z-index: 1;
      }
      .banner-config-box {
        position: absolute;
        left: 2%;
        top: 30%;
        z-index: 2;
        margin-top: 20px;
        .p-h3 {
          font-size: 32px;
          color: var(--text-color1);
          line-height: 1.34;
          font-weight: 600;
        }
        .p-h4 {
          font-size: 16px;
          line-height: 1.5;
          font-weight: 600;
          color: var(--text-color1);
          padding-top: 8px;
        }
        p {
          padding-top: 16px;
          color: var(--text-color2);
          font-size: 14px;
        }

        .n-button {
          width: 84px;
          margin-right: 16px;
          margin-top: 50px;
        }
      }

      .carousel-img {
        position: absolute;
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
  }
  .skeleton-banner {
    background-color: var(--box-bg-color1);
    position: relative;
    .skeleton1,
    .skeleton2,
    .skeleton3,
    .skeleton4,
    .skeleton5 {
      position: absolute;
      left: 2%;
      top: 30%;
    }
    .skeleton2 {
      top: calc(30% + 60px);
    }
    .skeleton3 {
      top: calc(30% + 108px);
    }
    .skeleton4 {
      top: calc(30% + 180px);
      display: flex;
      gap: 24px;
    }
    .skeleton5 {
      width: 100%;
      left: 0;
      top: calc(30% + 248px);
      display: flex;
      justify-content: space-between;
      & > div {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 2%;
      }
    }
  }
}
</style>
