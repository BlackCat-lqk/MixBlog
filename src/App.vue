<template>
  <main>
    <!-- <div class="mix-main-progress-bar">
      <n-progress type="line" :percentage="loadedResources" indicator-placement="inside" processing />
    </div> -->

    <n-message-provider>
      <RouterView />
    </n-message-provider>
  </main>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
// import { ref } from 'vue'
// const resources = window.performance.getEntriesByType('resource')
// const totalResources = resources.length
// let loadedResources = 0
// const progressData = ref(0)
// resources.forEach((resource) => {
//   if (resource.initiatorType != 'xmlhttprequest') {
//     resources.onload = () => {
//       loadedResources++
//       progressData.value = Math.round((loadedResources / totalResources) * 100)
//     }
//   }
// })
</script>

<style scoped lang="scss"></style>
