/** * QuillView.vue * @description: 副文本编辑组件 */
<template>
  <QuillEditor
    theme="snow"
    v-model:content="editorContent"
    content-type="html"
    :options="Options"
  />
</template>

<script lang="ts" setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import Quill from 'quill'
import bold from 'quill/formats/bold'
import italic from 'quill/formats/italic'
import underline from 'quill/formats/underline'
import hljs from 'highlight.js'
import Syntax from 'quill/modules/syntax'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'highlight.js/styles/monokai-sublime.css'

// 注册语法高亮模块
Quill.register('modules/syntax', Syntax)
Quill.register('formats/bold', bold)
Quill.register('formats/italic', italic)
Quill.register('formats/underline', underline)

// 可选：如果你需要语法高亮
import syntax from 'quill/modules/syntax'
Quill.register('modules/syntax', syntax)

const editorContent = ref('')

// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗、斜体、下划线、删除线
  ['blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // 上标/下标
  [{ indent: '-1' }, { indent: '+1' }], // 缩进
  [{ direction: 'rtl' }], // 文字方向
  [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }], // 颜色选择器
  [{ font: [] }],
  [{ align: [] }],
  ['clean'], // 清除格式
  ['link', 'image', 'video'], // 插入链接、图片、视频
]
const Options = {
  // toolbar: toolbarOptions, // 使用自定义工具栏配置
  modules: {
    toolbar: toolbarOptions, // 隐藏工具栏
    syntax: {
      highlight: (text: string) => hljs.highlightAuto(text).value,
    },
  },
}
</script>
