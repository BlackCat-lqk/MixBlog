<template>
  <component
    :is="as"
    :class="['relative inline-block overflow-hidden !bg-transparent !border-none !rounded-[20px]', customClass]"
    v-bind="restAttrs"
    :style="componentStyle"
  >
    <div
      class="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
      :style="{
        background: `radial-gradient(circle, ${color}, transparent 10%)`,
        animationDuration: speed
      }"
    ></div>

    <div
      class="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
      :style="{
        background: `radial-gradient(circle, ${color}, transparent 10%)`,
        animationDuration: speed
      }"
    ></div>

    <div
      class="relative z-10 border border-[#333] bg-[#0b0b0b] text-white text-[16px] text-center px-[64px] py-[24px] rounded-[20px]"
    >
      <slot />
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed, defineProps, useAttrs } from 'vue';

interface StarBorderProps {
  as?: string;
  customClass?: string;
  color?: string;
  speed?: string;
  thickness?: number;
}

const props = withDefaults(defineProps<StarBorderProps>(), {
  as: 'button',
  customClass: '',
  color: 'white',
  speed: '6s',
  thickness: 1
});

const restAttrs = useAttrs();

const componentStyle = computed(() => {
  const base = {
    padding: `${props.thickness}px 0`
  };
  const userStyle = (restAttrs.style as Record<string, string>) || {};
  return { ...base, ...userStyle };
});
</script>

<style scoped>
@keyframes star-movement-bottom {
  0% {
    transform: translate(0%, 0%);
    opacity: 1;
  }

  100% {
    transform: translate(-100%, 0%);
    opacity: 0;
  }
}

@keyframes star-movement-top {
  0% {
    transform: translate(0%, 0%);
    opacity: 1;
  }

  100% {
    transform: translate(100%, 0%);
    opacity: 0;
  }
}

.animate-star-movement-bottom {
  animation: star-movement-bottom linear infinite alternate;
}

.animate-star-movement-top {
  animation: star-movement-top linear infinite alternate;
}
</style>
