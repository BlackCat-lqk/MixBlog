<template>
  <div class="favicon-box">
    <img :src="targetUrl" alt="favicon" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getFavicon } from '../../utils/getFavicon'

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
.favicon-box {
  width: 30px;
}

</style>
