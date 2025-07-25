import { defineStore } from 'pinia'
interface Dvice {
  ip: string
  userAgent: string
}
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
