import { defineStore } from 'pinia'
// 定义 User 接口
interface DATA {
  data: object,
  timestamp: number
}
export const usePhotoLibraryStore = defineStore('apiCache', {
  state: () => ({
    photoLibraryData: {
      data: {},
      timestamp: 0,
    } as DATA,
    articleData: {
      data: {},
      timestamp: 0,
    } as DATA,
  }),
  actions: {
    setPhotoLibraryData(val: DATA) {
      this.photoLibraryData.data = val
    },
    setPhotoTimestamp(val: number) {
      this.photoLibraryData.timestamp = val
    },
    setArticleData(val: DATA) {
      this.articleData.data = val
    },
    setArticleTimestamp(val: number) {
      this.articleData.timestamp = val
    },
  },
  persist: true,
})
