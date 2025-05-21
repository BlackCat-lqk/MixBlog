<template>
  <div class="banner">
    <div class="banner-pic">
      <img src="@/assets/images/logo2024.png" alt="" srcset="" />
    </div>
    <div class="banner-left">
      <div>
        <div>
          <h1><n-gradient-text type="info"> 杂糅 </n-gradient-text></h1>
          <p><n-gradient-text type="danger"> 记录生活 </n-gradient-text></p>
          <p><n-gradient-text type="warning"> 记录工作 </n-gradient-text></p>
        </div>
        <div></div>
      </div>
      <div class="scroll-down-box">
        <div class="scroll-down" @click="handelScrollDown">
          <n-icon size="40">
            <img src="@/assets/images/AngleDoubleDown.svg" alt="" />
          </n-icon>
        </div>
        <div class="relevant-address">
          <p>相关地址</p>
          <div class="address-list">
            <div class="address-img-box">
              <n-icon size="40">
                <img src="@/assets/images/Github.svg" alt="" />
              </n-icon>
            </div>
            <div class="address-img-box">
              <n-icon size="40">
                <img src="@/assets/images/Blibli.svg" alt="" />
              </n-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useScrollStore } from '@/stores/scrollStore'

const scrollStore = useScrollStore()
const handelScrollDown = () => {
  const nowDate = new Date()
  scrollStore.scrollTo('scorll' + nowDate)
}
</script>

<style scoped lang="scss">
.banner {
  display: flex;
  margin: 64px 0;
  align-items: center;
  .banner-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-right: 80px;
    @keyframes scrollDown {
      0% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(10px);
      }
      100% {
        transform: translateY(0);
      }
    }
    .scroll-down-box {
      width: 100%;
      display: flex;
      margin-top: 40px;
    }
    .scroll-down {
      height: 80px;
      width: 64px;
      border-radius: 34px;
      background-image: linear-gradient(180deg, g.$btnColor 0%, g.$btnColor 100%);
      text-align: center;
      padding-top: 52px;
      margin-right: 40px;
      cursor: pointer;
      img {
        animation: scrollDown 1.5s ease-in-out infinite;
      }
    }
    h1 {
      font-size: 98px;
      font-weight: 600;
      letter-spacing: 0.54em;
      padding-top: 30px;
    }
    p {
      padding-top: 20px;
      font-size: 78px;
      font-weight: 600;
      letter-spacing: 0.1em;
    }
    .relevant-address {
      display: flex;
      align-items: flex-end;
      P {
        padding: 0px;
        font-size: 24px;
        line-height: 36px;
        font-weight: normal;
      }
      .address-list {
        display: flex;
        align-items: center;
        .address-img-box {
          width: 50px;
          height: 50px;
          background-color: #ccc;
          border-radius: 15px;
          margin-left: 20px;
          @include g.flexCenter;
          cursor: pointer;
        }
      }
    }
  }
  .banner-pic {
    flex: 1;
    img {
      width: 80%;
      height: 80%;
      object-fit: cover;
    }
  }
}
</style>
