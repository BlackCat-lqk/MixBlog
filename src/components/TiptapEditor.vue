<template>
  <div class="menu-bar">
    <!-- 添加 H1 按钮 -->
    <button
      @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
      :class="{ 'is-active': editor?.isActive('heading', { level: 1 }) }"
    >
      H1
    </button>

    <!-- 添加 H2 按钮 -->
    <button
      @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
      :class="{ 'is-active': editor?.isActive('heading', { level: 2 }) }"
    >
      H2
    </button>
  </div>
  <editor-content :editor="editor" class="editor-content" />
</template>

<script lang="ts" setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'

const editor = useEditor({
  content: '<p>Hello World!</p>',
  extensions: [StarterKit, TextStyle]
})
</script>

<style lang="scss" scoped>
:deep(.ProseMirror){
   h1{
  font-size: 2em;
  font-weight: bold;
}

 h2{
  font-size: 1.5em;
  font-weight: bold;
}

}
</style>
