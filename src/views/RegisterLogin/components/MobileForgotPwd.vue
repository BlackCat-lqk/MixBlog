<template>
  <n-modal-provider>
    <n-modal v-model:show="showModal" :mask-closable="false">
      <n-card title="找回密码" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <n-form ref="formRef" inline label-width="100%" :model="formValue" :rules="rules">
          <div class="forget-main-box">
            <div class="steps-box">
              <n-steps :current="current" :status="currentStatus">
                <n-step title="身份验证" />
                <n-step title="密码重置" />
                <n-step title="重置完成" />
              </n-steps>
            </div>
            <div class="form-content-box">
              <div class="content-input-box" v-show="current === 1">
                <n-form-item label="邮箱" path="email">
                  <n-input v-model:value="formValue.email" placeholder="输入邮箱" />
                </n-form-item>
                <n-form-item label="验证码" path="code">
                  <n-input v-model:value="formValue.code" placeholder="输入验证码" />
                  <n-button
                    type="info"
                    :disabled="!isEmailValid || isCounting"
                    style="margin-left: 10px"
                    @click="handleGetCode"
                    >{{ isCounting ? `${countdown}s 后重新获取` : '获取验证码' }}</n-button
                  >
                </n-form-item>
              </div>
              <div class="content-input-box" v-show="current === 2">
                <n-form-item label="密码" path="newPassword">
                  <n-input
                    v-model:value="formValue.newPassword"
                    type="password"
                    show-password-on="mousedown"
                    placeholder="输入密码"
                  />
                </n-form-item>
                <n-form-item label="再次输入密码" path="confirmPassword">
                  <n-input
                    v-model:value="formValue.confirmPassword"
                    type="password"
                    show-password-on="mousedown"
                    placeholder="再次确认密码"
                  />
                </n-form-item>
              </div>
              <div class="content-input-box finsh-input" v-show="current === 3">
                重置完成, 去登录！
              </div>
            </div>
          </div>
        </n-form>
        <template #footer>
          <n-button type="info" @click="onNegativeClick" strong secondary v-show="current !== 3">
            取消
          </n-button>
          <n-button type="info" @click="prev" v-show="current == 2"> 上一步 </n-button>
          <n-button type="info" @click="next" v-show="current == 1 || current == 2">
            下一步
          </n-button>
          <n-button type="info" @click="onNegativeClick" v-show="current === 3"> 完成 </n-button>
        </template>
      </n-card>
    </n-modal>
  </n-modal-provider>
</template>

<script lang="ts" setup>
import type { StepsProps, FormInst, FormItemRule } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { getResetEmailCodeApi, getVerifyEmailCodeApi, resetPasswordApi } from '@/http/user'
import { ref, watch, reactive, computed } from 'vue'
import { validateEmail, validatePassword, validateCode } from '@/utils/validate'
import { _debounce } from '@/utils/publickFun'

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const isEmailValid = ref(false)
const showModal = ref(false)
const current = ref<number | null>(1)
const currentStatus = ref<StepsProps['status']>('process')
const countdown = ref<number>(0) // 倒计时秒数
const isCounting = computed(() => countdown.value > 0) // 是否正在倒计时
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:show'])

const formValue = reactive({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: '',
})
// 再次输入密码验证
const confirmPassword = (rule: FormItemRule, value: string): boolean | Error => {
  return value === formValue.newPassword ? true : new Error('密码不一致')
}
const rules = {
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
  newPassword: {
    required: true,
    trigger: ['input', 'blur'],
    validator: validatePassword,
  },
  confirmPassword: {
    required: true,
    trigger: ['input', 'blur'],
    validator: confirmPassword,
  },
}
// 校验第一步
const validateStep1 = async () => {
  const params = {
    email: formValue.email,
    code: formValue.code,
  }
  const response = await getVerifyEmailCodeApi(params)
  const res = response.data
  if (res.code === 200) {
    current.value = 2
  } else {
    message.error(res.message)
  }
}
// 校验第二步
const validateStep2 = async () => {
  const params = {
    email: formValue.email,
    code: formValue.code,
    newPassword: formValue.newPassword,
  }
  const response = await resetPasswordApi(params)
  const res = response.data
  if (res.code === 200) {
    current.value = 3
  } else {
    message.error(res.message)
  }
}
// 下一步
const next = () => {
  if (current.value === null) {
    current.value = 1
  } else if (current.value >= 3) {
    current.value = null
  } else {
    if (current.value === 1) {
      // 须交验邮箱和验证码
      validateStep1()
    } else if (current.value === 2) {
      // 重置密码校验
      validateStep2()
    }
  }
}

// 上一步
const prev = () => {
  if (current.value === 0) current.value = null
  else if (current.value === null) current.value = 3
  else current.value--
}
// 关闭
const onNegativeClick = () => {
  showModal.value = false
  emit('update:show', false)
  current.value = 1
  // 清空表单校验
  formRef.value?.restoreValidation()
  // 清空表单输入
  formValue.code = ''
  formValue.email = ''
  formValue.newPassword = ''
  formValue.confirmPassword = ''
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
  const response = await getResetEmailCodeApi({ email: formValue.email })
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

watch(
  () => props.show,
  () => {
    if (props.show) {
      showModal.value = props.show
    }
  },
)
</script>

<style scoped lang="scss">
.forget-main-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  .form-content-box {
    width: 100%;
    // margin-top: 24px;
    .content-input-box {
      display: flex;
      flex-direction: column;
      gap: 24px;
      height: 220px;
      min-height: 220px;
    }
    .finsh-input {
      align-items: center;
      justify-content: center;
    }
    .n-form-item {
      margin-right: 0;
      :deep(.n-input__input-el) {
        height: 46px;
      }
    }
  }
}
:deep(.n-card__footer) {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  .n-button {
    width: 80px;
    height: 36px;
  }
}
</style>
