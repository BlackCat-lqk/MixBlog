<template>

    <!-- SVG滤镜库 -->
    <svg style="display: none">
      <filter
        id="glass-distortion"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        filterUnits="objectBoundingBox"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.001 0.005"
          numOctaves="1"
          seed="17"
          result="turbulence"
        />
        <feComponentTransfer in="turbulence" result="mapped">
          <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
          <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
          <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
        </feComponentTransfer>
        <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
        <feSpecularLighting
          in="softMap"
          surfaceScale="5"
          specularConstant="1"
          specularExponent="100"
          lighting-color="white"
          result="specLight"
        >
          <fePointLight x="-200" y="-200" z="300" />
        </feSpecularLighting>
        <feComposite
          in="specLight"
          operator="arithmetic"
          k1="0"
          k2="1"
          k3="1"
          k4="0"
          result="litImage"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="softMap"
          scale="200"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
    <div :class="['glass-component', props.className]" ref="tiltCard">
      <div class="glass-effect"></div>
      <div class="glass-tint"></div>
      <div class="glass-shine"></div>
      <div class="glass-content-frosted">
        <!-- 内容插槽 -->
        <slot>液态毛玻璃</slot>
      </div>
    </div>

</template>

<script lang="ts" setup>

interface Props {
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  className: ''
})
</script>

<style scoped>
.glass-component {
  width: 100%;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}
.glass-effect {
  position: absolute;
  inset: 0;
  z-index: 0;
  backdrop-filter: blur(5px);
  filter: url(#glass-distortion);
  isolation: isolate;
  border-radius: 24px;
}

.glass-tint {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 24px;
}

.glass-shine {
  position: absolute;
  inset: 0;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 24px;
  box-shadow:
    inset 1px 1px 8px 0 rgba(255, 255, 255, 0.18),
    inset -1px -1px 8px 0 rgba(255, 255, 255, 0.08);
  pointer-events: none;
}
.glass-content-frosted {
  position: relative;
  z-index: 3;
  padding: 2rem;
  color: white;
}
</style>
