import { defineStore } from 'pinia'
import type { UserData } from '@/tsInterface/index'

export const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    data: {
      token: '',
      user: {
        isLogin: false,
        avatar: '',
        email: '',
        role: '',
        status: '',
        userName: '',
        createdAt: '',
        updatedAt: '',
        sex: '',
        birthday: null,
        desc: '',
        _id: '',
      },
    } as UserData,
  }),
  actions: {
    setUserInfo(val: UserData) {
      this.data = val
    },
    setUserAvatar(val: string) {
      this.data.user.avatar = val
    },
    setAuthStatus(status: boolean) {
      this.data.user.isLogin = status
    },
    setAdminStatus(status: string) {
      this.data.user.role = status
    },
    removeUserInfo() {
      this.$reset()
      localStorage.removeItem('userInfo')
    },
  },
  persist: true,
})
