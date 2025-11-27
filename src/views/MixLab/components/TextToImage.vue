<template>
  <canvas ref="canvasEl" :style="{ width: props.data.width, height: props.data.height }"></canvas>
</template>

<script lang="ts" setup>
interface Data {
  uploadedImage: string
  width: string
  height: string
  text: string,
  content: string,
}

interface Prop {
  data: Data
}

const props = withDefaults(defineProps<Prop>(), {
  data: () => ({
    uploadedImage: '',
    width: '300px',
    height: '300px',
    text: 'hello, world',
    content: 'hello, world。 你好，世界',
  }),
})

const canvasEl = ref<HTMLCanvasElement | null>(null)
// const isGenerated = ref(false)
// 绘制画布
const drawCanvas = () => {
  const canvas = canvasEl.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  if (!ctx) return
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 绘制背景
  ctx.fillStyle = '#999'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 如果有上传的图片，先绘制图片
  if (props.data.uploadedImage) {
    const img = new Image()
    img.onload = () => {
      // 绘制图片，保持比例
      const ratio = Math.min(canvas.width / img.width, canvas.height / img.height)
      const width = img.width * ratio
      const height = img.height * ratio
      const x = (canvas.width - width) / 2
      const y = (canvas.height - height) / 2
      ctx.drawImage(img, x, y, width, height)
      // 在图片上绘制文本
      drawText(ctx)
    }
    img.src = props.data.uploadedImage
  } else {
    // 直接绘制文本
    drawText(ctx)
  }
}

// 绘制文字
const drawText = (ctx: CanvasRenderingContext2D) => {
  ctx.font = `16px Arial`
  ctx.fillStyle = '#000'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  // 文本换行处理
  const lines = props.data.text.split('\n')

  const content = props.data.content.split('\n')

  lines.forEach((line) => {
    ctx.fillText(line, 70, 20)
  })
  content.forEach((line) => {
    ctx.fillText(line, 70, 50)
  })
}

// 清空画布
// const clearCanvas = () => {
//   const canvas = canvasEl.value
//   if(!canvas) return
//   const ctx = canvas.getContext('2d')
//   ctx.clearRect(0, 0, canvas.width, canvas.height)
// isGenerated.value = false
// }

// 监听属性变化，实时更新Canvas
watch(
  () => [props.data.uploadedImage, props.data.text, props.data.width, props.data.height],
  () => {
    nextTick(() => {
      drawCanvas()
    })
  },
  { deep: true },
)

onMounted(() => {
  drawCanvas()
})
</script>

<style lang="scss" scoped></style>
