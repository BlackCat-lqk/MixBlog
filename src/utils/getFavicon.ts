/**
 * 尝试多种方法获取网站的favicon
 * @param targetUrl 目标网站URL
 * @returns Promise<string | false> 成功返回URL字符串，失败返回false
 */
export async function getFavicon(targetUrl: string): Promise<string | false> {
  // 方法1：解析HTML获取
  try {
    const parsedFavicon = await fetchFavicon(targetUrl)
    if (parsedFavicon) {
      // 验证获取到的favicon是否有效
      const response = await fetch(parsedFavicon, { method: 'HEAD' })
      if (response.ok) {
        return parsedFavicon
      }
    }
  } catch (error) {
    console.log(error)
  }

  // 方法2：直接获取favicon.ico
  try {
    const faviconUrl = getFaviconUrl(targetUrl)
    // 可以添加一个HEAD请求验证favicon是否存在
    const response = await fetch(faviconUrl, { method: 'HEAD' })
    if (response.ok) {
      return faviconUrl
    }
  } catch (error) {
    console.log(error)
  }

  // 方法3：使用Google Favicon API（备用方案）
  try {
    const domain = new URL(targetUrl).hostname
    const googleFavicon = `https://www.google.com/s2/favicons?domain=${domain}`
    const response = await fetch(googleFavicon, { method: 'HEAD' })
    if (response.ok) {
      return googleFavicon
    }
  } catch (error) {
    console.log("🚀 ~ getFavicon ~ error:", error)
  }

  // 所有方法都失败
  return false
}

// 辅助方法：直接获取favicon.ico
function getFaviconUrl(targetUrl: string): string {
  const domain = new URL(targetUrl).origin
  return `${domain}/favicon.ico`
}

// 辅助方法：解析HTML获取favicon
async function fetchFavicon(targetUrl: string): Promise<string | null> {
  try {
    const response = await fetch(targetUrl)
    const html = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    const iconLink = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]')

    if (iconLink) {
      const href = iconLink.getAttribute('href')
      if (!href) return null
      return new URL(href, targetUrl).href
    }
    return new URL('/favicon.ico', targetUrl).href
  } catch (error) {
    console.log("🚀 ~ fetchFavicon ~ error:", error)
    return null
  }
}
