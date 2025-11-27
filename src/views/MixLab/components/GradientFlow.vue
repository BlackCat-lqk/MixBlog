/**
 * Author: lqk
 * Date: 2025/08/27
 * Description: 渐变边框
 * 使用插槽提高扩展性，插槽替换内容
 * 使用$attrs透传事件和属性，保留原生事件体验
 * 使用emits暴露组件事件
 * 点击事件：@click
 * 自定义不用颜色的类名：color-class-name-arry, 最多定义4种颜色
 */
<template>
  <div :class="['gradient-border', className]" v-bind="$attrs" @click="handleSubmit">
    <div :class="['red-glow glow', colorClassNameArry[0]]"></div>
    <div :class="['cyan-glow glow', colorClassNameArry[1]]"></div>
    <div :class="['purple-glow glow', colorClassNameArry[2]]"></div>
    <div :class="['white-glow glow', colorClassNameArry[3]]"></div>
      <slot name="content"> 默认文本 </slot>
  </div>
</template>

<script lang="ts" setup>
interface GradientFlowProps {
  className?: string
  disabled?: boolean
  colorClassNameArry?: string[]
}
const {
  className = '',
  colorClassNameArry = ['', '', '', '']
} = defineProps<GradientFlowProps>()

defineOptions({ inheritAttrs: false }); // 用 inheritAttrs: false 避免自动绑定到根元素，再手动绑定到目标元素
const emit = defineEmits(['click']);
const handleSubmit = () => {
  emit('click');
};
</script>

<style scoped>
.gradient-border {
  /*   基础尺寸和定位 */
  position: absolute;
  cursor: pointer;
  border-radius: 100px;
  width: 100%;
  height: 100%;
  --border-width: 4px;
  --radius: 100px;
  border-radius: var(--radius);
  border: var(--border-width) solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gradient-border::before {
  /*   渐变描边 */
  content: ' ';
  position: absolute;
  inset: calc(var(--border-width) * -1);
  /* z-index: -1; */
  border: inherit;
  border-radius: inherit;
  /*   渐变 */
  background-image: conic-gradient(
    from var(--angle) at 50% 50%,
    #eeebff 0deg,
    #a193f6 90deg,
    #3dfcff 180deg,
    #ff7dd6 270deg,
    #eeebff 360deg
  );
  background-origin: border-box;
  /*   利用 content-box 和 border-box 的差值布尔来计算出一个描边蒙版 */
  -webkit-mask: linear-gradient(black, black), linear-gradient(black, black);
  mask: linear-gradient(black, black), linear-gradient(black, black);
  -webkit-mask-clip: content-box, border-box;
  mask-clip: content-box, border-box;
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  /*   应用动画 */
  animation: spin 3s linear infinite running;
}
.gradient-border .glow {
  /*   发光的基础样式 */
  position: absolute;
  inset: calc(var(--border-width) * -1);
  border-radius: inherit;
}
.gradient-border .glow::after {
  /*   白色的发光作为基础，其他发光继承这个class，只需要改颜色即可 */
  content: '';
  position: absolute;
  inset: calc(var(--border-width) * -1);
  /* z-index: -1; */
  border: calc(var(--border-width) * 2) solid transparent;
  border-radius: inherit;
  background-image: conic-gradient(
    from var(--angle) at 50% 50%,
    #eeebff 0deg,
    transparent 90deg,
    transparent 180deg,
    transparent 270deg,
    #eeebff 360deg
  );
  background-origin: border-box;
  -webkit-mask: linear-gradient(black, black), linear-gradient(black, black);
  mask: linear-gradient(black, black), linear-gradient(black, black);
  -webkit-mask-clip: content-box, border-box;
  mask-clip: content-box, border-box;
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: spin 4s linear infinite running;
}

.white-glow {
  /*   这个模糊要应用在蒙版的父级元素，不能用在蒙版的那个元素上，因此发光用了伪元素来实现，然后给原来的元素模糊 */
  filter: blur(20px);
}
/* 后续其他发光同理 */
.gradient-border .purple-glow::after {
  background-image: conic-gradient(
    from var(--angle) at 50% 50%,
    transparent 0deg,
    #a193f6 90deg,
    transparent 180deg
  );
  border: calc(var(--border-width) * 1) solid transparent;
}

.purple-glow {
  filter: blur(7px);
}

.gradient-border .red-glow::after {
  background-image: conic-gradient(
    from var(--angle) at 50% 50%,
    transparent 180deg,
    #ff7dd6 270deg,
    transparent 360deg
  );
  border: calc(var(--border-width) * 1) solid transparent;
}

.red-glow {
  filter: blur(8px);
}

.gradient-border .cyan-glow::after {
  background-image: conic-gradient(
    from var(--angle) at 50% 50%,
    transparent 90deg,
    #3dfcff 180deg,
    transparent 270deg
  );
  border: calc(var(--border-width) * 2) solid transparent;
}

.cyan-glow {
  filter: blur(15px);
}

/* 注册的变量才能进行动画 */
@property --angle {
  syntax: '<angle>';
  inherits: true;
  initial-value: 0turn;
}
/* 旋转动画 */
@keyframes spin {
  to {
    --angle: 1turn;
  }
}
</style>
