import { defineStore } from 'pinia'
import type { Slogan } from '@/tsInterface/index'
export const useSloganInfoStore = defineStore('sloganConfigInfo', {
  state: () => ({
    sloganConfig: {
      logoPicture: '',
      logoName: '',
      sloganTitle: '',
      sloganSub1: '',
      sloganSub2: '',
      cover: '/uploads/defalut/logo2024.webp',
    } as Slogan,
  }),
  actions: {
    setSloganConfig(val: Slogan) {
      this.sloganConfig = val
    },
  },
  persist: false,
})
