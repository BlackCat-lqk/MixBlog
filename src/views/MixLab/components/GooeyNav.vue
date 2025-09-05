<template>
  <div :class="['gooey-nav', className]" :style="outStyle">
    <div
      v-for="(item, idx) in props.items"
      :key="idx"
      :class="['gooey-nav-item', classNameBtn, idx === activeItem ? 'gooey-nav-item-active' : '']"
      @click="clickNav(item, idx)"
      :style="contentStyle"
    >
      <div v-if="idx === activeItem">
        <div class="active-item1"></div>
        <div class="active-item2"></div>
        <div class="active-item3"></div>
        <div class="active-item4"></div>
      </div>

      <span v-if="idx === activeItem" :style="{ color: props.textActiveColor }">{{ item }}</span>
      <span v-else :style="{ color: props.textColor }">{{ item }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, withDefaults } from 'vue'

const emits = defineEmits(['click'])

interface Props {
  border?: boolean // 外部容器边框
  backgroundColor?: string
  radius?: string
  borderBtn?: boolean
  radiusBtn?: string
  backgroundColorBtn?: string
  items?: Array<string> // 导航项
  className?: string
  classNameBtn?: string
  textColor?: string
  textActiveColor?: string
  startAnimationColor?: string
  endAnimationColor?: string
  annulusWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  items: () => ['Home', 'About', 'Contact'],
  border: true,
  className: '',
  classNameBtn: '',
  backgroundColor: '#000',
  radius: '8px',
  borderBtn: true,
  backgroundColorBtn: '#000',
  radiusBtn: '8px',
  textColor: '#fff',
  textActiveColor: '#000',
  startAnimationColor: '#000',
  endAnimationColor: '#fff',
  annulusWidth: '20px',
})

const clickNav = ( name: string, index: number) => {
  activeItem.value = index
  const params = {
    name,
    index
  }
  emits('click', params)
}

const activeItem = ref(0)

// 外部容器样式
const outStyle = computed(() => {
  const style: Record<string, string> = {
    border: props.border ? 'block' : 'none',
    backgroundColor: props.backgroundColor,
    borderRadius: props.radius,
  }
  return style
})

// 菜单项样式
const contentStyle = computed(() => {
  const style: Record<string, string> = {
    border: props.borderBtn ? 'block' : 'none',
    backgroundColor: props.backgroundColorBtn,
    borderRadius: props.radiusBtn,
  }
  return style
})

const annulus = computed(() => props.annulusWidth)
const fromBackgroundColor = computed(() => props.startAnimationColor)
const toBackgroundColor = computed(() => props.endAnimationColor)

</script>

<style scoped>
.gooey-nav {
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid #fff;
  background-color: #000;
  padding: 10px;
  border-radius: 8px;
}
.gooey-nav .gooey-nav-item {
  width: 80px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid #fff;
  background-color: #000;
  cursor: pointer;
}
.gooey-nav .gooey-nav-item span {
  color: #fff;
}
.gooey-nav .gooey-nav-item-active {
  animation: gooey-nav-animation 1s ease-in-out;
  animation-fill-mode: forwards;
  background-color: #000;
  position: relative;
}
.gooey-nav .gooey-nav-item-active span {
  color: #000;
  transition: color 0.2s ease-in-out;
}
.gooey-nav .gooey-nav-item-active .active-item1,
.gooey-nav .gooey-nav-item-active .active-item2,
.gooey-nav .gooey-nav-item-active .active-item3,
.gooey-nav .gooey-nav-item-active .active-item4 {
  position: absolute;
  border: 4px solid v-bind('toBackgroundColor');
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.5;
  border-radius: 50%;
}
.active-item1 {
  width: v-bind('annulus');
  height: v-bind('annulus');
  animation: active-item-animation1 0.4s ease-in-out;
  animation-fill-mode: forwards;
}
.active-item2 {
  width: calc(v-bind('annulus') + 20px);
  height: calc(v-bind('annulus') + 20px);
  animation: active-item-animation2 0.5s ease-in-out;
  animation-fill-mode: forwards;
}
.active-item3 {
  width: calc(v-bind('annulus') + 40px);
  height: calc(v-bind('annulus') + 40px);
  animation: active-item-animation3 0.6s ease-in-out;
  animation-fill-mode: forwards;
}
.active-item4 {
  width: calc(v-bind('annulus') + 60px);
  height: calc(v-bind('annulus') + 60px);
  animation: active-item-animation4 0.7s ease-in-out;
  animation-fill-mode: forwards;
}

@keyframes active-item-animation1 {
  100% {
    width: 0%;
    height: 0%;
    display: none;
  }
}
@keyframes active-item-animation2 {
  100% {
    width: 0%;
    height: 0%;
    display: none;
  }
}
@keyframes active-item-animation3 {
  100% {
    width: 0%;
    height: 0%;
    display: none;
  }
}
@keyframes active-item-animation4 {
  100% {
    width: 0%;
    height: 0%;
    display: none;
  }
}

@keyframes gooey-nav-animation {
  from {
    background-color: v-bind('fromBackgroundColor');
    color: #fff;
  }
  to {
    background-color: v-bind('toBackgroundColor');
    color: #000;
  }
}
</style>
