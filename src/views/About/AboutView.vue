<template>
  <div class="my-logo">
    <img src="@/assets/images/ArrowBack.svg" @click="toHome" />
  </div>
  <div :class="isPlaying ? 'music-box' : 'music-box-play'" @click="toggleMusic">
    <img src="@/assets/images/Music.svg" />
  </div>
  <div class="about-main-box">
    <div class="background-layer" :style="'background-image:url(' + aboutData.cover + ')'">
      <div class="about-data-box">
        <div class="about-data-img-box">
          <img src="@/assets/images/aboutAvatar.jpg" />
        </div>
        <div class="about-data-tags-box">
          <n-space>
            <n-tag
              v-for="(tag, idx) in aboutData.tags ? aboutData.tags.split(' ') : []"
              :key="idx"
              type="info"
              round
            >
              {{ tag }}
            </n-tag>
          </n-space>
        </div>
        <div class="about-data-intro-box">
          {{ aboutData.intro }}
        </div>
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
      <div class="scroll-down">
        <n-icon size="80">
          <img src="@/assets/images/AngleDoubleDownWhite.svg" alt="" />
        </n-icon>
      </div>
    </div>
    <div class="about-content-box">
      <div class="about-content">
        <div v-for="(item, idx) in aboutData.modules" :key="idx" class="about-content-item">
          <div class="about-title-content">
            <h3>{{ item.title }}</h3>
            <p>{{ item.content }}</p>
          </div>
          <div class="about-images-content">
            <n-image :src="about2" width="200" height="240" object-fit="cover" />
            <n-image :src="about3" width="200" height="240" object-fit="cover" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import about2 from '@/assets/wallpaper/about2.jpg'
import about3 from '@/assets/wallpaper/about3.jpg'
import { onMounted, reactive, ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { getAboutConfigApi } from '@/http/about'
const router = useRouter()

const audio = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
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
  tags: string
  cover: string
  audio: string
  modules: [modulesType]
}
const aboutData: aboutDataType = reactive({
  intro: '',
  tags: '',
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
// 音频播放
const toggleMusic = () => {
  if (!audio.value) {
    audio.value = new Audio(aboutData.audio)
  }

  if (isPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.loop = true
    audio.value.play().catch((err) => {
      console.error('播放失败:', err)
    })
  }

  isPlaying.value = !isPlaying.value
}
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
    aboutData.cover = res.data.cover
    aboutData.intro = res.data.intro
    aboutData.modules = res.data.modules
    console.log(aboutData)
  } else {
    console.log(res.message)
  }
}

onMounted(() => {
  getAboutConfig()
})
onBeforeUnmount(() => {
  if (audio.value) {
    audio.value.pause()
    audio.value = null
  }
})
</script>

<style scoped lang="scss">
.my-logo {
  position: fixed;
  width: 80px;
  height: 80px;
  top: 0;
  left: 0;
  z-index: 2;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
  }
}
@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 1;
    background-color: #eeff00;
  }
  25% {
    transform: scale(1.2);
    opacity: 0.75;
    background-color: #1aff48;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.5;
    background-color: #585bff;
  }
  75% {
    transform: scale(1.4);
    opacity: 0.25;
    background-color: #ff1fe5;
  }
  100% {
    transform: scale(1.6);
    opacity: 0.6;
    background-color: #1ff5e3;
  }
}
.music-box,
.music-box-play {
  position: fixed;
  width: 60px;
  height: 60px;
  top: 10px;
  right: 10px;
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
.music-box-play {
  &::before {
    animation: none;
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
    flex-direction: column;
    .about-data-box {
      @include g.flexCenter;
      flex-direction: column;
      .about-data-img-box {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 1px solid #5c5c5c;
        overflow: hidden;
        margin-bottom: 20px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .about-data-tags-box {
        background-color: rgb(205, 211, 217, 0.6);
        width: 100%;
        padding: 15px;
        border-radius: 8px;
        backdrop-filter: blur(10px);
      }
      .about-data-intro-box {
        background-color: rgb(205, 211, 217, 0.3);
        margin-top: 20px;
        @include g.flexCenter;
        font-size: 18px;
        color: #0b1926;
        width: 100%;
        padding: 15px;
        border-radius: 8px;
        backdrop-filter: blur(10px);
      }
    }
    .background-layer-box {
      width: 80%;
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
    .scroll-down {
      img {
        animation: scrollDown 3.5s ease-in-out infinite;
      }
    }
    @keyframes scrollDown {
      0% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(80px);
      }
      100% {
        transform: translateY(0);
      }
    }
  }

  .about-content-box {
    width: 100%;
    margin: 100vh auto 0 auto;
    background-color: var(--box-bg-color5);
    position: relative;
    @include g.flexCenter;
    .about-content {
      min-width: 1440px;
      max-width: 1440px;
      height: 100vh;
      z-index: 1;
      background-color: var(--box-bg-color1);
      padding: 20px;
      .about-content-item {
        width: 100%;
        height: auto;
        display: flex;
        gap: 24px;
        padding: 24px;
        .about-title-content {
          min-width: 500px;
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
          h3 {
            color: var(--text-color1);
            font-size: 24px;
            font-weight: 600;
            padding-bottom: 16px;
          }
          p {
            line-height: 28px;
            color: var(--text-color1);
            padding-bottom: 24px;
            text-align: justify;
          }
        }
        .about-images-content {
          width: 500px;
          min-width: 500px;
          display: flex;
          gap: 12px;
          .n-image {
            padding: 10px;
            width: 200px;
            height: 240px;
            background-color: #e5e5e5;
            border-radius: 8px;
          }
        }
      }
    }
  }
}
</style>
