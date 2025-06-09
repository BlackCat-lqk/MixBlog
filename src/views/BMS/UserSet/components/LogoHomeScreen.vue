<template>
  <div class="logo-home-screen-box">
    <n-form ref="formRef" inline :label-width="80" :model="formValue">
      <n-form-item>
        <div class="logo-from-box">
          <n-upload action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
            list-type="image-card"/>
        </div>
      </n-form-item>
      <div>
        <n-space vertical>
          <n-form-item label="名称">
            <n-input v-model:value="formValue.name" type="text" placeholder="请输入名称" />
          </n-form-item>
          <n-form-item label="slogan">
            <n-input v-model:value="formValue.slogan" type="text" placeholder="请输入副文本" />
          </n-form-item>
        </n-space>
      </div>
      <div class="cover-box">
        <n-form-item label="上传封面">
          <n-upload action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
            list-type="image-card"/>
        </n-form-item>
      </div>
      <n-button type="info">应用</n-button>
    </n-form>
    <div class="preview-box"></div>
  </div>
</template>

<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { ref, reactive } from 'vue'

const formRef = ref<FormInst | null>(null)
const formValue = reactive({
  logoPicture: '',
  name: '',
  slogan: '',
  cover: ''
})
</script>

<style scoped lang="scss"></style>
