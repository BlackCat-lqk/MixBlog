<template>
  <div class="Login-main-box">
    <n-form ref="formRef" inline :label-width="80" :model="formValue" :rules="rules" :size="size">
      <n-form-item label="用户名称" path="userName">
        <n-input v-model:value="formValue.userName" placeholder="UserName" />
      </n-form-item>
      <n-form-item label="密码" path="password">
        <n-input v-model:value="formValue.password" placeholder="Password" />
      </n-form-item>
      <div><span>忘记密码?</span></div>
      <n-form-item>
        <n-button attr-type="button" type="primary" @click="handleLogin"> Login </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { NButton, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import type { FormInst } from 'naive-ui'
import { ref, reactive } from 'vue'
const router = useRouter()
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const size = ref<'samll' | 'medium' | 'large'>('medium')
const formValue = reactive({
  userName: '',
  password: '',
})
const rules = {
  userName: {
    required: true,
    message: '请输入用户名称',
    trigger: 'blur',
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: ['input', 'blur'],
  },
}
const handleLogin = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      router.push({ path: '/' })
      message.success('登录成功')
    } else {
      message.error('请检查账号或密码')
    }
  })
}
</script>

<style scoped lang="scss">
.Login-main-box {
  height: 100%;
  @include g.borderRadius(10px);
  display: flex;
  :deep(.n-form--inline) {
    display: flex;
    flex-direction: column;
    padding: 25px;
    justify-content: flex-start;
    & > div {
      width: 100%;
      margin: 30px 0;
    }
    & > div:nth-child(2) {
      margin-bottom: 10px;
    }
    & > div:nth-child(3) {
      margin: 0 0 10px 0;
      text-align: left;
      & > span:hover {
        cursor: pointer;
        color: blue;
      }
    }
    & > div:nth-child(4) {
      display: flex;
      justify-content: flex-end;
      margin: 0;
    }
    .n-input__input-el {
      height: 46px;
    }
  }
}
</style>
