<template>
  <div style="height: 100vh">
    <vue-reader :url="props.url" />
  </div>
</template>
<script lang="ts" setup>
import { VueReader } from 'vue-book-reader'

const props = defineProps({
  url: {
    type: String,
    required: true
  }
})
</script>
