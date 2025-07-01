<template>
  <div class="Register-main-box">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="formValue.userName"
          name="userName"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="formValue.email"
          name="email"
          label="邮箱"
          placeholder="邮箱"
          :rules="[
            { required: true, message: '请填写电子邮箱' },
            {
              required: true,
              pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
              message: '邮箱格式不正确',
            },
          ]"
        />
        <div class="is-code-send">
          <van-field
            v-model="formValue.code"
            name="code"
            label="验证码"
            placeholder="请输入验证码..."
            :rules="[
              { required: true, message: '请填写验证码' },
              {
                validator: (value) => {
                  return value && value.length >= 6 && value.length <= 20
                },
                message: '密码长度需在6到20个字符之间',
              }
            ]"
          />
          <van-button
            type="primary"
            :disabled="!isEmailValid || isCounting"
            @click="handleGetCode"
            style="width: 90%"
            >{{ isCounting ? `${countdown}s 后重新获取` : '获取验证码' }}</van-button
          >
        </div>

        <van-field
          v-model="formValue.password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[
            { required: true, message: '请填写密码' },
            {
              validator: (value) => {
                return value && value.length >= 6 && value.length <= 20
              },
              message: '密码长度需在6到20个字符之间',
            },
            { pattern: /^[^\u4e00-\u9fa5]*$/, required: true, message: '密码为数字、字母、符号' },
          ]"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit"> 注册 </van-button>
      </div>
    </van-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { registerUserApi, getEmailCodeApi } from '@/http/user'
import {
  validateEmail,
} from '@/utils/validate.ts'
import { _debounce } from '@/utils/publickFun'
import { useUserInfoStore } from '@/stores/userInfo'
import { useRouter } from 'vue-router'
import { showNotify } from 'vant'
// import { addAdminRoutes } from '@/router'
const router = useRouter()
const userInfoStore = useUserInfoStore()
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
// 注册
const onSubmit = async (values: formType) => {
  const response = await registerUserApi(values)
  const res = response.data
  if (res.code === 200) {
    showNotify({ type: 'primary', message: `欢迎您：${res.data.user.userName}` })
    userInfoStore.setUserInfo(res.data)
    userInfoStore.setAuthStatus(true)
    router.push({ path: '/' })
  } else {
    showNotify({ type: 'danger', message: '登录失败,请检查账号邮箱或密码' })
  }
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
    showNotify({ type: 'danger', message: res.message })
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
  .van-cell-group--inset {
    display: flex;
    gap: 16px;
    flex-direction: column;
    .van-cell-group {
      background: none;
    }
    .van-cell {
      border-radius: 8px;
    }
    .is-code-send {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
