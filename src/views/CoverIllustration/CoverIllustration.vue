<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <div class="i-cover-image-box">
    <!-- <n-marquee>
        <n-image width="192" height="108" src="@/assets/wallpaper/juequ2.png" />
      </n-marquee> -->
    <div class="cover-face-bg-box">
      <div class="marquee-box">
        <n-marquee auto-fill speed="24">
          <template #default>
            <div style="display: flex">
              <div class="photo-item">
                <n-image width="384" height="216" src="/uploads/fileList/juequ3.png" />
              </div>
            </div>
          </template>
        </n-marquee>
      </div>

      <div class="marquee2-box">
        <n-marquee auto-fill speed="24">
          <template #default>
            <div style="display: flex">
              <div class="photo-item">
                <n-image width="384" height="216" src="/uploads/fileList/juequ6.png" />
              </div>
            </div>
          </template>
        </n-marquee>
      </div>
    </div>
  </div>
  <footer>
    <FooterNav></FooterNav>
  </footer>
</template>

<script lang="ts" setup>
import HeaderNav from '@/views/Header/HeaderNav.vue'
import FooterNav from '@/views/Footer/FooterNav.vue'
</script>

<style lang="scss" scoped>
.i-cover-image-box {
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 64px);
  margin-top: 64px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url(@/assets/wallpaper/juequ1.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow-y: auto;
  .cover-face-bg-box {
    width: calc(100vw - 6px);
    height: 100%;
    backdrop-filter: blur(10px);
    .marquee-box {
      margin: 46px 20px;
      :deep(.n-marquee__group) {
        animation-direction: alternate-reverse;
      }
    }
    .marquee2-box {
      margin: 46px 20px;
      :deep(.n-marquee__group) {
        animation-direction: alternate;
      }
    }
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
</style>
