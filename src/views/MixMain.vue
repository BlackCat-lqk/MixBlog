<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <HomeView></HomeView>
  <footer>
    <FooterNav></FooterNav>
  </footer>
</template>

<script lang="ts" setup>
import HeaderNav from '@/views/Header/HeaderNav.vue'
import FooterNav from '@/views/Footer/FooterNav.vue'
import HomeView from '@/views/Home/HomeView.vue'
import { getSloganApi } from '@/http//slogan'
import { sloganConfigData } from '@/utils/defaultConfig'
import { useSloganInfoStore } from '@/stores/configInfo'
const sloganStore = useSloganInfoStore()
// 获取logo图及logo文本和Slogan等数据
const getSloganData = async () => {
  const response = await getSloganApi()
  const res = response.data
  if (res.code == 200) {
    sloganStore.setSloganConfig(res.data)
  } else {
    // 没有登录或获取数据失败就使用默认配置
    const defaultData = sloganConfigData()
    sloganStore.setSloganConfig(defaultData)
  }
}
onMounted(() => {
  getSloganData()
})
</script>
