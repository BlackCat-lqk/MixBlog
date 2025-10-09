/**
 * 监听点击元素，滚动视图窗口
 *
 */
// src/directives/preventScrollPassthrough.ts
import type { Directive } from 'vue'

const preventScrollThrough = (el: HTMLElement) => {
  const onWheel = (event: WheelEvent) => {
    const isTop = el.scrollTop === 0 && event.deltaY < 0
    const isBottom = el.scrollHeight - el.clientHeight === el.scrollTop && event.deltaY > 0

    if (isTop || isBottom) {
      event.preventDefault()
    }
  }

  el.addEventListener('wheel', onWheel, { passive: false })
  // 清理函数
  ;(el as HTMLElement & { __preventScroll__?: (event: WheelEvent) => void }).__preventScroll__ =
    onWheel
}

const removeEventListener = (el: HTMLElement) => {
  const onWheel = (el as HTMLElement & { __preventScroll__?: (event: WheelEvent) => void })
    .__preventScroll__
  if (onWheel) {
    el.removeEventListener('wheel', onWheel)
    delete (el as HTMLElement & { __preventScroll__?: (event: WheelEvent) => void })
      .__preventScroll__
  }
}

const vPreventScrollPassthrough: Directive = {
  mounted(el) {
    preventScrollThrough(el)
  },
  beforeUnmount(el) {
    removeEventListener(el)
  },
}

export default vPreventScrollPassthrough
