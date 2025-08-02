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

// 日期格式化
interface resDate {
  date: string
  time: string
}
export function _formatTime(dateString: string): resDate {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从 0 开始
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return {
    date: `${year}-${month}-${day}`,
    time: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
  }
}
