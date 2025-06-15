/**
 * 默认配置项
 */
export const sloganConfigData = () => {
  interface Slogan {
    logoPicture: string
    logoName: string
    sloganTitle: string
    sloganSub1: string
    sloganSub2: string
    cover: string
  }
  return {
    logoPicture: '@/assets/images/logo-transparent.png',
    logoName: 'Mix Blog',
    sloganTitle: 'Mix Blog',
    sloganSub1: '记录生活',
    sloganSub2: '学习充电',
    cover: '@/assets/images/logo2024.png',
  } as Slogan
}
