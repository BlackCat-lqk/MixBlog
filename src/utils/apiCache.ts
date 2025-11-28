import { useApiDataStore } from '@/stores/apiStore'
const store = useApiDataStore()
// 图库数据缓存
const getPhotoCachedData = async (fetchData: () => Promise<any>, ttl:number = 60 * 60 * 1000) => {
  if(store.photoLibraryData.data && Date.now() - store.photoLibraryData.timestamp < ttl){
    return store.photoLibraryData.data
  }
  const data = await fetchData()
  store.setPhotoLibraryData(data, Date.now())
  return data
}
// 文章数据缓存
const getArticleCachedData = async (val:string ,fetchData: (params:string) => Promise<any>, ttl:number = 5 * 60 * 1000) => {
  if(store.articleData.data && Date.now() - store.articleData.timestamp < ttl){
    return store.articleData.data
  }
  const data = await fetchData(val)
  store.setArticleData(data, Date.now())
  return data
}
// banner数据缓存
const getBannerCachedData = async (fetchData: () => Promise<any>, ttl:number = 60 * 60 * 1000) => {
  if(store.bannerData.data && Date.now() - store.bannerData.timestamp < ttl){
    return store.bannerData.data
  }
  const data = await fetchData()
  store.setBannerData(data, Date.now())
  return data
}
// 随笔数据缓存
const getNotesCachedData = async (val:object ,fetchData: (params:object) => Promise<any>, ttl:number = 5 * 60 * 1000) => {
  if(store.notesData.data && Date.now() - store.notesData.timestamp < ttl){
    return store.notesData.data
  }
  const data = await fetchData(val)
  store.setNotesData(data, Date.now())
  return data
}
// Slogan数据缓存
const getSloganCachedData = async (fetchData: () => Promise<any>, ttl:number = 60 * 60 * 1000) => {
  if(store.sloganData.data && Date.now() - store.sloganData.timestamp < ttl){
    return store.sloganData.data
  }
  const data = await fetchData()
  store.setSloganData(data, Date.now())
  return data
}
// 关于我数据缓存
const getAboutCachedData = async (val:{email:string, uId:string}, fetchData: (params:{email:string, uId:string}) => Promise<any>, ttl:number = 60 * 60 * 1000) => {
  if(store.aboutData.data && Date.now() - store.aboutData.timestamp < ttl){
    return store.aboutData.data
  }
  const data = await fetchData(val)
  store.setAboutData(data, Date.now())
  return data
}

export {
  getPhotoCachedData,
  getArticleCachedData,
  getBannerCachedData,
  getNotesCachedData,
  getSloganCachedData,
  getAboutCachedData
}
