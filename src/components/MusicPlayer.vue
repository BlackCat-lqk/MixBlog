<template>
  <div class="music-player">
    <n-card :bordered="false" class="player-card">
      <div class="player-info" v-if="currentTrack">
        <n-text class="track-title">{{ currentTrack.title }}</n-text>
        <n-text class="track-artist">{{ currentTrack.artist }}</n-text>
      </div>
      <div class="player-controls">
        <n-space justify="center" align="center">
          <n-button circle size="large" @click="togglePlay">
            <template #icon>
              <n-icon>
                <svg v-if="isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M6 5h2v14H6V5zm10 0h2v14h-2V5z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z"/>
                </svg>
              </n-icon>
            </template>
          </n-button>
        </n-space>
      </div>
      <div class="progress-container">
        <n-slider
          v-model:value="progress"
          :min="0"
          :max="100"
          :step="0.1"
          @update:value="onProgressChange"
        />
        <div class="time-info">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { NCard, NButton, NIcon, NSpace, NSlider, NText } from 'naive-ui'

// 播放器状态
const isPlaying = ref(false)
const progress = ref(0)
const currentTime = ref(0)
const duration = ref(0)

// 当前播放曲目
const currentTrack = reactive({
  title: '60%的遐想·静谧',
  artist: '三Z-STUDIO/HOYO-MiX',
  src: ''
})

// 模拟播放列表
const playlist = [
  { title: '歌曲1', artist: '艺术家1', src: '' },
  { title: '歌曲2', artist: '艺术家2', src: '' },
  { title: '歌曲3', artist: '艺术家3', src: '' }
]

// 当前播放索引
const currentIndex = ref(0)

// 格式化时间显示
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

// 切换播放/暂停
const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  // 实际项目中这里会控制audio元素的播放/暂停
}

// 加载曲目
const loadTrack = () => {
  Object.assign(currentTrack, playlist[currentIndex.value])
  currentTime.value = 0
  progress.value = 0
  isPlaying.value = false
}

// 进度条变化
const onProgressChange = (value: number) => {
  progress.value = value
  currentTime.value = (value / 100) * duration.value
}
// 模拟播放进度更新
let progressInterval = null

onMounted(() => {
  loadTrack()
  duration.value = 200 // 模拟歌曲时长为200秒

  // 模拟播放进度更新
  progressInterval = setInterval(() => {
    if (isPlaying.value) {
      if (currentTime.value < duration.value) {
        currentTime.value += 1
        progress.value = (currentTime.value / duration.value) * 100
      } else {
        // 歌曲播放完毕，自动播放下一首
        nextTrack()
      }
    }
  }, 1000)
})

onBeforeUnmount(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})
</script>

<style scoped lang="scss">
.music-player {
  max-width: 500px;
  margin: 0 auto;

  .player-card {
    border-radius: 12px;
  }

  .player-info {
    text-align: center;
    margin-bottom: 20px;

    .track-title {
      font-size: 18px;
      font-weight: bold;
      display: block;
      margin-bottom: 5px;
    }

    .track-artist {
      font-size: 14px;
      opacity: 0.75;
    }
  }

  .player-controls {
    margin: 20px 0;
  }

  .progress-container {
    margin: 20px 0;

    .time-info {
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
      font-size: 12px;
      opacity: 0.75;
    }
  }
}
</style>
