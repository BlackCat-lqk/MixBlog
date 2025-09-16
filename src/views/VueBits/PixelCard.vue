<template>
  <div
    ref="containerRef"
    :class="[
      'h-[400px] w-[300px] relative overflow-hidden grid place-items-center aspect-[4/5] border border-[#27272a] rounded-[25px] isolate transition-colors duration-200 ease-[cubic-bezier(0.5,1,0.89,1)] select-none',
      className
    ]"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @focus="finalNoFocus ? undefined : onFocus"
    @blur="finalNoFocus ? undefined : onBlur"
    :tabindex="finalNoFocus ? -1 : 0"
  >
    <canvas class="w-full h-full block" ref="canvasRef" />

    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, useTemplateRef } from 'vue';

class Pixel {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  color: string;
  speed: number;
  size: number;
  sizeStep: number;
  minSize: number;
  maxSizeInteger: number;
  maxSize: number;
  delay: number;
  counter: number;
  counterStep: number;
  isIdle: boolean;
  isReverse: boolean;
  isShimmer: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    delay: number
  ) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.getRandomValue(0.1, 0.9) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.4;
    this.minSize = 0.5;
    this.maxSizeInteger = 2;
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  getRandomValue(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size);
  }

  appear() {
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }
    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }
    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;
    if (this.size <= 0) {
      this.isIdle = true;
      return;
    } else {
      this.size -= 0.1;
    }
    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }
    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }
}

function getEffectiveSpeed(value: number, reducedMotion: boolean) {
  const min = 0;
  const max = 100;
  const throttle = 0.001;

  if (value <= min || reducedMotion) {
    return min;
  } else if (value >= max) {
    return max * throttle;
  } else {
    return value * throttle;
  }
}

const VARIANTS = {
  default: {
    activeColor: null,
    gap: 5,
    speed: 35,
    colors: '#f8fafc,#f1f5f9,#cbd5e1',
    noFocus: false
  },
  blue: {
    activeColor: '#e0f2fe',
    gap: 10,
    speed: 25,
    colors: '#e0f2fe,#7dd3fc,#0ea5e9',
    noFocus: false
  },
  yellow: {
    activeColor: '#fef08a',
    gap: 3,
    speed: 20,
    colors: '#fef08a,#fde047,#eab308',
    noFocus: false
  },
  pink: {
    activeColor: '#fecdd3',
    gap: 6,
    speed: 80,
    colors: '#fecdd3,#fda4af,#e11d48',
    noFocus: true
  }
};

interface PixelCardProps {
  variant?: 'default' | 'blue' | 'yellow' | 'pink';
  gap?: number;
  speed?: number;
  colors?: string;
  noFocus?: boolean;
  className?: string;
}

interface VariantConfig {
  activeColor: string | null;
  gap: number;
  speed: number;
  colors: string;
  noFocus: boolean;
}

const props = withDefaults(defineProps<PixelCardProps>(), {
  variant: 'default',
  className: ''
});

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef');
const pixelsRef = ref<Pixel[]>([]);
const animationRef = ref<number | null>(null);
const timePreviousRef = ref(performance.now());
const reducedMotion = ref(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

const variantCfg = computed((): VariantConfig => VARIANTS[props.variant] || VARIANTS.default);
const finalGap = computed(() => props.gap ?? variantCfg.value.gap);
const finalSpeed = computed(() => props.speed ?? variantCfg.value.speed);
const finalColors = computed(() => props.colors ?? variantCfg.value.colors);
const finalNoFocus = computed(() => props.noFocus ?? variantCfg.value.noFocus);

let resizeObserver: ResizeObserver | null = null;

const initPixels = () => {
  if (!containerRef.value || !canvasRef.value) return;

  const rect = containerRef.value.getBoundingClientRect();
  const width = Math.floor(rect.width);
  const height = Math.floor(rect.height);
  const ctx = canvasRef.value.getContext('2d');

  canvasRef.value.width = width;
  canvasRef.value.height = height;
  canvasRef.value.style.width = `${width}px`;
  canvasRef.value.style.height = `${height}px`;

  const colorsArray = finalColors.value.split(',');
  const pxs = [];
  for (let x = 0; x < width; x += parseInt(finalGap.value.toString(), 10)) {
    for (let y = 0; y < height; y += parseInt(finalGap.value.toString(), 10)) {
      const color = colorsArray[Math.floor(Math.random() * colorsArray.length)];

      const dx = x - width / 2;
      const dy = y - height / 2;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const delay = reducedMotion.value ? 0 : distance;
      if (!ctx) return;
      pxs.push(
        new Pixel(canvasRef.value, ctx, x, y, color, getEffectiveSpeed(finalSpeed.value, reducedMotion.value), delay)
      );
    }
  }
  pixelsRef.value = pxs;
};

const doAnimate = (fnName: keyof Pixel) => {
  animationRef.value = requestAnimationFrame(() => doAnimate(fnName));
  const timeNow = performance.now();
  const timePassed = timeNow - timePreviousRef.value;
  const timeInterval = 1000 / 60;

  if (timePassed < timeInterval) return;
  timePreviousRef.value = timeNow - (timePassed % timeInterval);

  const ctx = canvasRef.value?.getContext('2d');
  if (!ctx || !canvasRef.value) return;

  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

  let allIdle = true;
  for (let i = 0; i < pixelsRef.value.length; i++) {
    const pixel = pixelsRef.value[i];
    // @ts-expect-error - Dynamic method call on Pixel class
    pixel[fnName]();
    if (!pixel.isIdle) {
      allIdle = false;
    }
  }
  if (allIdle && animationRef.value) {
    cancelAnimationFrame(animationRef.value);
  }
};

const handleAnimation = (name: keyof Pixel) => {
  if (animationRef.value !== null) {
    cancelAnimationFrame(animationRef.value);
  }
  animationRef.value = requestAnimationFrame(() => doAnimate(name));
};

const onMouseEnter = () => handleAnimation('appear');
const onMouseLeave = () => handleAnimation('disappear');
const onFocus = (e: FocusEvent) => {
  if ((e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) return;
  handleAnimation('appear');
};
const onBlur = (e: FocusEvent) => {
  if ((e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) return;
  handleAnimation('disappear');
};

watch([finalGap, finalSpeed, finalColors, finalNoFocus], () => {
  initPixels();
});

onMounted(() => {
  initPixels();
  resizeObserver = new ResizeObserver(() => {
    initPixels();
  });
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  if (animationRef.value !== null) {
    cancelAnimationFrame(animationRef.value);
  }
});
</script>
