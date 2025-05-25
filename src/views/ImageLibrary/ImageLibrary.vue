<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <div class="image-library-out-box">
    <classify-meun :classify="classify"></classify-meun>
    <div class="image-library-box">
      <div class="image-library-box-item" v-for="(item, idx) in 8" :key="idx">
        <div class="image-numbers">
          <p>4</p>
        </div>
        <div class="image-desc">
          <p class="title">南岳衡山</p>
          <p class="introduce">
            大学舍友结婚，有幸来一次哈尔滨看看。作为南方的我，正当冬天时节，当了一回南方小土豆。东北的冷真的冰冷刺骨，没有预备多厚的衣物，大腿皮肤都被冷风撕裂好多处。在中央大街走了两天，那里都是人流，大冬天的在外面游荡也是难得的经历，好似梦幻。终于看到了大块冰块砌成的冰雕，用手触摸根本没有一点融化的迹象。实在的东北菜一份真的好多好多。雪白的大雪还是那么吸引着我这个南方人，更何况那一块块透亮的冰块。松花江河床都被开设成可以游玩的区域。吃了冻梨，吃了冰糖葫芦，也看了索菲亚大教堂。好多拍写真的，为她们点赞...
          </p>
        </div>
      </div>
    </div>
    <div class="more-btn">
      <n-button tertiary round> 加载更多 </n-button>
    </div>
  </div>
  <footer>
    <FooterNav></FooterNav>
  </footer>
</template>

<script setup lang="ts">
import HeaderNav from '@/views/Header/HeaderNav.vue'
import FooterNav from '@/views/Footer/FooterNav.vue'
import ClassifyMeun from '@/components/ClassifyMeun.vue'
import { reactive } from 'vue'
const classify = reactive([
  {
    name: '全部',
    number: 8,
  },
  {
    name: '人像',
    number: 2,
  },
  {
    name: '动物',
    number: 1,
  },
  {
    name: '风景',
    number: 3,
  },
  {
    name: '航拍',
    number: 2,
  },
])
</script>

<style scoped lang="scss">
.image-library-out-box {
  min-width: 1480px;
  max-width: 1480px;
  margin-top: 2vh;
  flex: 1;
  .image-library-box {
    padding-top: 32px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
    justify-content: center;
    .image-library-box-item {
      width: 100%;
      height: 472px;
      background-color: #fff;
      background-image: url(@/assets/wallpaper/login-register-item.jpg);
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      overflow: hidden;
      opacity: 0.88;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      @include g.borderRadius(24px);
      .image-numbers {
        position: absolute;
        right: 24px;
        top: 24px;
        width: 32px;
        height: 32px;
        background-color: #0000003d;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        p {
          color: #fff;
        }
      }
      .image-desc {
        gap: 8px;
        position: absolute;
        height: 168px;
        overflow: hidden;
        bottom: -128px;
        left: 0;
        padding: 120px 24px 0;
        transition: all 0.2s;
        background-image: linear-gradient(180deg, #0000, #0000008f);
        .title {
          font-size: 20px;
          line-height: 1.4;
          font-weight: 600;
          color: #fff;
        }
        .introduce {
          width: 100%;
          color: #fff;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 6;
          line-clamp: 6;
          text-overflow: ellipsis;
          transition: all 0.2s;
          opacity: 0;
          font-size: 14px;
          line-height: 1.54;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
      }
      &:hover {
        opacity: 1;
        .image-desc {
          bottom: 0;
        }
        .introduce {
          opacity: 1;
        }
      }
    }
  }
  .more-btn {
    @include g.flexCenter;
    margin: 50px;
    @include g.moreBtn(94px, 48px);
  }
}
</style>
