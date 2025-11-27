<template>
  <div ref="searchContainer" class="search-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import docsearch from '@docsearch/js'
import '@docsearch/css'

const searchContainer = ref<HTMLElement>()

onMounted(() => {
  if (searchContainer.value) {
    docsearch({
      appId: import.meta.env.VITE_ALGOLIA_APP_ID,
      apiKey: import.meta.env.VITE_ALGOLIA_API_KEY,
      indexName: import.meta.env.VITE_ALGOLIA_INDEX_NAME,
      container: searchContainer.value,
    })
  }
})
</script>

<style>
.search-container {
  min-height: 40px;
  position: relative;
}
</style>
