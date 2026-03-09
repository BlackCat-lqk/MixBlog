<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <div class="tools-main-box">
    <div class="tools-expand-box">
      <div v-if="expandFlage" class="tools-img-box">
        <img :src="allTools[0].src" alt="Tool" @click="showTool(allTools[0].componentId)" />
      </div>
      <div v-else class="expand-tools-img-box">
        <img v-for="(item, idx) in allTools" :key="idx" :src="item.src" alt="Tool" @click="showTool(item.componentId)" />
      </div>
      <img
        v-if="!expandFlage"
        src="@/assets/images/rightBox.svg"
        alt="tools Right Box"
        @click="handleExpand"
      />
      <img v-else src="@/assets/images/leftBox.svg" alt="tools Left Box" @click="handleExpand" />
    </div>
    <div class="tools-introduce">
      <component :is="allTools[componentId].component"></component>
    </div>
  </div>
  <footer>
    <FooterNav></FooterNav>
  </footer>
</template>

<script lang="ts" setup>
import HeaderNav from '@/views/Header/HeaderNav.vue'
import FooterNav from '@/views/Footer/FooterNav.vue'
import XTools from '@/views/ToolsPage/Tools/XTools.vue'
import CricketChat from '@/views/ToolsPage/Tools/CricketChat.vue'
const expandFlage = ref(false)
const allTools = reactive([{
  src: new URL('@/assets/images/xtools.webp', import.meta.url).href,
  componentId: 0,
  component: XTools,
},{
  src: new URL('@/assets/images/lan-chat.svg', import.meta.url).href,
  componentId: 1,
  component: CricketChat,
}
])
// 截取工具图片
const handleExpand = () => {
  expandFlage.value = !expandFlage.value
}
// 显示工具
const componentId = ref(0)
const showTool = (id: number) => {
  componentId.value = id
}
</script>

<style lang="scss" scoped>
.tools-main-box {
  width: 100%;
  height: calc(94vh - 40px);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--text-color);
  gap: 5px;
  margin-top: 64px;
  .tools-expand-box {
    margin-top: 64px;
    width: 100%;
    position: fixed;
    height: 128px;
    top: 0;
    left: 0;
    display: flex;
    img {
      height: 100%;
      background-color: var(--box-bg-color4);
      cursor: pointer;
    }
    .tools-img-box, .expand-tools-img-box {
      padding: 10px;
      background-color: var(--box-bg-color4);
      display: flex;
      align-items: center;
      gap: 10px;
      img {
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(20px);
        width: 100%;
      }
      transition: all 0.5s ease-out;
    }
    .expand-tools-img-box{
      max-width: 50%;
      overflow: auto;
      transform: scaleX(1);
      transform-origin: left;
      transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);

    }
  }
  .tools-introduce {
    min-width: 1240px;
    max-width: 1480px;
    flex: 1;
    display: flex;
    margin-bottom: 40px;
    gap: 16px;
  }
}
</style>
