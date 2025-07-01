export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 统计分类设备类型
export function getDeviceType() {
  const ua = navigator.userAgent;
  if (/Android/.test(ua)) {
    return 'Android';
  } else if (/iPhone|iPad|iPod/.test(ua)) {
    return 'iOS';
  } else if (/Windows/.test(ua)) {
    return 'Windows';
  } else if (/Macintosh/.test(ua)) {
    return 'Mac';
  } else {
    return 'Unknown';
  }
}

// 设置移动端设备的字体尺寸
export function setRem() {
  if(!isMobileDevice()) return
  const baseSize = 16
  const scale = document.documentElement.clientWidth / 375 // 以 iPhone 6 为基准
  document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
}
window.addEventListener('resize', setRem)
setRem()
