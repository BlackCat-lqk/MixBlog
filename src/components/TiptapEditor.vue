<template>
  <QuillEditor theme="snow" v-model:content="editorContent" content-type="text" />
</template>

<script lang="ts" setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { ref } from 'vue'

const editorContent = ref('')
</script>
