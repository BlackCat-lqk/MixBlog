<template>
  <iframe
    :src="`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(props.fileUrl)}`"
    class="office-iframe"
    frameborder="0"
  ></iframe>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

const props = defineProps({
  fileUrl: {
    type: String,
    required: true,
  },
})
onMounted(() => {
  console.log(props.fileUrl)
})
</script>

<style scoped>
.office-iframe {
  width: 100%;
  height: 600px;
  border: 1px solid #ddd;
}
</style>
