/**
 * @description 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} delay - 防抖时间间隔（毫秒）
 * @returns {Function} - 包装后的防抖函数
 */
export function _debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>): void => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func(...args)
    }, delay)
  }
}
