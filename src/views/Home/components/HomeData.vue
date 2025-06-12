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
      <n-carousel autoplay show-arrow>
        <div v-for="(item, idx) in state.banners" :key="idx" class="carousel-box">
          <div class="banner-config-box">
            <h3>{{ item.title }}</h3>
            <h4>{{ item.sub }}</h4>
            <n-button type="primary">{{ item.mainBtnName }}</n-button>
            <n-button strong secondary type="info">{{ item.childBtnName }}</n-button>
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

    &>div {
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

    .carousel-box {
      width: 100%;
      height: 100%;
      position: relative;

      .banner-config-box {
        position: absolute;
        left: 2%;
        top: 50%;
        color: #fff;
        z-index: 1;
        margin-top: 20px;

        h3,
        h4 {
          margin-bottom: 16px;
        }

        .n-button {
          margin-right: 16px;
        }
      }

      .carousel-img {
        position: absolute;
        width: 100%;
        height: 100%;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
}
</style>
