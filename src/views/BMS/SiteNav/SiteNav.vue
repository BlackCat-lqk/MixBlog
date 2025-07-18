<template>
  <div class="bms-main-box">
    <div class="header-box">
      <header-view></header-view>
    </div>
    <div class="content-box">
      <div class="sidebar-box">
        <naviga-menu></naviga-menu>
      </div>
      <div class="site-nav-main">
        <div class="favicon-box">
          <img :src="targetUrl" alt="favicon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getFavicon } from '@/utils/getFavicon'
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'

const targetUrl = ref('' as string)

const testFaviconFetching = async () => {
  const testUrl = 'https://cn.vuejs.org/'
  const result = await getFavicon(testUrl)
  if (result) {
    console.log('成功获取favicon:', result)
    targetUrl.value = result
    return result
  } else {
    return false
  }
}
onMounted(() => {
  testFaviconFetching()
})
</script>

<style lang="scss" scoped>
@include g.bms;
.site-nav-main {
  padding: 10px;
  gap: 12px;
  display: flex;
  flex-direction: column;
}
</style>
