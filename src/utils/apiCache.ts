import { usePhotoLibraryStore } from '@/stores/apiStore'
const store = usePhotoLibraryStore()
const getPhotoCachedData = async (fetchData: () => Promise<any>, ttl:number = 30 * 60 * 1000) => {
  if(store.photoLibraryData.data && Date.now() - store.photoLibraryData.timestamp < ttl){
    return store.photoLibraryData.data
  }
  const data = await fetchData()
  store.setPhotoLibraryData(data)
  store.setPhotoTimestamp(Date.now())
  return data
}

const getArticleCachedData = async (val:string ,fetchData: (params:string) => Promise<any>, ttl:number = 1 * 60 * 1000) => {
  if(store.articleData.data && Date.now() - store.articleData.timestamp < ttl){
    return store.articleData.data
  }
  const data = await fetchData(val)
  store.setArticleData(data)
  store.setArticleTimestamp(Date.now())
  return data
}

export {
  getPhotoCachedData,
  getArticleCachedData
}
