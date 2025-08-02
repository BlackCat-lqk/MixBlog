/** * QuillView.vue * @description: 预览组件，不提供文本编辑功能 */
<template>
  <QuillEditor
    content-type="html"
    style="border: none"
    :content="editorContent"
    readonly
    :options="Options"
  />
</template>

<script lang="ts" setup>
import { QuillEditor } from '@vueup/vue-quill'
import hljs from 'highlight.js'
import Syntax from 'quill/modules/syntax'
import Quill from 'quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'highlight.js/styles/monokai-sublime.css'
// 注册语法高亮模块
Quill.register('modules/syntax', Syntax)

const editorContent = ref('')
const Options = {
  modules: {
    toolbar: false, // 隐藏工具栏
    syntax: {
      highlight: (text: string) => hljs.highlightAuto(text).value,
    },
  },
}
</script>

<style scoped></style>
