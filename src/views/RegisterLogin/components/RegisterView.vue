<template>
  <div class="Register-main-box">
    <n-form ref="formRef" inline label-width="100%" :model="formValue" :rules="rules" :size="size">
      <n-form-item label="UserName" path="userName">
        <n-input v-model:value="formValue.userName" placeholder="userName" />
      </n-form-item>
      <n-form-item label="Email" path="email">
        <n-input v-model:value="formValue.email" placeholder="email" />
      </n-form-item>
      <n-form-item label="Code" path="code">
        <n-input v-model:value="formValue.code" placeholder="code" />
        <n-button :disabled="!isEmailValid" style="height: 46px; margin-left: 10px"
          >获取验证码</n-button
        >
      </n-form-item>
      <n-form-item label="Password" path="password">
        <n-input v-model:value="formValue.password" placeholder="Password" />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" type="primary" @click="handleRegister"> Register </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { registerUser } from '@/http/user'
import type { FormInst } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { ref, reactive, watch } from 'vue'
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateCode,
} from '@/utils/validate.ts'
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const size = ref<'samll' | 'medium' | 'large'>('medium')
const isEmailValid = ref(false)
const formValue = reactive({
  userName: '',
  email: '',
  password: '',
  code: '',
})

const rules = {
  userName: {
    required: true,
    trigger: 'input',
    validator: validateUsername,
  },
  email: {
    required: true,
    trigger: 'input',
    validator: validateEmail,
  },
  code: {
    required: true,
    trigger: 'input',
    validator: validateCode,
  },
  password: {
    required: true,
    trigger: ['input', 'blur'],
    validator: validatePassword,
  },
}
const handleRegister = () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const res = await registerUser(formValue)
      console.log(res)
      if (res.data.code == 200) {
        message.success('注册成功')
      } else {
        message.error('注册失败')
      }
    } else {
      message.error('请检查输入合法性')
    }
  })
}
watch(
  () => formValue.email,
  async (newVal) => {
    await validateEmail(newVal, (error) => {
      if (error) {
        isEmailValid.value = false
      } else {
        isEmailValid.value = true
      }
    })
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.Register-main-box {
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
      margin: 25px 0;
    }
    & > div:nth-child(5) {
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
