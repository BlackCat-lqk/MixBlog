import { defineStore } from 'pinia'
// 定义 User 接口
interface User {
  avatar: string
  email: string
  role: string
  status: string
  userName: string
  _id: string
}

// 定义整个 data 的结构
interface UserData {
  token: string
  user: User
}
export const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    data: {
      token: '',
      user: {
        avatar: '',
        email: '',
        role: '',
        status: '',
        userName: '',
        _id: '',
      }
    } as UserData,
  }),
  actions: {
    setUserInfo(val: UserData) {
      this.data = val
    },
  },
  persist: true,
})
