<template>
  <div class="header-main-box" :style="{ background: bgColor }">
    <div class="background-blur" :style="{ filter: `blur(${opacity}px)` }"></div>
    <div class="header-logo-search-box">
      <div class="header-logo-box">
        <img src="/src/assets/images/logo-transparent.png" alt="" />
      </div>
      <div class="search-box">
        <n-input placeholder="文章/图库/日记/资源..." clearable size="large">
          <template #prefix>
            <n-icon>
              <img src="/src/assets/images/Search.svg" />
            </n-icon>
          </template>
        </n-input>
      </div>
    </div>
    <div class="header-menu-box">
      <div class="menu-item-box">
        <div class="menu-item-text active">首页</div>
      </div>
      <div class="menu-item-box">
        <div class="menu-item-text">文章</div>
      </div>
      <div class="menu-item-box">
        <div class="menu-item-text">图库</div>
      </div>
      <div class="menu-item-box">
        <div class="menu-item-text">随机</div>
      </div>
      <div class="menu-item-box">
        <div class="menu-item-text">关于</div>
      </div>
    </div>
    <div class="oprate-box">
      <div class="user-info-box">
        <n-avatar round :size="40">
          <n-icon>
            <img src="/src/assets/images/UserAvatarFilled.svg" />
          </n-icon>
        </n-avatar>
        <span @click="toLogion">去登录</span>
      </div>
      <div class="switch-theme-box">
        <n-switch v-model:value="activeTheme" size="large">
          <template #checked-icon>
            <img src="/src/assets/images/LightModeFilled.svg" />
          </template>
          <template #unchecked-icon>
            <img src="/src/assets/images/NightlightRoundSharp.svg" />
          </template>
        </n-switch>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useScroll } from '@vueuse/core'

const router = useRouter()

const { y } = useScroll(window)
const opacity = ref(0)
const bgColor = ref('transparent')
const activeTheme = ref(false)
const toLogion = () => {
  router.push('/register-login')
}

watch(y, (newVal) => {
  const maxOpacityScroll = 200
  if (newVal >= maxOpacityScroll) {
    opacity.value = Math.min(newVal / maxOpacityScroll, 30)
    bgColor.value = '#f4f2ec'
  } else {
    bgColor.value = 'transparent'
  }
})
</script>
<style scoped lang="scss">
.header-main-box {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  transition: all 0.3s;
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  .header-logo-search-box {
    z-index: 1;
    @include g.flexCenter;
    height: 100%;
    .header-logo-box {
      width: 120px;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .search-box {
      .n-input__state-border {
        border: none;
        border-radius: 10px;
      }
    }
  }
  .header-menu-box {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    .menu-item-box {
      margin: 0 20px;
      .menu-item-text {
        padding-bottom: 10px;
        cursor: pointer;
      }
      .active {
        border-bottom: 2px solid #409eff;
      }
    }
  }
  .background-blur {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    opacity: v-bind('opacity > 0 ? 0.8 : 0');
    z-index: -1;
    transition: filter 0.3s ease;
  }
  .oprate-box {
    z-index: 1;
    display: flex;
    align-items: center;
    margin-right: 20px;
    .user-info-box {
      @include g.flexCenter;
      margin-right: 30px;
      > span {
        margin-left: 10px;
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
    }
  }
}
</style>
