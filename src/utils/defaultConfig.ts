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
    logoPicture: '/uploads/defalut/logo-transparent.webp',
    logoName: 'Mix Blog',
    sloganTitle: 'Mix Blog',
    sloganSub1: '记录生活',
    sloganSub2: '学习充电',
    cover: '/uploads/defalut/logo1024.svg',
  } as Slogan
}
