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
