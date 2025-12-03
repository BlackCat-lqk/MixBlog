<template>
  <div class="mix-lab-main">
    <Dither
      class="prism-box"
      :wave-speed="0.05"
      :wave-frequency="1"
      :wave-amplitude="0.2"
      :wave-color="[0.9, 0.8, 0.9]"
      :color-num="7"
      :pixel-size="2"
      :disable-animation="false"
      :enable-mouse-interaction="true"
      :mouse-radius="0.3"
    />
    <FollowMouse :size="250" :cursor="true" :opacity="0.6" color="rgba(100, 200, 255, 0.9)">
      <div class="mix-lab-content">
        <div class="mixlab-header">
          <n-icon size="48">
            <img width="48px" src="@/assets/images/lab.svg" alt="Laboratory" />
          </n-icon>
          <span> 实验性项目，在这里尽情发挥想象... </span>
        </div>
        <div style="display: flex; justify-content: center; margin-bottom: 10px">
          <GooeyNav
            :items="gooeyNavItems"
            :border="false"
            backgroundColor="#032d49"
            backgroundColorBtn="#032d49"
            :borderBtn="true"
            textColor="#fff"
            textActiveColor="#000"
            start-animation-color="#032d49"
            end-animation-color="#f0ecf8"
            annulusWidth="20px"
            @click="handleNav"
          ></GooeyNav>
        </div>
        <div v-show="showTabs == 0" class="mix-lab-card">
          <div class="grid-custom-box">
            <span style="color: #fff; position: absolute; bottom: 5%">流动渐变边框</span>
            <div style="color: #fff; position: absolute; top: 5%; right: 2%; cursor: pointer">
              <img width="32px" src="@/assets/images/MixLab/codeView.svg" alt="code review" />
            </div>
            <GradientFlow class-name="gradient-box" @click="handleGradientBtn">
              <template #content>
                <p></p>
              </template>
            </GradientFlow>
          </div>
          <div class="grid-custom-drop-box">
            <DragDrop
              :initial-position="position"
              boundary-selector=".custom-spotlight-card"
              @drag-start="onDragStart"
              @dragging="onDragging"
              @drag-end="onDragEnd"
              class-name="custom-drag-drop"
            >
              <template #content>
                <div class="drag-box">
                  <img width="6px" src="@/assets/images/MixLab/Vector.png" alt="Vector" />
                  <div class="img-icon">
                    <img
                      width="32px"
                      src="@/assets/images/MixLab/detective.svg"
                      alt="UserAvatarFilled"
                    />
                  </div>
                  <div class="text-box">
                    <h3>简历筛选</h3>
                    <p>工作流</p>
                  </div>
                  <div class="options-btn">
                    <div>
                      <img src="@/assets/images/MixLab/dead.svg" alt="dead" />
                      <span>Dead</span>
                    </div>
                    <div>
                      <img src="@/assets/images/MixLab/flirt.svg" alt="flirt" />
                      <span>Flirt</span>
                    </div>
                    <div>
                      <img src="@/assets/images/MixLab/gentleman.svg" alt="gentleman" />
                      <span>Gentle</span>
                    </div>
                  </div>
                </div>
              </template>
            </DragDrop>
            <span style="color: #fff; position: absolute; bottom: 5%">拖拽</span>
          </div>
          <div class="click-effect-box">
            <ClickEffect
              :particleCount="100"
              :colors="['#ff4757', '#2ed573', '#1e90ff']"
              class-name="click-effect"
            >
              <p>Click Me!</p>
            </ClickEffect>
            <span style="color: #fff; position: absolute; bottom: 5%">鼠标点击特效</span>
          </div>
          <div class="frosted-glass-box">
            <div class="background-content"></div>
            <FrostedGlass class-name="glass-panel">
              <div class="glass-content">
                <!-- <span>液态玻璃</span> -->
              </div>
            </FrostedGlass>
            <span style="color: #fff; position: absolute; bottom: 5%">液态玻璃</span>
          </div>
          <div class="grid-custom-box">
            <FollowMouse :size="350" color="rgb(189, 27, 254)" class="follow-mouse">
              <p>Hover Me!</p>
            </FollowMouse>
            <span style="color: #fff; position: absolute; bottom: 5%">鼠标跟随</span>
          </div>
          <div class="grid-custom-box">
            <MessageNotify
              v-model:show="isShowMessage"
              :size="250"
              color="rgba(100, 200, 255, 0.9)"
              class="message-notify"
            >
              <template #title>Notice</template>
              <template #content>
                <span
                  >Loren ipsum dolen sit a mor a mor a mor whatever. Loren ipsum dolen sit a mor a
                  mor a mor whatever.</span
                >
              </template>
              <template #footer>
                <div style="margin-top: 20px">Donald John Trump</div>
              </template>
            </MessageNotify>
            <div class="message-notify-btn" style="cursor: pointer" @click="isShowMessage = true">
              <img width="64px" src="@/assets/images/MixLab/message.svg" alt="message" />
            </div>
            <span style="color: #fff; position: absolute; bottom: 5%">消息通知</span>
          </div>
          <div class="grid-custom-box">
            <MaskLayer
              v-if="showMask"
              direction="top"
              start-color="#4cc28b"
              end-color="#b0ff57"
              size="100%"
              :animated="true"
              content-position="center"
              :clickable="true"
              :opacity="0.3"
            >
              <!-- <div class="custom-content">
                <h3>自定义内容</h3>
                <p>这里可以放置任何内容</p>
                <button @click="showMask = false">关闭</button>
              </div> -->
            </MaskLayer>
            <span style="color: #fff; position: absolute; bottom: 5%">渐变遮罩层</span>
          </div>
          <div class="grid-custom-box">
            <GooeyNav
              :border="true"
              backgroundColor="#ffd642"
              backgroundColorBtn="#ffd642"
              :borderBtn="true"
              textColor="#000"
              textActiveColor="#fff"
              start-animation-color="#ffd642"
              end-animation-color="#d573fc"
              annulusWidth="20px"
            ></GooeyNav>
            <span style="color: #fff; position: absolute; bottom: 5%">导航</span>
          </div>
          <div class="grid-custom-box">
            <WaterBall :progressData="waterBallData" unitText="%"></WaterBall>
            <span style="color: #fff; position: absolute; bottom: 5%">波浪水球</span>
          </div>
          <div class="grid-custom-box">
            <ProgressBar :progressData="waterBallData" unitText="%"></ProgressBar>
            <span style="color: #fff; position: absolute; bottom: 5%">进度条</span>
          </div>
          <div class="grid-custom-box">
            <TextToImage :data="textToImageData"></TextToImage>
            <span style="color: #fff; position: absolute; bottom: 5%; background-color: #000"
              >Canvas画布: 数据生图</span
            >
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              style="color: #fff; background-color: #000; position: absolute; bottom: 15%"
              @change="handleImageUpload"
            />
          </div>
        </div>
        <HooksLab v-show="showTabs == 1"></HooksLab>
      </div>
    </FollowMouse>
  </div>
</template>

<script setup lang="ts">
import Dither from '@/views/VueBits/BitsDither.vue'
import GradientFlow from '@/views/MixLab/components/GradientFlow.vue'
import DragDrop from '@/views/MixLab/components/DragDrop.vue'
import ClickEffect from '@/views/MixLab/components/ClickEffect.vue'
import FrostedGlass from '@/views/MixLab/components/FrostedGlass.vue'
import FollowMouse from '@/views/MixLab/components/FollowMouse.vue'
import MessageNotify from '@/views/MixLab/components/MessageNotify.vue'
import MaskLayer from '@/views/MixLab/components/MaskLayer.vue'
import GooeyNav from '@/views/MixLab/components/GooeyNav.vue'
import WaterBall from '@/views/MixLab/components/WaterBall.vue'
import ProgressBar from '@/views/MixLab/components/ProgressBar.vue'
import TextToImage from '@/views/MixLab/components/TextToImage.vue'
import HooksLab from '@/views/MixLab/HooksLab.vue'
const handleGradientBtn = () => {
  console.log('handleGradientBtn')
}

const showTabs = ref(0)

const gooeyNavItems = ['组件', 'Hooks']

const isShowMessage = ref(false)
const showMask = ref(true)

// 拖拽组件
const position = ref({ x: 35, y: 110 })
const dragStatus = ref('等待拖拽')
const onDragStart = (pos: { x: number; y: number }) => {
  position.value = pos
  dragStatus.value = '开始拖拽'
}

const onDragging = (pos: { x: number; y: number }) => {
  position.value = pos
  dragStatus.value = '拖拽中'
}

const onDragEnd = (pos: { x: number; y: number }) => {
  position.value = pos
  dragStatus.value = '拖拽结束'
}

interface NavItem {
  index: number
  title: string
}
const handleNav = (val: NavItem) => {
  showTabs.value = val.index
}

const textToImageData = reactive({
  text: 'Hello, World 标题',
  uploadedImage: '',
  width: '456px',
  height: '300px',
  content: '描述文字',
})

// 处理Canvas图片上传
const handleImageUpload = (event: Event) => {
  const reader = new FileReader()
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    reader.onload = (e) => {
      if (!e.target) return
      textToImageData.uploadedImage = e.target.result as string
    }
    reader.readAsDataURL(file)
  }
}
// 波浪水球模拟数据
const waterBallData = ref(0)
let timer: any
const initWaterBallData = () => {
  timer = setInterval(() => {
    waterBallData.value += 2
    if (waterBallData.value >= 100) {
      waterBallData.value = 0
    }
  }, 1000)
}

onMounted(() => {
  initWaterBallData()
})
onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style lang="scss" scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0) rotate(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-2px) rotate(-5deg);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(2px) rotate(5deg);
  }
}
.mix-lab-main {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: black;
  .prism-box {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
  }
  .mix-lab-content {
    padding: 10px;
    .mixlab-header {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
      span {
        color: #fff;
      }
    }
    .mix-lab-card {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
      place-items: center;
    }
    .card-gradient {
      height: 380px;
      width: 100%;
    }
    .gradient-box {
      width: 80%;
      height: 80px;
      color: #fff;
      border-radius: 40px;
      border: 4px solid transparent;
      font-size: 18px;
    }
    .custom-drag-drop {
      width: 80%;
      height: 55px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 5px 10px 0px rgba(103, 120, 139, 0.5);
      border-radius: 10px 10px 10px 10px;
      border: 1px solid #ffffff;
      .drag-box {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        img {
          width: 6px;
          height: 14px;
        }
        .img-icon {
          width: 40px;
          height: 40px;
          background: #fce8f6;
          border-radius: 10px 10px 10px 10px;
          margin: 0 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          img {
            width: 32px;
            height: 32px;
          }
        }
        .text-box {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          margin-right: 8px;
          gap: 5px;
          cursor: pointer;
          h3 {
            font-size: 12px;
            font-weight: bolder;
          }
          p {
            font-size: 12px;
          }
        }
        .options-btn {
          margin-left: 20px;
          display: flex;
          gap: 16px;
          & > div {
            display: flex;
            width: 40px;
            height: 40px;
            flex-direction: column;
            gap: 5px;
            justify-content: center;
            align-items: center;
            padding: 8px;
            cursor: pointer;
            background: #dddddd;
            border-radius: 10px;
            white-space: normal;
            text-wrap: wrap;
            word-break: break-all;
            word-wrap: break-word;
            text-align: center;
            &:hover {
              background: #d9f0ff;
            }
            img {
              width: 18px;
              height: 18px;
            }
            span {
              font-size: 12px;
              color: #8496ae;
            }
          }
        }
      }
    }
  }
  .click-effect-box {
    position: relative;
    height: 300px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.7);
    border: 1px solid #333;
    border-radius: 8px;
    cursor: url('@/assets/images/MixLab/complex.png'), auto;
    .click-effect {
      display: flex;
      justify-content: center;
      align-items: center;
      p {
        position: absolute;
        font-size: 20px;
        color: #808080;
        font-weight: bolder;
        cursor: url('@/assets/images/MixLab/complex.png'), auto;
      }
    }
  }
  .frosted-glass-box {
    position: relative;
    // width: 400px;
    height: 300px;
    width: 100%;
    // height: 100%;
    // margin: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #333;
    border-radius: 8px;
    .background-content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('@/assets/images/MixLab/glassBg.webp');
      background-size: 160% 160%;
      animation: gradientBG 15s ease infinite;
      border-radius: 8px;
    }
    @keyframes gradientBG {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 100%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    :deep(.glass-panel) {
      padding: 0;
      width: 80%;
      height: 60%;
      .glass-content {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .grid-custom-drop-box {
    position: relative;
    height: 300px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.7);
    border: 1px solid #333;
    border-radius: 8px;
  }
  .grid-custom-box {
    position: relative;
    height: 300px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.7);
    border: 1px solid #333;
    border-radius: 8px;
    overflow: hidden;
    .follow-mouse,
    .message-notify {
      display: flex;
      justify-content: center;
      align-items: center;
      p {
        font-size: 20px;
        color: #808080;
        font-weight: bolder;
      }
    }
    .message-notify-btn {
      &:hover {
        animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
      }
    }
  }
}
</style>
