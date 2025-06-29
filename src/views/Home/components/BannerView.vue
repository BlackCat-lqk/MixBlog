<template>
  <div class="banner">
    <div class="banner-pic">
      <img :src="sloganStore.sloganConfig.cover" alt="" srcset="" />
    </div>
    <div class="banner-left">
      <div>
        <div>
          <h1>
            <n-gradient-text type="info">
              {{ sloganStore.sloganConfig.sloganTitle }}
            </n-gradient-text>
          </h1>
          <p>
            <n-gradient-text type="danger">
              {{ sloganStore.sloganConfig.sloganSub1 }}
            </n-gradient-text>
          </p>
          <p>
            <n-gradient-text type="warning">
              {{ sloganStore.sloganConfig.sloganSub2 }}
            </n-gradient-text>
          </p>
        </div>
        <div></div>
      </div>
      <div class="scroll-down-box">
        <div class="scroll-down" @click="handelScrollDown">
          <n-icon size="40">
            <img
              v-if="themeStore.currentTheme == 'light'"
              src="@/assets/images/AngleDoubleDown.svg"
            />
            <img v-else src="@/assets/images/AngleDoubleDownWhite.svg" />
          </n-icon>
        </div>
        <div class="relevant-address">
          <p>相关地址</p>
          <div class="address-list">
            <div
              class="address-img-box"
              @click="redirectToExternal('https://github.com/BlackCat-lqk/MixBlog')"
            >
              <n-icon size="40">
                <img v-if="themeStore.currentTheme == 'light'" src="@/assets/images/Github.svg" />
                <img v-else src="@/assets/images/GithubWhite.svg" />
              </n-icon>
            </div>
            <div
              class="address-img-box"
              @click="
                redirectToExternal('https://space.bilibili.com/154164424?spm_id_from=333.1007.0.0')
              "
            >
              <n-icon size="40">
                <img v-if="themeStore.currentTheme == 'light'" src="@/assets/images/Blibli.svg" />
                <img v-else src="@/assets/images/BlibliWhite.svg" />
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
import { useSloganInfoStore } from '@/stores/configInfo'
import { useThemeStore } from '@/stores/themeStore'
const themeStore = useThemeStore()
const sloganStore = useSloganInfoStore()

const scrollStore = useScrollStore()
const handelScrollDown = () => {
  const nowDate = new Date()
  scrollStore.scrollTo('scorll' + nowDate)
}
const redirectToExternal = (url: string) => {
  window.open(url, '_blank')
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
      font-size: 86px;
      font-weight: 600;
      letter-spacing: 0.44em;
      padding-top: 30px;
      font-family: 'Courier New', Courier, monospace;
      span {
        display: inline;
      }
    }
    p {
      padding-top: 20px;
      font-size: 78px;
      font-weight: 600;
      letter-spacing: 0.1em;
      font-family: 'Courier New', Courier, monospace;
    }
    .relevant-address {
      display: flex;
      align-items: flex-end;
      P {
        padding: 0px;
        font-size: 24px;
        line-height: 36px;
        font-weight: normal;
        font-family: 'Courier New', Courier, monospace;
        color: var(--text-color);
      }
      .address-list {
        display: flex;
        align-items: center;
        .address-img-box {
          width: 50px;
          height: 50px;
          border-radius: 15px;
          margin-left: 20px;
          @include g.flexCenter;
          cursor: pointer;
          border: 1px solid #ccc;
          &:hover {
            border: 1px solid #5dc0fe;
          }
          img {
            width: 100%;
            height: 100%;
          }
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
