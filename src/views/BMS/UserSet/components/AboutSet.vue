<template>
  <div class="about-set-main-box">
    <div class="about-content-box">
      <n-form ref="formRef" inline :label-width="80" :model="formValue" class="about-form-box">
        <n-form-item label="一句话介绍自己">
          <n-input v-model:value="formValue.introduction" placeholder="请输入..." />
        </n-form-item>
        <n-form-item label="标签（用空格隔开）">
          <n-input v-model:value="formValue.tags" placeholder="请输入..." />
        </n-form-item>
        <n-form-item
          v-for="(item, index) in formValue.modules"
          :key="index"
          :label="`模块${index + 1}`"
        >
          <template #label>
            <span class="module-title"
              >模块{{ index + 1 }} <img src="@/assets/images/Delete.svg" @click="deleteItem(index)"
            /></span>
          </template>
          <div class="module-input-box">
            <n-input v-model:value="item.title" placeholder="请输入标题..." />
            <n-input v-model:value="item.content" type="textarea" placeholder="请输入内容..." />
          </div>
        </n-form-item>
        <n-form-item>
          <n-space vertical>
            <n-button type="info" @click="addItem">
              <img style="width: 16px" src="@/assets/images/Add.svg" />添加模块
            </n-button>
            <n-button attr-type="button" @click="handleValidateClick"> 应用 </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </div>
    <div class="preview-box">
      <div class="sample-btn">
        <n-button type="info">示例</n-button>
      </div>
      <div class="preview-content-box">
        <div class="avatar-box">
          <img src="@/assets/images/logo2024.png" />
        </div>
        <h3 class="user-name-title">ikun</h3>
        <span>{{ formValue.introduction }}</span>
        <n-space>
          <n-tag v-for="(item, idx) in previewTags" :key="idx" :bordered="false">
            {{ item }}
          </n-tag>
        </n-space>
        <n-space vertical>
          <div class="preview-module-box" v-for="(item, idx) in formValue.modules" :key="idx">
            <h3>{{ item.title }}</h3>
            <p>{{ item.content }}</p>
          </div>
        </n-space>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import type { FormInst } from 'naive-ui'

const formRef = ref<FormInst | null>(null)
interface modulesType {
  title: string
  content: string
}
interface formType {
  introduction: string
  tags: string
  modules: modulesType[]
}
const formValue: formType = reactive({
  introduction: '',
  tags: '',
  modules: [{ title: '', content: '' }],
})
const addItem = () => {
  formValue.modules.push({ title: '', content: '' })
}
const deleteItem = (idx: number) => {
  formValue.modules.splice(idx, 1)
}
const handleValidateClick = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      console.log('验证通过')
    } else {
      console.log(errors)
    }
  })
}
const previewTags = computed(() => {
  return formValue.tags ? formValue.tags.split(' ') : []
})
</script>

<style scoped lang="scss">
.about-set-main-box {
  display: flex;
  padding: 20px 10px;
  gap: 24px;
  height: auto;
  background-color: #2e33380d;
  border-radius: 8px;
  .about-content-box {
    flex: 0.5;
    min-height: 500px;
    .about-form-box {
      display: flex;
      flex-direction: column;
      .module-title {
        display: flex;
        align-items: center;
        img {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }
      }
      .module-input-box {
        display: flex;
        flex-direction: column;
        gap: 8px;
        .n-input {
          width: 100%;
        }
      }
    }
  }

  .preview-box {
    flex: 0.5;
    position: relative;
    border-radius: 8px;
    background: url(@/assets/wallpaper/regist-login.jpg);
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    .sample-btn {
      position: absolute;
      left: 2%;
      top: 2%;
    }
    .preview-content-box {
      position: absolute;
      width: 100%;
      top: 10%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      .avatar-box {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 1px solid #ccc;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .preview-module-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
  }
}
</style>
