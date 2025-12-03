import { defineStore } from 'pinia'
// 定义 User 接口
interface DATA {
  data: object,
  timestamp: number
}
export const useApiDataStore = defineStore('apiCache', {
  state: () => ({
    photoLibraryData: {
      data: {},
      timestamp: 0,
    } as DATA,
    articleData: {
      data: {},
      timestamp: 0,
    } as DATA,
    bannerData: {
      data: {},
      timestamp: 0,
    } as DATA,
    notesData: {
      data: {},
      timestamp: 0,
    } as DATA,
    sloganData: {
      data: {},
      timestamp: 0,
    } as DATA,
    aboutData: {
      data: {},
      timestamp: 0,
    } as DATA,
  }),
  actions: {
    setPhotoLibraryData(data: object, timestamp: number) {
      this.photoLibraryData.data = data
      this.photoLibraryData.timestamp = timestamp
    },
    setArticleData(data: object, timestamp: number) {
      this.articleData.data = data
      this.articleData.timestamp = timestamp
    },
    setBannerData(data: object, timestamp: number) {
      this.bannerData.data = data
      this.bannerData.timestamp = timestamp
    },
    setNotesData(data: object, timestamp: number) {
      this.notesData.data = data
      this.notesData.timestamp = timestamp
    },
    setSloganData(data: object, timestamp: number) {
      this.sloganData.data = data
      this.sloganData.timestamp = timestamp
    },
    setAboutData(data: object, timestamp: number) {
      this.aboutData.data = data
      this.aboutData.timestamp = timestamp
    },
  },
  persist: true,
})
