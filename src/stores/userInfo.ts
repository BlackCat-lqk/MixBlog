import { defineStore } from 'pinia'
// 定义 User 接口
interface User {
  avatar: string
  email: string
  role: string
  status: string
  userName: string
  _id: string
  createdAt: string
  updatedAt: string
  sex: string
  birthday: null
  desc: string
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
    removeUserInfo() {
      this.$reset()
      localStorage.removeItem('userInfo')
    },
  },
  persist: true,
})
