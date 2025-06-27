<template>
  <div class="home-data" ref="homeDataRef">
    <div class="home-data-detail">
      <div class="total-data">
        <n-statistic tabular-nums>
          <n-number-animation ref="numberAnimationInstRef" :from="0" :to="99999" />
        </n-statistic>
        <p>总访问量</p>
      </div>
      <div class="today-data">
        <n-statistic tabular-nums>
          <n-number-animation ref="numberAnimationInstRef" :from="0" :to="99" />
        </n-statistic>
        <p>今日访问量</p>
      </div>
    </div>
    <div class="home-data-banner">
      <n-carousel autoplay show-arrow dot-type="line" interval="3000">
        <div v-for="(item, idx) in state.banners" :key="idx" class="carousel-box">
          <div class="mask-box"></div>
          <div class="banner-config-box">
            <h3>{{ item.title }}</h3>
            <h4>{{ item.sub }}</h4>
            <p>{{ item.introduction }}</p>
            <n-button type="primary" @click="redirectToExternal(item.mainBtnUrl)">{{
              item.mainBtnName
            }}</n-button>
            <n-button strong secondary type="info" @click="redirectToExternal(item.childBtnUrl)">{{
              item.childBtnName
            }}</n-button>
          </div>
          <div class="carousel-img">
            <img :src="item.cover" />
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
const scrollStore = useScrollStore()
const homeDataRef = ref()
interface bannerDataType {
  _id: string
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
})
const getBannerData = async () => {
  const res = await getAllBanners()
  state.banners = res.data.data
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
        background: linear-gradient(
          to right,
          rgba(201, 214, 255, 1) 0%,
          rgba(226, 226, 226, 0) 40%,
          rgb(182, 251, 255, 0) 60%,
          rgba(182, 251, 255, 0.5) 100%
        );
        z-index: 1;
      }
      .banner-config-box {
        position: absolute;
        left: 2%;
        top: 30%;
        z-index: 2;
        margin-top: 20px;
        h3 {
          font-size: 32px;
          color: #0b1926;
          line-height: 1.34;
          font-weight: 600;
        }
        h4 {
          font-size: 16px;
          line-height: 1.5;
          font-weight: 600;
          color: #0b1926;
          padding-top: 8px;
        }
        p {
          padding-top: 16px;
          color: #0b1926b8;
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
}
</style>
