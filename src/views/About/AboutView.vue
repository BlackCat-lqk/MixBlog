<template>
  <div class="my-logo">
    <img src="@/assets/images/logo-transparent.png" @click="toHome" />
  </div>
  <div class="music-box">
    <img src="@/assets/images/Music.svg" />
  </div>
  <div class="about-main-box">
    <div class="background-layer" :style="{ backgroundImage: aboutData.cover }">
      <div class="avatar-box">
        {{ aboutData.audio }}
        {{ aboutData.cover }}
        {{ aboutData.intro }}
        {{ aboutData.tags }}
        {{ aboutData.modules }}
      </div>
      <div class="background-layer-box">
        <div class="left-box">
          <div v-for="(item, idx) in tagsList.slice(0, 6)" :key="idx" class="tag tag-l">
            {{ item }}
          </div>
        </div>
        <div class="right-box">
          <div v-for="(item, idx) in tagsList.slice(6, 12)" :key="idx" class="tag tag-r">
            {{ item }}
          </div>
        </div>
      </div>
    </div>
    <div class="about-content-box">
      <div class="about-content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getAboutConfigApi } from '@/http/about'
const router = useRouter()
const toHome = () => {
  router.push('/')
}
interface modulesType {
  title: string
  content: string
  image: string[]
}
interface aboutDataType {
  intro: string
  tags: string[]
  cover: string
  audio: string
  modules: [modulesType]

}
const aboutData: aboutDataType = reactive({
  intro: '',
  tags: [],
  cover: '',
  audio: '',
  modules: [{ title: '', content: '', image: [] }],
})
// 标语
const tagsList = [
  '富强',
  '民主',
  '文明',
  '和谐',
  '自由',
  '平等',
  '公正',
  '法治',
  '爱国',
  '敬业',
  '诚信',
  '友善',
]

// 获取About页面的配置
const getAboutConfig = async () => {
  const params = {
    email: '',
    uId: '',
  }
  const response = await getAboutConfigApi(params)
  const res = response.data
  if (res.code === 200) {
    aboutData.audio = res.data.audio
    aboutData.tags = res.data.tags
    aboutData.cover =  new URL(res.data.cover).href
    aboutData.intro = res.data.intro
    aboutData.modules = res.data.modules
  } else {
    console.log(res.message)
  }
}

onMounted(() => {
  getAboutConfig()
})
</script>

<style scoped lang="scss">
.my-logo {
  position: fixed;
  width: 160px;
  height: 120px;
  top: 0;
  left: 0;
  z-index: 2;
  img {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 1;
    background-color: #eeff00;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.5;
    background-color: #585bff;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
    background-color: #1ff5e3;
  }
}
.music-box {
  position: fixed;
  width: 40px;
  height: 40px;
  top: 2%;
  right: 2%;
  z-index: 2;
  background-color: #ffffff;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 1);
  /* 新增伪元素用于扩散动画 */
  &::before {
    content: '';
    position: absolute;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    animation: ripple 1.5s infinite ease-in-out;
    z-index: -1; /* 确保在内容之下 */
  }
  img {
    width: 100%;
    height: 100%;
    cursor: pointer;
    object-fit: cover;
  }
}
.about-main-box {
  width: 100%;
  overflow-y: auto;
  position: relative;
  .background-layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    // background-image: url('@/assets/wallpaper/about1.jpg');
    background-position: center center;
    background-size: cover;
    z-index: 0;
    @include g.flexCenter;
    .background-layer-box {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0 120px;
      .left-box,
      .right-box {
        display: flex;
        gap: 24px;
        justify-content: flex-start;
        flex-direction: column;
        transition: all 0.2s ease-in-out;
        .tag {
          width: auto;
          cursor: pointer;
          border-radius: 40px;
          padding: 9px 24px;
          color: #0b1926;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0);
        }
        .tag-l {
          text-align: left;
        }
        .tag-r {
          text-align: right;
        }
      }
    }
  }

  .about-content-box {
    width: 100%;
    margin: 100vh auto 0 auto;
    background-color: #f4f2ec;
    position: relative;
    @include g.flexCenter;
    .about-content {
      min-width: 1440px;
      max-width: 1680px;
      height: 100vh;
      z-index: 1;
      background-color: #fff;
    }
  }
}
</style>
