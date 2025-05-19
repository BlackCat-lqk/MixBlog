<template>
  <div class="banner">
    <div class="banner-left">
      <div>
        <h1>杂糅</h1>
        <p>记录生活</p>
        <p>记录工作</p>
      </div>
      <div class="scroll-down-box">
        <div class="scroll-down">
          <n-icon size="40">
            <img src="@/assets/images/AngleDoubleDown.svg" alt="" />
          </n-icon>
        </div>
        <div class="relevant-address">
          <p>相关地址</p>
          <div class="address-list">
            <n-icon size="40">
              <img src="@/assets/images/Github.svg" alt="" />
            </n-icon>
            <n-icon size="40">
              <img src="@/assets/images/Blibli.svg" alt="" />
            </n-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="banner-pic">
      <img src="@/assets/images/logo2024.png" alt="" srcset="" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
.banner {
  display: flex;
  margin: 64px 0;
  .banner-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: self-end;
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
      flex-direction: column;
      align-items: self-end;
    }
    .scroll-down {
      height: 120px;
      width: 64px;
      border-radius: 34px;
      background-image: linear-gradient(180deg, g.$btnColor 0%, g.$btnColor 100%);
      text-align: center;
      padding-top: 52px;
      cursor: pointer;
      img {
        animation: scrollDown 1.5s ease-in-out infinite;
      }
    }
    h1 {
      font-size: 78px;
      font-weight: 600;
    }
    p {
      padding-top: 48px;
      padding-bottom: 64px;
      font-size: 64px;
      font-weight: 600;
    }
    .relevant-address {
      display: flex;
      align-items: center;
      P {
        padding: 0px;
        font-size: 14px;
        font-weight: normal;
      }
      .address-list {
        img {
          margin-left: 10px;
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
