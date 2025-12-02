<template>
  <n-modal-provider>
    <n-modal v-model:show="showModal" :mask-closable="false">
      <n-card style="width: 600px" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <n-form ref="formRef" inline label-width="100%" :model="formValue" :rules="rules">
          <div class="forget-main-box">
            <div class="steps-box">
              <n-steps :current="current" :status="currentStatus">
                <n-step :title="$t('login.authentication')" />
                <n-step :title="$t('login.resetPwd')" />
                <n-step :title="$t('login.finish')" />
              </n-steps>
            </div>
            <div class="form-content-box">
              <div class="content-input-box" v-show="current === 1">
                <n-form-item :label="$t('common.email')" path="email">
                  <n-input
                    v-model:value="formValue.email"
                    clearable
                    :placeholder="$t('common.emailPlaceholder')"
                  >
                    <template #prefix>
                      <img width="20px" src="@/assets/images/Email.svg" alt="Email" />
                    </template>
                  </n-input>
                </n-form-item>
                <n-form-item :label="$t('common.code')" path="code">
                  <n-input
                    v-model:value="formValue.code"
                    clearable
                    :placeholder="$t('common.codePlaceholder')"
                  >
                    <template #prefix>
                      <img width="20px" src="@/assets/images/Verification.svg" alt="verification" />
                    </template>
                  </n-input>
                  <n-button
                    type="info"
                    :disabled="!isEmailValid || isCounting"
                    style="height: 46px; width: 120px; margin-left: 10px"
                    @click="handleGetCode"
                    >{{
                      isCounting ? `${countdown}s` + $t('common.resetCode') : $t('common.getCode')
                    }}</n-button
                  >
                </n-form-item>
              </div>
              <div class="content-input-box" v-show="current === 2">
                <n-form-item :label="$t('common.pwd')" path="newPassword">
                  <n-input
                    v-model:value="formValue.newPassword"
                    type="password"
                    clearable
                    show-password-on="mousedown"
                    :placeholder="$t('common.pwdPlaceholder')"
                  >
                    <template #prefix>
                      <img width="20px" src="@/assets/images/passWord.svg" alt="password" />
                    </template>
                  </n-input>
                </n-form-item>
                <n-form-item :label="$t('common.confirmPwd')" path="confirmPassword">
                  <n-input
                    v-model:value="formValue.confirmPassword"
                    type="password"
                    clearable
                    show-password-on="mousedown"
                    :placeholder="$t('common.confirmPwdPlaceholder')"
                  >
                    <template #prefix>
                      <img width="20px" src="@/assets/images/passWord.svg" alt="password" />
                    </template>
                  </n-input>
                </n-form-item>
              </div>
              <div class="content-input-box finsh-input" v-show="current === 3">
                {{ $t('login.finishTip') }}
              </div>
            </div>
          </div>
        </n-form>
        <template #footer>
          <n-button type="info" @click="onNegativeClick" strong secondary v-show="current !== 3">
            {{ $t('common.cancel') }}
          </n-button>
          <n-button type="info" @click="prev" v-show="current == 2">
            {{ $t('login.lastStep') }}
          </n-button>
          <n-button type="info" @click="next" v-show="current == 1 || current == 2">
            {{ $t('login.nextStep') }}
          </n-button>
          <n-button type="info" @click="onNegativeClick" v-show="current === 3">
            {{ $t('login.finish1') }}
          </n-button>
        </template>
      </n-card>
    </n-modal>
  </n-modal-provider>
</template>

<script lang="ts" setup>
import type { StepsProps, FormInst, FormItemRule } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { getResetEmailCodeApi, getVerifyEmailCodeApi, resetPasswordApi } from '@/http/user'
import { validateEmail, validatePassword, validateCode } from '@/utils/validate'
import { _debounce } from '@/utils/publickFun'
const { t } = useI18n()

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
  return value === formValue.newPassword ? true : new Error(t('login.confirmPwdError'))
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
let timer: any
const startCountdown = () => {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
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
onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped lang="scss">
.forget-main-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  .form-content-box {
    width: 100%;
    margin-top: 24px;
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
