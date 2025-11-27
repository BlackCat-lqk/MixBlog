import type { Directive, DirectiveBinding } from 'vue'

interface LoadingElement extends HTMLElement {
  __loading__?: HTMLDivElement
  __originalPosition__?: string
  __originalOverflow__?: string
  __originalZIndex__?: string
}

interface LoadingOptions {
  show: boolean
  showText?: boolean
  width?: number | string
  text?: string
}

const createLoadingElement = (options: LoadingOptions): HTMLDivElement => {
  const { showText = true, width = 40, text = '' } = options
  const loading = document.createElement('div')
  loading.className = 'custom-loading-mask'

  // 根据width参数设置spinner的宽度和高度
  const spinnerWidth = typeof width === 'number' ? `${width}px` : width

  let innerHTML = `
    <div class="custom-loading-spinner">
      <div class="spinner" style="width: ${spinnerWidth}; height: ${spinnerWidth};"></div>
  `

  // 根据showText参数决定是否添加文字
  if (showText) {
    innerHTML += `<div class="loading-text">${text}</div>`
  }

  innerHTML += '</div>'
  loading.innerHTML = innerHTML

  return loading
}

const setLoading = (el: LoadingElement, binding: DirectiveBinding) => {
  // 确保元素形成BFC并有合适的定位上下文
  const options: LoadingOptions = binding.value

  if (options && options.show) {
    const computedStyle = getComputedStyle(el)

    // 保存原始样式
    el.__originalPosition__ = el.style.position || computedStyle.position
    el.__originalOverflow__ = el.style.overflow || computedStyle.overflow
    el.__originalZIndex__ = el.style.zIndex || computedStyle.zIndex

    // 添加预定义的CSS类来处理定位和BFC
    el.classList.add('custom-loading-container')
    // 创建loading元素
    if (!el.__loading__) {
      el.__loading__ = createLoadingElement(options)
    }

    // 添加到DOM中
    if (!el.__loading__.parentElement) {
      el.appendChild(el.__loading__)
    }
  } else {
    // 移除loading元素
    if (el.__loading__ && el.__loading__.parentElement) {
      el.removeChild(el.__loading__)
    }

    // 移除由指令添加的类
    el.classList.remove('custom-loading-container')

    // 恢复原始内联样式（如果有）
    if (el.__originalPosition__ !== undefined) {
      el.style.position = el.__originalPosition__
    }
    if (el.__originalOverflow__ !== undefined) {
      el.style.overflow = el.__originalOverflow__
    }
    if (el.__originalZIndex__ !== undefined) {
      el.style.zIndex = el.__originalZIndex__
    }

    // 清理保存的样式
    delete el.__originalPosition__
    delete el.__originalOverflow__
    delete el.__originalZIndex__
  }
}

const vLoading: Directive = {
  mounted(el: LoadingElement, binding) {
    setLoading(el, binding)
  },
  updated(el: LoadingElement, binding) {
    // 只有在值发生变化时才更新
    if (binding.value !== binding.oldValue) {
      setLoading(el, binding)
    }
  },
  beforeUnmount(el: LoadingElement) {
    // 清理工作
    if (el.__loading__) {
      if (el.__loading__.parentElement) {
        el.removeChild(el.__loading__)
      }
      delete el.__loading__
    }

    // 移除由指令添加的类
    el.classList.remove('custom-loading-container')

    // 恢复原始内联样式（如果有）
    if (el.__originalPosition__ !== undefined) {
      el.style.position = el.__originalPosition__
    }
    if (el.__originalOverflow__ !== undefined) {
      el.style.overflow = el.__originalOverflow__
    }
    if (el.__originalZIndex__ !== undefined) {
      el.style.zIndex = el.__originalZIndex__
    }

    // 清理保存的样式
    delete el.__originalPosition__
    delete el.__originalOverflow__
    delete el.__originalZIndex__
  }
}

export default vLoading
