<template>
  <div class="Footer-main-box">
    <span>技术支持</span>
    <div class="technical-support" v-for="item in 1" :key="item">
      <div class="technical-support-item-box">
        <img src="/src/assets/images/chrome_frameworks_fund.png" />
      </div>
      <div class="technical-support-item-box">
        <img src="/src/assets/images/javascript_certification.png" />
      </div>
      <div class="technical-support-item-box">
        <img src="/src/assets/images/vuemastery.png" />
      </div>
      <div class="technical-support-item-box">
        <img src="/src/assets/images/vuemastery.png" />
      </div>
      <div class="technical-support-item-box">
        <img src="/src/assets/images/vuemastery.png" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
.Footer-main-box {
  width: 100%;
  border-top: 1px solid #ccc;
  background-color: rgb(255, 255, 255, 0.5);
  @include g.flexCenter;
  flex-direction: column;
  padding: 20px 0;
  span {
    display: inline-block;
    color: #474646;
    margin: 10px 0;
    &:nth-child(1) {
      font-size: 16px;
      font-weight: 600;
      color: #000;
    }
  }
  .technical-support {
    display: flex;
    .technical-support-item-box {
      width: 206px;
      height: 84px;
      background-color: #dfdfdf;
      margin: 0 5px;
      border-radius: 2px;
      padding: 10px;
      margin-bottom: 10px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
}
</style>
