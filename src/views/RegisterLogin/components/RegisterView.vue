<template>
  <div class="Register-main-box">
    <n-form ref="formRef" inline label-width="100%" :model="formValue" :rules="rules" size="medium">
      <n-form-item label="UserName" path="userName">
        <n-input v-model:value="formValue.userName" placeholder="userName" />
      </n-form-item>
      <n-form-item label="Email" path="email">
        <n-input v-model:value="formValue.email" placeholder="email" />
      </n-form-item>
      <n-form-item label="Code" path="code">
        <n-input v-model:value="formValue.code" placeholder="code" />
        <n-button
          :disabled="!isEmailValid || isCounting"
          style="height: 46px; margin-left: 10px"
          @click="handleGetCode"
          >{{ isCounting ? `${countdown}s 后重新获取` : '获取验证码' }}</n-button
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
import { registerUserApi, getEmailCodeApi } from '@/http/user'
import type { FormInst } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { ref, reactive, watch, computed, onMounted } from 'vue'
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateCode,
} from '@/utils/validate.ts'
import { _debounce } from '@/utils/publickFun'
import { useUserInfoStore } from '@/stores/userInfo'
import { useRouter } from 'vue-router'
const message = useMessage()
const router = useRouter()
const userInfoStore = useUserInfoStore()
const formRef = ref<FormInst | null>(null)
const isEmailValid = ref(false)
const countdown = ref<number>(0) // 倒计时秒数
const isCounting = computed(() => countdown.value > 0) // 是否正在倒计时
interface formType {
  userName: string
  email: string
  password: string
  code: string
}
const formValue: formType = reactive({
  userName: '',
  email: '',
  password: '',
  code: '',
})

// 验证规则
const rules = {
  userName: {
    required: true,
    trigger: ['input', 'blur'],
    validator: validateUsername,
  },
  email: {
    required: true,
    trigger: ['input', 'blur'],
    validator: validateEmail,
  },
  code: {
    required: true,
    trigger: ['input', 'blur'],
    validator: validateCode,
  },
  password: {
    required: true,
    trigger: ['input', 'blur'],
    validator: validatePassword,
  },
}
// 注册
const handleRegister = () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const res = await registerUserApi(formValue)
      console.log(res)
      if (res.data.code == 200) {
        message.success('注册成功')
        // 注册成功后跳转到首页并注入用户信息和token
        userInfoStore.setUserInfo(res.data.data)
        router.push({ path: '/' })
      } else {
        message.error(res.data.message)
      }
    } else {
      message.error('请检查输入合法性')
    }
  })
}
// 启动倒计时函数
const startCountdown = () => {
  const interval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(interval)
      localStorage.removeItem('countdownEndTime')
    }
  }, 1000)
}
// 获取邮箱验证码
const handleGetCode = _debounce(async () => {
  if (!isEmailValid.value || isCounting.value) return
  const response = await getEmailCodeApi({ email: formValue.email })
  const res = response.data
  if (res.code === 200) {
    // 设置倒计时 60 秒
    const endTime = Date.now() + 60 * 1000
    localStorage.setItem('countdownEndTime', endTime.toString())
    countdown.value = 60
    startCountdown()
  } else {
    message.error(res.message)
  }
}, 300)
watch(
  () => formValue.email,
  async (newVal) => {
    const res = validateEmail(null, newVal)
    isEmailValid.value = res instanceof Error
    if (isEmailValid.value) {
      isEmailValid.value = false
    } else {
      isEmailValid.value = true
    }
  },
  { immediate: true },
)
// 初始化倒计时（刷新页面不重置）
const initCountdown = () => {
  const storedTime = localStorage.getItem('countdownEndTime')
  if (storedTime) {
    const endTime = parseInt(storedTime, 10)
    const now = Date.now()
    const remaining = Math.max(Math.floor((endTime - now) / 1000), 0)

    if (remaining > 0) {
      countdown.value = remaining
      startCountdown()
    } else {
      localStorage.removeItem('countdownEndTime')
    }
  }
}
onMounted(() => {
  initCountdown()
})
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
    }
    & > div:nth-child(5) {
      display: flex;
      justify-content: flex-end;
    }
    .n-input__input-el {
      height: 46px;
    }
  }
}
</style>
