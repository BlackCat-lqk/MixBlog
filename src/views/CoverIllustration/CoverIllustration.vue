<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <div :class="showxq ? 'i-cover-image-xq-box' : 'i-cover-image-box'">
    <div v-if="!showSearchModel" class="filter-search-box" @click="showSearchModel = true">
      <img src="@/assets/images/more.svg" alt="more" />
    </div>
    <div v-else class="search-options-box">
      <div class="close-img-box">
        <img src="@/assets/images/close.svg" @click="showSearchModel = false" alt="close" />
      </div>
      <!-- <div class="search-input-box">
        <n-input placeholder="搜索">
          <template #prefix>
            <img src="@/assets/images/searchIconfont.svg" />
          </template>
        </n-input>
      </div> -->
      <div v-if="true" class="classify-card-box" v-prevent-scroll-passthrough>
        <n-grid :x-gap="12" :y-gap="8" :cols="2">
          <n-grid-item>
            <n-card hoverable class="xq-bg" @click="showxq = true"
              ><span class="card-text">星球大战</span>
            </n-card>
          </n-grid-item>
          <n-grid-item>
            <n-card hoverable @click="showxq = false"
              ><span class="card-text">ZZZ 绝区零</span>
            </n-card>
          </n-grid-item>
        </n-grid>
      </div>
      <div v-else>
        <n-empty description="什么都没有"> </n-empty>
      </div>
    </div>
    <div v-if="!showxq" class="cover-face-bg-box">
      <MarqueeView :items="imageArray1" direction="left" :speed="20"></MarqueeView>
      <MarqueeView :items="imageArray2" direction="right" :speed="18"></MarqueeView>
      <MarqueeView :items="imageArray3" direction="left" :speed="20"></MarqueeView>
      <MarqueeView :items="imageArray4" direction="right" :speed="18"></MarqueeView>
    </div>
    <div v-else class="cover-face-bg-box">
      <MarqueeView :items="imageArrayxq1" direction="left" :speed="20"></MarqueeView>
      <MarqueeView :items="imageArrayxq2" direction="right" :speed="18"></MarqueeView>
      <MarqueeView :items="imageArrayxq3" direction="left" :speed="20"></MarqueeView>
      <MarqueeView :items="imageArrayxq4" direction="right" :speed="18"></MarqueeView>
    </div>
  </div>
  <footer>
    <FooterNav></FooterNav>
  </footer>
</template>

<script lang="ts" setup>
import HeaderNav from '@/views/Header/HeaderNav.vue'
import FooterNav from '@/views/Footer/FooterNav.vue'
import MarqueeView from '@/views/CoverIllustration/MarqueeView.vue'

const showSearchModel = ref(false)
const showxq = ref(true)
const imageArray1 = [
  '/uploads/fileList/juequ1.webp',
  '/uploads/fileList/juequ2.webp',
  '/uploads/fileList/juequ3.webp',
]
const imageArray2 = [
  '/uploads/fileList/juequ4.webp',
  '/uploads/fileList/juequ5.webp',
  '/uploads/fileList/juequ6.webp',
]
const imageArray3 = [
  '/uploads/fileList/juequ7.webp',
  '/uploads/fileList/juequ8.webp',
  '/uploads/fileList/juequ9.webp',
]
const imageArray4 = [
  '/uploads/fileList/juequ10.webp',
  '/uploads/fileList/juequ11.webp',
  '/uploads/fileList/juequ12.webp',
]
const imageArrayxq1 = [
  '/uploads/fileList/xq1.webp',
  '/uploads/fileList/xq2.webp',
  '/uploads/fileList/xq3.webp',
]
const imageArrayxq2 = [
  '/uploads/fileList/xq4.webp',
  '/uploads/fileList/xq5.webp',
  '/uploads/fileList/xq6.webp',
]
const imageArrayxq3 = [
  '/uploads/fileList/xq7.webp',
  '/uploads/fileList/xq8.webp',
  '/uploads/fileList/xq9.webp',
]
const imageArrayxq4 = [
  '/uploads/fileList/xq10.webp',
  '/uploads/fileList/xq11.webp',
  '/uploads/fileList/xq12.webp',
]
</script>

<style lang="scss" scoped>
.i-cover-image-box,
.i-cover-image-xq-box {
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 64px);
  margin-top: 64px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url('/uploads/fileList/juequ1.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow-y: auto;
  position: relative;
  .filter-search-box {
    position: fixed;
    left: 50%;
    top: 64px;
    transform: translate(-50%, 0%);
    background: linear-gradient(to right, #667db6, #00c8be, #00c861, #667db6);
    z-index: 1;
    width: 180px;
    border-radius: 0 0 10px 10px;
    backdrop-filter: blur(5px);
    padding: 10px 20px;
    display: flex;
    justify-content: center;
    cursor: pointer;
    &:hover {
      box-shadow: 0 0 10px 3px rgb(145, 234, 228, 0.5);
      img {
        scale: 1.044;
        transition: all 0.3s ease;
      }
    }
    img {
      width: 40px;
      height: 40px;
    }
  }
  .search-options-box {
    position: fixed;
    left: 50%;
    top: 64px;
    transform: translate(-50%, 0%);
    z-index: 1;
    width: 600px;
    min-height: 400px;
    background-color: rgba(218, 223, 227, 0.9);
    backdrop-filter: blur(5px);
    box-shadow: 0 0 10px 3px rgba(52, 62, 62, 0.5);
    border-radius: 0 0 10px 10px;
    .close-img-box {
      display: flex;
      justify-content: end;
      padding: 8px;
      img {
        width: 28px;
        height: 28px;
        cursor: pointer;
        &:hover {
          rotate: 180deg;
          transition: all 0.5s ease;
        }
      }
    }
    .search-input-box {
      padding: 5px 20px;
      .n-input {
        img {
          width: 20px;
        }
      }
    }
    .classify-card-box {
      padding: 5px 20px;
      height: auto;
      max-height: 500px;
      overflow-y: auto;
      @include g.scrollbarCustom;
      :deep(.n-card) {
        @include g.borderRadius(10px);
        background: url('/uploads/fileList/juequ3.webp');
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        .n-card__content {
          padding: 40px;
          display: flex;
          justify-content: center;
          background-color: rgba(212, 212, 212, 0.3);
          backdrop-filter: blur(5px);
          @include g.borderRadius(5px);
          cursor: pointer;
        }
        .card-text {
          font-size: 18px;
          font-weight: 600;
          text-align: center;
        }
      }
      .xq-bg {
        background: url('/uploads/fileList/xq12.webp');
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        @include g.borderRadius(10px);
      }
    }
  }
  .cover-face-bg-box {
    width: calc(100vw - 6px);
    height: 100%;
    backdrop-filter: blur(10px);
    padding-top: 80px;
  }
  .photo-item {
    width: 384px;
    height: 216px;
    margin-left: 20px;
    border-radius: 10px;
    :deep(image) {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.5);
      object-fit: cover;
    }
  }
}
.i-cover-image-xq-box {
  background-image: url('/uploads/fileList/xq12.webp');
}
</style>
