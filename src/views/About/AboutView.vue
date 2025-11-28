<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <div class="about-box">
    <div class="about-left">
      <div class="avatar-box">
        <ProfileCard
          name="夜里的猫"
          :title="aboutData.intro"
          avatar-url="/uploads/about/compressed/about-me.webp"
          icon-url="/uploads/about/compressed/about-me.webp"
          grain-url="/uploads/about/compressed/about-me.webp"
          :show-user-info="false"
          :show-behind-gradient="true"
          :enable-tilt="false"
        />
        <div class="avatar-name">
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
          <div class="about-images-content">
            <n-image
              :src="about2"
              width="200"
              height="240"
              object-fit="cover"
              :lazy="true"
              alt="about"
            />
            <n-image
              :src="about3"
              width="200"
              height="240"
              object-fit="cover"
              :lazy="true"
              alt="about"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="about-right">
      <div class="introduce-box">
        <div class="introduce-item introduce-item1">
          <div class="introduce-title">
            Creative
            <TextType
              :text="['coding', 'thinking', 'components']"
              :typingSpeed="100"
              :pauseDuration="2000"
              :showCursor="true"
              cursorCharacter="▌"
              :text-colors="['rgb(255, 69, 0)']"
              className="introduce-text-type"
            />
          </div>
          <div class="introduce-time">
            <span>站点已神奇的运行了</span
            ><span class="count-day">
              <n-number-animation ref="numberAnimationInstRef" :from="0" :to="countDay" /> </span
            ><span>天</span>
          </div>
        </div>
        <div class="introduce-item introduce-item2">
          <div class="introduce-title-ten">
            <span class="press">
              时间进度
              <n-number-animation
                ref="numberAnimationInstRef"
                :from="0"
                :to="couintDayPress"
                :precision="2"
              />
              %</span
            >
            <span>10年之约</span>
            <span
              >在这个十年中，我会用心感受生活的美好，用努力书写工作的篇章，用行动诠释人生的意义。这个进度条，不仅是数字的积累，更是我心中的期许和承诺。我相信，经过十年的坚持和努力，我会收获更多，成为一个更好的自己。</span
            >
          </div>
          <div class="introduce-line"></div>
        </div>
      </div>
      <div class="timeline-box">
        <div class="timeline-title">
          <span>时间线</span>
        </div>
        <div v-for="(item, idx) in aboutData.modules" :key="idx" class="about-content-item">
          <div class="about-title-content">
            <h3>{{ item.title }}</h3>
            <p>{{ item.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <footer>
    <FooterNav></FooterNav>
  </footer>
</template>

<script setup lang="ts">
import about2 from '@/assets/wallpaper/about2.webp'
import about3 from '@/assets/wallpaper/about3.webp'
import HeaderNav from '@/views/Header/HeaderNav.vue'
import FooterNav from '@/views/Footer/FooterNav.vue'
import { getAboutConfigApi } from '@/http/about'
import { getAboutCachedData } from '@/utils/apiCache'
import type { aboutDataType } from '@/tsInterface'
const ProfileCard = defineAsyncComponent(() => import('@/views/VueBits/ProfileCard.vue'))
const TextType = defineAsyncComponent(() => import('@/views/VueBits/TextType.vue'))
import { useLoadingBar } from 'naive-ui'

const loadingBar = useLoadingBar()
const audio = ref<HTMLAudioElement | null>(null)
const aboutData: aboutDataType = reactive({
  intro: '',
  tags: '',
  cover: '',
  audio: '',
  modules: [{ title: '', content: '', image: [] }],
})

const countDay = computed(() => {
  const now = new Date()
  const start = new Date('2025-06-30 00:00:00')
  const diff = now.getTime() - start.getTime()
  const day = Math.floor(diff / (24 * 60 * 60 * 1000))
  return day
})

const couintDayPress = computed(() => {
  const now = new Date().getTime()
  const start = new Date('2025-06-30 00:00:00').getTime()
  const end = new Date('2035-06-30 00:00:00').getTime()
  const totalSpan = end - start
  const targetPosition = now - start
  const percentage = (targetPosition / totalSpan) * 100
  return Number(percentage.toFixed(2))
})

// 获取About页面的配置
const getAboutConfig = async () => {
  loadingBar.start()
  const params = {
    email: '',
    uId: '',
  }
  const response = await getAboutCachedData(params, getAboutConfigApi)
  const res = response.data
  if (res.code === 200) {
    aboutData.audio = res.data.audio
    aboutData.tags = res.data.tags
    aboutData.cover = res.data.cover
    aboutData.intro = res.data.intro
    aboutData.modules = res.data.modules
    loadingBar.finish()
  } else {
    loadingBar.error()
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
.music-box,
.music-box-play {
  position: fixed;
  width: 60px;
  height: 60px;
  top: 80px;
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
    // z-index: -1; /* 确保在内容之下 */
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
.about-box {
  min-width: 1240px;
  max-width: 1480px;
  margin-top: calc(5vh + 60px);
  flex: 1;
  display: flex;
  gap: 24px;
  margin-bottom: 30px;
  .about-left {
    .avatar-box {
      width: 260px;
      height: 260px;
      .avatar-name {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .about-data-tags-box {
          padding: 20px 0;
        }
        .about-data-intro-box {
          font-size: 16px;
          color: var(--text-color1);
          line-height: 1.54;
          padding: 20px 0px;
        }
        .about-images-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
          .n-image {
            padding: 2px;
            width: 200px;
            height: 240px;
            background-color: #5e6c7e;
            border-radius: 8px;
          }
        }
      }
    }
  }
  .about-right {
    flex: 1;
    .introduce-box {
      width: 100%;
      height: 380px;
      border: 1px solid var(--border-color);
      margin-bottom: 15px;
      border-radius: 8px;
      padding: 10px;
      display: flex;
      justify-content: space-evenly;
      gap: 8px;
      .introduce-item {
        height: 100%;
        border: 1px solid var(--border-color);
        color: var(--text-color1);
        border-radius: 8px;
      }
      .introduce-item1 {
        flex: 1;
        display: flex;
        flex-direction: column;
        > div {
          flex: 1;
        }
        .introduce-title,
        .introduce-time {
          font-size: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .introduce-text-type {
          color: var(--text-color1);
          line-height: 1.54;
          margin-left: 8px;
          color: yellow;
        }
        .introduce-time {
          font-size: 32px;
          .count-day {
            font-size: 48px;
            color: rgb(255, 69, 0);
          }
        }
      }
      .introduce-item2 {
        flex: 0.4;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 40%;
          background: rgba(255, 69, 0, 0.1);
          animation: shine 1.6s infinite;
        }
        /* 光晕动画 */
        @keyframes shine {
          0% {
            top: 60%;
            opacity: 0;
            animation-timing-function: ease-out;
          }
          20% {
            opacity: 0.8;
            animation-timing-function: ease-in;
          }
          90% {
            opacity: 0.3;
            animation-timing-function: ease-out;
          }
          100% {
            top: 0%;
            opacity: 0;
            animation-timing-function: ease-in;
          }
        }
        .introduce-title-ten {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .press {
            font-size: 24px;
            margin-bottom: 20px;
          }
        }
        span {
          font-size: 16px;
          padding: 0 5px;
          line-height: 1.54;
        }
        .introduce-line {
          position: absolute;
          width: 100%;
          height: 3%;
          bottom: 0;
          border-radius: 0 0 8px 8px;
          background-color: rgb(255, 69, 0);
        }
      }
    }
    .timeline-box {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 12px;
      min-height: 520px;
      padding: 10px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      .timeline-title {
        padding: 10px;
        font-size: 20px;
        font-weight: 600;
        color: var(--text-color1);
        text-align: center;
      }
      .about-content-item {
        width: calc(100% - 20px);
        height: calc(100% - 20px);
        display: flex;
        gap: 24px;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 10px;
        .about-title-content {
          h3 {
            color: var(--text-color1);
            font-size: 24px;
            font-weight: 600;
            padding-bottom: 16px;
          }
          p {
            line-height: 28px;
            color: var(--text-color1);
            text-align: justify;
          }
        }
      }
    }
  }
}
</style>
