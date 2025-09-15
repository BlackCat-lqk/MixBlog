<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <div :class="isPlaying ? 'music-box' : 'music-box-play'" @click="toggleMusic">
    <img src="@/assets/images/Music.svg" alt="music" />
  </div>
  <div class="about-box">
    <MusicPlayer></MusicPlayer>
  </div>
  <footer>
    <FooterNav></FooterNav>
  </footer>
</template>

<script setup lang="ts">
// import about2 from '@/assets/wallpaper/about2.jpg'
// import about3 from '@/assets/wallpaper/about3.jpg'
import HeaderNav from '@/views/Header/HeaderNav.vue'
import FooterNav from '@/views/Footer/FooterNav.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'
import { getAboutConfigApi } from '@/http/about'

const audio = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)

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
      console.error(err)
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
  margin-top: 2vh;
  flex: 1;
}
</style>
