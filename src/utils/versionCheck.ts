// 版本检测工具
class VersionChecker {
  private currentVersion: string;
  constructor() {
    this.currentVersion = import.meta.env.VITE_APP_VERSION || new Date().toISOString();
  }

  async checkUpdate(): Promise<boolean> {
    try {
      const response = await fetch('/version.json?t=' + Date.now());
      if (!response.ok) return false;
      const serverVersion = await response.json();
      const hasUpdate = serverVersion.buildTime !== this.currentVersion;
      if (hasUpdate) {
        // 预留逻辑：检测到更新时的操作
        console.log('检测缓存数据是否更新');
        // 只清除缓存，不刷新页面
        // await this.clearCachesOnly();
      }
      return hasUpdate;
    } catch (error) {
      console.warn('缓存数据更新失败:', error);
      return false;
    }
  }
  // 该方法有待改进
  private async clearCachesOnly(): Promise<void> {
    try {
      // 1. 清除 Cache Storage
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map(key => caches.delete(key)));
        console.log('Cache Storage 已清除');
      }

      // 2. 清除 Service Worker 缓存（但不注销）
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        // 发送清除缓存消息给 Service Worker
        registration.active?.postMessage({ type: 'CLEAR_CACHE' });
      }

      // 3. 清除 localStorage 和 sessionStorage（可选）
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });

      console.log('所有缓存已清除完成');

    } catch (error) {
      console.warn('清除缓存失败:', error);
    }
  }

  start() {
    // 每5分钟检查一次
    this.checkUpdate();
    setInterval(() => {
      this.checkUpdate();
    }, 5 * 60 * 1000);
  }
}

export const versionChecker = new VersionChecker();
