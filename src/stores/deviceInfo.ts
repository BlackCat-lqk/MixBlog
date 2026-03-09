import { defineStore } from 'pinia'
import type { Dvice } from '@/tsInterface/index'

export const useDeviceStore = defineStore('deviceInfo', {
  state: () => ({
    ip: '',
    userAgent: ''
  }),
  actions: {
    setDeviceInfo(val: Dvice) {
      this.ip = val.ip
      this.userAgent = val.userAgent
    },
    removeDeviceInfo() {
      this.$reset()
      localStorage.removeItem('deviceInfo')
    },
  },
  persist: true,
})
