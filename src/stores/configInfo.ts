import { defineStore } from 'pinia'
// 定义 User 接口
interface Slogan {
  logoPicture: string
  logoName: string
  sloganTitle: string
  sloganSub1: string
  sloganSub2: string
  cover: string
}
export const useSloganInfoStore = defineStore('sloganConfigInfo', {
  state: () => ({
    sloganConfig: {
      logoPicture: '',
      logoName: '',
      sloganTitle: '',
      sloganSub1: '',
      sloganSub2: '',
      cover: '',
    } as Slogan,
  }),
  actions: {
    setSloganConfig(val: Slogan) {
      this.sloganConfig = val
    },
  },
  persist: false,
})
