<template>
  <div class="home-data">
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
      <n-carousel autoplay>
        <img
          class="carousel-img"
          src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
        />
        <img
          class="carousel-img"
          src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
        />
        <img
          class="carousel-img"
          src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg"
        />
        <img
          class="carousel-img"
          src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg"
        />
      </n-carousel>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
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
    :deep(.n-statistic-value__content) {
      font-size: 48px;
      font-weight: 500;
      line-height: 48px;
    }
    & > div {
      flex: 0.44;
      background-image: linear-gradient(
        121deg,
        rgba(186, 255, 16, 0.1) 0%,
        rgba(255, 37, 243, 0.09) 100%
      );
      @include g.borderRadius(24px);
      padding: 32px 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      p {
        font-size: 24px;
        line-height: 48px;
      }
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
</style>
