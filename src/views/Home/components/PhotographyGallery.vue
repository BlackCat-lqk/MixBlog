<template>
  <div class="photo-gallery-box">
    <div class="photo-gallery-switch-box">
      <div class="photo-gallery-title">
        <h1>摄影图库</h1>
        <p>将美好的回忆和漂亮的相片留下来...</p>
      </div>
      <div class="photo-gallery-switch">
        <n-button tertiary round>
          <template #icon>
            <n-icon>
              <img src="@/assets/images/ArrowLeft.svg" alt="left" />
            </n-icon>
          </template>
        </n-button>
        <n-button tertiary round>
          <template #icon>
            <n-icon>
              <img src="@/assets/images/ArrowRight.svg" alt="left" />
            </n-icon>
          </template>
        </n-button>
      </div>
    </div>
    <div class="photo-gallery-centent">
      <div class="photo-gallery-bg"></div>
      <div class="photo-gallery-desc">
        <h1>作品集1</h1>
        <div>
          <p>2024-9-8</p>
        </div>
        <div>
          <p>东北的冷真的冰冷刺骨，没有预备多厚的衣物，大腿皮肤都被冷风撕裂好多处。</p>
        </div>
      </div>
      <div class="photo-gallery-preview">
        <n-marquee auto-fill>
          <template #default>
            <div style="display: flex">
              <div class="photo-item">
                <img src="@/assets/wallpaper/login-register-item.jpg" />
              </div>
              <div class="photo-item">
                <img src="@/assets/wallpaper/login-register-item2.jpg" />
              </div>
            </div>
          </template>
        </n-marquee>
      </div>
    </div>
    <div class="more-box">
      <n-button tertiary round> 更多 </n-button>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
.photo-gallery-box {
  display: flex;
  flex-direction: column;
  .photo-gallery-switch-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    .photo-gallery-title {
      display: flex;
      align-items: center;
      h1 {
        font-size: 32px;
        line-height: 1.34;
        font-weight: 600;
      }
      p {
        color: #0b1926b8;
        font-size: 14px;
        padding-left: 20px;
      }
    }
  }
  .photo-gallery-centent {
    height: 768px;
    width: 100%;
    overflow: hidden;
    @include g.borderRadius(10px);
    position: relative;
    background-image: url('@/assets/wallpaper/login-register-item.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    .photo-gallery-bg {
      position: absolute;
      cursor: pointer;
      right: 0;
      height: 100%;
      width: 100%;
      background-image: linear-gradient(90deg, rgba(244, 242, 236, 0) 0%, #f4f2ec 100%);
    }
    .photo-gallery-desc {
      position: absolute;
      width: 30%;
      height: 100%;
      top: 0;
      right: 0;
      @include g.borderRadius(10px);
      h1 {
        font-size: 32px;
        line-height: 1.34;
        font-weight: 600;
        margin: 4px 0px;
      }
      p {
        width: 400px;
        font-size: 16px;
        line-height: 32px;
        text-align: justify;
      }
    }
    .photo-gallery-preview {
      position: absolute;
      width: 60%;
      height: 180px;
      bottom: 40px;
      left: 40px;
      @include g.borderRadius(10px);
      .photo-item {
        width: 200px;
        height: 180px;
        @include g.flexCenter;
        margin-right: 20px;
        @include g.borderRadius(8px);
        vertical-align: middle;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
  .more-box {
    @include g.flexCenter;
    margin: 40px 0;
  }
}
</style>
